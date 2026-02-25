/**
 * Proto file loading and extraction using protobufjs.
 *
 * Loads .proto files, resolves imports from the local googleapis directory,
 * and extracts services, RPCs, messages, and field behaviors.
 */

import protobuf from "protobufjs";
import path from "path";
import fs from "fs";
import {
  FieldBehavior,
  ParsedEnum,
  ParsedEnumValue,
  ParsedField,
  ParsedMessage,
  ParsedOneofGroup,
  ParsedRPC,
  ParsedService,
  ParsedProtoResult,
} from "./types.ts";

const PROJECT_ROOT = path.resolve(".");
const GOOGLEAPIS_ROOT = path.join(PROJECT_ROOT, "local", "googleapis");

/**
 * Strip the proto package prefix from a protobufjs fullName to get the short message path.
 * e.g. ".google.pubsub.v1.Topic" -> "Topic"
 *      ".google.storage.v2.Bucket.Lifecycle" -> "Bucket.Lifecycle"
 */
function stripPackagePrefix(fullName: string): string {
  // Strip leading dot, then all lowercase/digit package segments (google.pubsub.v1.)
  return fullName.replace(/^\.(?:[a-z][a-z0-9]*\.)+/, "");
}

/**
 * Parse field behaviors from raw proto source text using regex.
 * protobufjs doesn't reliably expose google.api.field_behavior parsed options,
 * so we fall back to regex parsing.
 *
 * Handles multi-line field definitions where annotations are on separate lines:
 *   string name = 1 [
 *     (google.api.field_behavior) = REQUIRED,
 *     (google.api.resource_reference) = { ... }
 *   ];
 *
 * Returns a map from "MessageName.fieldName" -> FieldBehavior[]
 */
function parseFieldBehaviorsFromSource(
  protoFiles: string[],
): Map<string, FieldBehavior[]> {
  const behaviors = new Map<string, FieldBehavior[]>();

  for (const filePath of protoFiles) {
    const absPath = path.resolve(PROJECT_ROOT, filePath);
    const content = fs.readFileSync(absPath, "utf8");

    // Track the current message context (handles nesting)
    const messageStack: string[] = [];
    let braceDepth = 0;
    const messageDepths: number[] = [];

    // Track multi-line field definitions
    let pendingFieldName: string | null = null;
    let pendingFieldBehaviors: FieldBehavior[] = [];
    let inFieldAnnotation = false;

    for (const line of content.split("\n")) {
      const trimmed = line.trim();

      // Track message/oneof/enum blocks by brace counting
      const openBraces = (trimmed.match(/{/g) || []).length;
      const closeBraces = (trimmed.match(/}/g) || []).length;

      // Detect message start
      const msgMatch = trimmed.match(/^message\s+(\w+)\s*\{/);
      if (msgMatch) {
        messageStack.push(msgMatch[1]);
        messageDepths.push(braceDepth);
      }

      braceDepth += openBraces - closeBraces;

      // Pop messages when their brace closes
      while (
        messageDepths.length > 0 &&
        braceDepth <= messageDepths[messageDepths.length - 1]
      ) {
        messageStack.pop();
        messageDepths.pop();
      }

      if (messageStack.length === 0) continue;

      // Check for field definition start (with or without annotations on same line)
      const fieldMatch = trimmed.match(
        /(?:repeated\s+)?(?:map<[^>]+>|[\w.]+)\s+(\w+)\s*=\s*\d+/,
      );

      if (fieldMatch) {
        // New field definition found - save any pending field first
        if (pendingFieldName) {
          saveBehaviors(behaviors, messageStack, pendingFieldName, pendingFieldBehaviors);
        }

        pendingFieldName = fieldMatch[1];
        pendingFieldBehaviors = [];
        // Check if the field definition opens a bracket (multi-line annotations)
        inFieldAnnotation = trimmed.includes("[") && !trimmed.includes("];");
      }

      // Look for field_behavior annotations on current line
      const behaviorMatches = [
        ...trimmed.matchAll(
          /\(google\.api\.field_behavior\)\s*=\s*(\w+)/g,
        ),
      ];
      for (const match of behaviorMatches) {
        const behavior = match[1] as string;
        if (behavior in FieldBehavior) {
          pendingFieldBehaviors.push(
            FieldBehavior[behavior as keyof typeof FieldBehavior],
          );
        }
      }

      // Check if multi-line annotation block ends
      if (inFieldAnnotation && trimmed.includes("];")) {
        inFieldAnnotation = false;
      }

      // If this line ends the field (semicolon and not in annotation block), flush
      if (pendingFieldName && !inFieldAnnotation && trimmed.includes(";")) {
        saveBehaviors(behaviors, messageStack, pendingFieldName, pendingFieldBehaviors);
        pendingFieldName = null;
        pendingFieldBehaviors = [];
      }
    }
  }

  return behaviors;
}

function saveBehaviors(
  behaviors: Map<string, FieldBehavior[]>,
  messageStack: string[],
  fieldName: string,
  fieldBehaviors: FieldBehavior[],
): void {
  if (fieldBehaviors.length > 0) {
    const msgName = messageStack.join(".");
    const key = `${msgName}.${fieldName}`;
    behaviors.set(key, fieldBehaviors);
  }
}

/**
 * Extract comments from proto source text.
 * Returns a map from "MessageName" or "MessageName.fieldName" -> comment string.
 */
function parseCommentsFromSource(
  protoFiles: string[],
): Map<string, string> {
  const comments = new Map<string, string>();

  for (const filePath of protoFiles) {
    const absPath = path.resolve(PROJECT_ROOT, filePath);
    const content = fs.readFileSync(absPath, "utf8");
    const lines = content.split("\n");

    const messageStack: string[] = [];
    let braceDepth = 0;
    const messageDepths: number[] = [];
    let pendingComment: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();

      // Collect comment lines
      if (trimmed.startsWith("//")) {
        pendingComment.push(trimmed.replace(/^\/\/\s?/, ""));
        continue;
      }

      // Track message blocks
      const msgMatch = trimmed.match(/^message\s+(\w+)\s*\{/);
      if (msgMatch) {
        messageStack.push(msgMatch[1]);
        messageDepths.push(braceDepth);

        if (pendingComment.length > 0) {
          const key = messageStack.join(".");
          comments.set(key, pendingComment.join(" ").trim());
        }
      }

      // Track service blocks
      const svcMatch = trimmed.match(/^service\s+(\w+)\s*\{/);
      if (svcMatch && pendingComment.length > 0) {
        comments.set(svcMatch[1], pendingComment.join(" ").trim());
      }

      // Track RPC declarations
      const rpcMatch = trimmed.match(/^\s*rpc\s+(\w+)\s*\(/);
      if (rpcMatch && pendingComment.length > 0) {
        // Store under ServiceName.RpcName - we'll need to resolve later
        comments.set(`rpc:${rpcMatch[1]}`, pendingComment.join(" ").trim());
      }

      // Track field declarations
      const fieldMatch = trimmed.match(
        /(?:repeated\s+)?(?:map<[^>]+>|[\w.]+)\s+(\w+)\s*=\s*\d+/,
      );
      if (fieldMatch && messageStack.length > 0 && !trimmed.startsWith("rpc")) {
        if (pendingComment.length > 0) {
          const key = `${messageStack.join(".")}.${fieldMatch[1]}`;
          comments.set(key, pendingComment.join(" ").trim());
        }
      }

      // Track enum blocks
      const enumMatch = trimmed.match(/^enum\s+(\w+)\s*\{/);
      if (enumMatch && pendingComment.length > 0) {
        const ctx =
          messageStack.length > 0 ? `${messageStack.join(".")}.` : "";
        comments.set(`${ctx}${enumMatch[1]}`, pendingComment.join(" ").trim());
      }

      // Track enum values
      const enumValMatch = trimmed.match(/^(\w+)\s*=\s*\d+/);
      if (
        enumValMatch &&
        !trimmed.startsWith("message") &&
        !trimmed.startsWith("enum") &&
        !trimmed.startsWith("rpc") &&
        !trimmed.startsWith("service") &&
        !trimmed.includes("(google.api")
      ) {
        if (pendingComment.length > 0) {
          const key = `enumval:${enumValMatch[1]}`;
          comments.set(key, pendingComment.join(" ").trim());
        }
      }

      // Count braces
      const openBraces = (trimmed.match(/{/g) || []).length;
      const closeBraces = (trimmed.match(/}/g) || []).length;
      braceDepth += openBraces - closeBraces;

      // Pop messages when their brace closes
      while (
        messageDepths.length > 0 &&
        braceDepth <= messageDepths[messageDepths.length - 1]
      ) {
        messageStack.pop();
        messageDepths.pop();
      }

      // Clear pending comment on non-comment, non-empty lines
      if (trimmed !== "" && !trimmed.startsWith("//")) {
        pendingComment = [];
      }
    }
  }

  return comments;
}

/**
 * Convert a protobufjs Type to a ParsedMessage.
 */
function convertType(
  type: protobuf.Type,
  fieldBehaviors: Map<string, FieldBehavior[]>,
  sourceComments: Map<string, string>,
  visited: Set<string> = new Set(),
): ParsedMessage {
  if (visited.has(type.fullName)) {
    return {
      name: type.name,
      fullName: type.fullName,
      fields: [],
      oneofs: [],
      nestedMessages: [],
      nestedEnums: [],
      comment: sourceComments.get(type.name),
    };
  }
  visited.add(type.fullName);

  const fields: ParsedField[] = [];

  for (const field of type.fieldsArray) {
    const parsed = convertField(
      field,
      type,
      fieldBehaviors,
      sourceComments,
      visited,
    );
    fields.push(parsed);
  }

  // Extract oneof groups
  const oneofs: ParsedOneofGroup[] = [];
  if (type.oneofArray) {
    for (const oneof of type.oneofArray) {
      // Skip synthetic oneofs (proto3 optional creates synthetic oneofs with a single field)
      if (oneof.fieldsArray.length <= 1) continue;

      oneofs.push({
        name: oneof.name,
        fields: oneof.fieldsArray.map((f) => f.name),
      });
    }
  }

  // Process nested types
  const nestedMessages: ParsedMessage[] = [];
  if (type.nestedArray) {
    for (const nested of type.nestedArray) {
      if (nested instanceof protobuf.Type) {
        // Skip map entry types (protobufjs creates synthetic types for maps)
        if (
          nested.options?.map_entry ||
          (nested as any).options?.["(map_entry)"]
        ) {
          continue;
        }
        nestedMessages.push(
          convertType(nested, fieldBehaviors, sourceComments, visited),
        );
      }
    }
  }

  const nestedEnums: ParsedEnum[] = [];
  if (type.nestedArray) {
    for (const nested of type.nestedArray) {
      if (nested instanceof protobuf.Enum) {
        nestedEnums.push(convertEnum(nested, sourceComments));
      }
    }
  }

  // Look up comment using short name path
  const shortName = stripPackagePrefix(type.fullName);
  const comment = sourceComments.get(shortName) || sourceComments.get(type.name);

  visited.delete(type.fullName);

  return {
    name: type.name,
    fullName: type.fullName,
    fields,
    oneofs,
    nestedMessages,
    nestedEnums,
    comment,
  };
}

function convertField(
  field: protobuf.Field,
  parentType: protobuf.Type,
  fieldBehaviors: Map<string, FieldBehavior[]>,
  sourceComments: Map<string, string>,
  visited: Set<string>,
): ParsedField {
  const isMap = field instanceof protobuf.MapField;

  // Resolve the field type
  let resolvedType: ParsedMessage | undefined;
  let resolvedEnum: ParsedEnum | undefined;
  let isMessage = false;
  let isEnum = false;

  if (field.resolvedType) {
    if (field.resolvedType instanceof protobuf.Type) {
      isMessage = true;
      // Only resolve if not a map entry (maps are handled separately)
      if (!isMap) {
        resolvedType = convertType(
          field.resolvedType,
          fieldBehaviors,
          sourceComments,
          new Set(visited),
        );
      }
    } else if (field.resolvedType instanceof protobuf.Enum) {
      isEnum = true;
      resolvedEnum = convertEnum(field.resolvedType, sourceComments);
    }
  }

  // Look up field behaviors using the short message.field path
  const shortParent = stripPackagePrefix(parentType.fullName);
  const behaviorKey = `${shortParent}.${field.name}`;
  const behaviors = fieldBehaviors.get(behaviorKey) || [];

  // Look up comment
  const commentKey = `${shortParent}.${field.name}`;
  const comment = sourceComments.get(commentKey);

  // Determine oneof group
  let oneofGroup: string | undefined;
  if (field.partOf) {
    // Skip synthetic oneofs (single-field oneofs from proto3 optional)
    if (field.partOf.fieldsArray.length > 1) {
      oneofGroup = field.partOf.name;
    }
  }

  const result: ParsedField = {
    name: field.name,
    jsonName: field.name.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
    protoType: field.type,
    isMessage,
    isEnum,
    isRepeated: field.repeated,
    isMap,
    behaviors,
    comment,
    oneofGroup,
    resolvedType,
    resolvedEnum,
  };

  if (isMap) {
    const mapField = field as protobuf.MapField;
    result.mapKeyType = mapField.keyType;
    result.mapValueType = mapField.type;
    result.mapValueIsMessage =
      field.resolvedType instanceof protobuf.Type;
  }

  return result;
}

function convertEnum(
  enumType: protobuf.Enum,
  sourceComments: Map<string, string>,
): ParsedEnum {
  const values: ParsedEnumValue[] = [];
  for (const [name, number] of Object.entries(enumType.values)) {
    values.push({
      name,
      number,
      comment: sourceComments.get(`enumval:${name}`),
    });
  }

  return {
    name: enumType.name,
    fullName: enumType.fullName,
    values,
    comment: sourceComments.get(enumType.name),
  };
}

/**
 * Load proto files and extract all services, RPCs, messages, and enums.
 */
export async function parseProtoFiles(
  protoFiles: string[],
): Promise<ParsedProtoResult> {
  // Parse field behaviors and comments from raw source
  const fieldBehaviors = parseFieldBehaviorsFromSource(protoFiles);
  const sourceComments = parseCommentsFromSource(protoFiles);

  // Load protos with protobufjs
  const root = new protobuf.Root();

  // Custom path resolver for imports
  root.resolvePath = (_origin: string, target: string): string => {
    // All google/* paths (including google/protobuf/*) resolve from googleapis
    if (target.startsWith("google/")) {
      const resolved = path.join(GOOGLEAPIS_ROOT, target);
      if (fs.existsSync(resolved)) {
        return resolved;
      }
    }

    // Relative import from the same directory
    if (_origin) {
      const originDir = path.dirname(_origin);
      const resolved = path.join(originDir, target);
      if (fs.existsSync(resolved)) {
        return resolved;
      }
    }

    // Fallback: check in protobufjs's bundled protos
    const protobufJsPath = path.join(
      PROJECT_ROOT,
      "node_modules",
      "protobufjs",
      target,
    );
    if (fs.existsSync(protobufJsPath)) {
      return protobufJsPath;
    }

    return target;
  };

  // Load all proto files
  const absPaths = protoFiles.map((f) => path.resolve(PROJECT_ROOT, f));
  await root.load(absPaths, { keepCase: true });

  // Resolve all types
  root.resolveAll();

  // Extract services
  const services: ParsedService[] = [];
  const allMessages = new Map<string, ParsedMessage>();
  const allEnums = new Map<string, ParsedEnum>();

  // Walk the namespace tree to find services
  function walkNamespace(ns: protobuf.NamespaceBase) {
    if (ns.nestedArray) {
      for (const nested of ns.nestedArray) {
        if (nested instanceof protobuf.Service) {
          services.push(
            convertService(nested, fieldBehaviors, sourceComments),
          );
        }
        if (nested instanceof protobuf.Type) {
          const msg = convertType(
            nested,
            fieldBehaviors,
            sourceComments,
          );
          allMessages.set(nested.fullName, msg);
        }
        if (nested instanceof protobuf.Enum) {
          allEnums.set(
            nested.fullName,
            convertEnum(nested, sourceComments),
          );
        }
        if (nested instanceof protobuf.Namespace) {
          walkNamespace(nested);
        }
      }
    }
  }

  walkNamespace(root);

  // Generate FileDescriptorSet JSON for runtime use
  const descriptorSetJson = root.toJSON();

  return {
    services,
    messages: allMessages,
    enums: allEnums,
    descriptorSetJson,
  };
}

function convertService(
  service: protobuf.Service,
  fieldBehaviors: Map<string, FieldBehavior[]>,
  sourceComments: Map<string, string>,
): ParsedService {
  // Extract host and scopes from service options
  let host: string | undefined;
  let scopes: string[] | undefined;

  if (service.parsedOptions) {
    for (const opt of service.parsedOptions) {
      if (opt["(google.api.default_host)"]) {
        host = opt["(google.api.default_host)"];
      }
      if (opt["(google.api.oauth_scopes)"]) {
        const scopeStr = opt["(google.api.oauth_scopes)"];
        scopes = scopeStr
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
  }

  // Convert RPCs
  const rpcs: ParsedRPC[] = [];
  for (const method of service.methodsArray) {
    const requestType = method.resolvedRequestType;
    const responseType = method.resolvedResponseType;

    if (!requestType || !responseType) {
      console.warn(`Skipping ${method.name}: unresolved types`);
      continue;
    }

    rpcs.push({
      name: method.name,
      fullName: `${service.fullName}.${method.name}`,
      serviceName: service.name,
      requestType: convertType(
        requestType as protobuf.Type,
        fieldBehaviors,
        sourceComments,
      ),
      responseType: convertType(
        responseType as protobuf.Type,
        fieldBehaviors,
        sourceComments,
      ),
      requestStream: method.requestStream || false,
      responseStream: method.responseStream || false,
      comment: sourceComments.get(`rpc:${method.name}`),
    });
  }

  return {
    name: service.name,
    fullName: service.fullName,
    host,
    scopes,
    rpcs,
    comment: sourceComments.get(service.name),
  };
}
