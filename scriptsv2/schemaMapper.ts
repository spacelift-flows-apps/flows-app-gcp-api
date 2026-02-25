/**
 * Proto type -> JSON Schema conversion.
 *
 * Converts parsed proto messages/fields to JSON Schema objects suitable
 * for Flows block input configs and output types.
 */

import {
  FieldBehavior,
  ParsedEnum,
  ParsedField,
  ParsedMessage,
} from "./types.ts";

export interface SchemaMapperOptions {
  /** Exclude OUTPUT_ONLY fields (for input schemas) */
  excludeOutputOnly: boolean;
  /** Exclude INPUT_ONLY fields (for output schemas) */
  excludeInputOnly: boolean;
  /** Maximum recursion depth */
  maxDepth: number;
}

const INPUT_SCHEMA_OPTIONS: SchemaMapperOptions = {
  excludeOutputOnly: true,
  excludeInputOnly: false,
  maxDepth: 8,
};

const OUTPUT_SCHEMA_OPTIONS: SchemaMapperOptions = {
  excludeOutputOnly: false,
  excludeInputOnly: true,
  maxDepth: 8,
};

/** Well-known proto types that get special JSON Schema treatment */
const WELL_KNOWN_TYPES: Record<string, any> = {
  "google.protobuf.Timestamp": {
    type: "string",
    description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
  },
  "google.protobuf.Duration": {
    type: "string",
    description: "Duration string (e.g., '1.5s', '300s')",
  },
  "google.protobuf.FieldMask": {
    type: "string",
    description: "Comma-separated field paths (e.g., 'field1,field2.subfield')",
  },
  "google.protobuf.Struct": {
    type: "object",
    additionalProperties: true,
  },
  "google.protobuf.Value": {
    description: "Any JSON value",
  },
  "google.protobuf.ListValue": {
    type: "array",
    items: { description: "Any JSON value" },
  },
  "google.protobuf.Empty": null, // Signals "no output"
  "google.protobuf.BoolValue": { type: "boolean" },
  "google.protobuf.StringValue": { type: "string" },
  "google.protobuf.Int32Value": { type: "integer" },
  "google.protobuf.Int64Value": {
    type: "string",
    description: "64-bit integer as string",
  },
  "google.protobuf.UInt32Value": { type: "integer" },
  "google.protobuf.UInt64Value": {
    type: "string",
    description: "64-bit integer as string",
  },
  "google.protobuf.FloatValue": { type: "number" },
  "google.protobuf.DoubleValue": { type: "number" },
  "google.protobuf.BytesValue": {
    type: "string",
    description: "Base64-encoded bytes",
  },
};

/** Map proto scalar types to JSON Schema types */
function scalarTypeToSchema(protoType: string): any {
  switch (protoType) {
    case "string":
      return { type: "string" };
    case "bool":
      return { type: "boolean" };
    case "int32":
    case "uint32":
    case "sint32":
    case "fixed32":
    case "sfixed32":
      return { type: "integer" };
    case "int64":
    case "uint64":
    case "sint64":
    case "fixed64":
    case "sfixed64":
      return { type: "string", description: "64-bit integer as string" };
    case "float":
    case "double":
      return { type: "number" };
    case "bytes":
      return { type: "string", description: "Base64-encoded bytes" };
    default:
      return { type: "string" };
  }
}

/** Convert an enum to JSON Schema */
function enumToSchema(parsedEnum: ParsedEnum): any {
  const values = parsedEnum.values.map((v) => v.name);
  const result: any = { type: "string", enum: values };
  if (parsedEnum.comment) {
    result.description = parsedEnum.comment;
  }
  return result;
}

/** Check if a field should be excluded based on options and field behaviors */
function shouldExcludeField(
  field: ParsedField,
  options: SchemaMapperOptions,
): boolean {
  if (options.excludeOutputOnly && field.behaviors.includes(FieldBehavior.OUTPUT_ONLY)) {
    return true;
  }
  if (options.excludeInputOnly && field.behaviors.includes(FieldBehavior.INPUT_ONLY)) {
    return true;
  }
  return false;
}

/**
 * Convert a parsed message to a JSON Schema object.
 */
export function messageToSchema(
  message: ParsedMessage,
  options: SchemaMapperOptions,
  visited: Set<string> = new Set(),
): any {
  if (visited.has(message.fullName)) {
    return { type: "object", additionalProperties: true };
  }

  if (visited.size >= options.maxDepth) {
    return { type: "object", additionalProperties: true };
  }

  visited.add(message.fullName);

  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const field of message.fields) {
    if (shouldExcludeField(field, options)) continue;

    const fieldSchema = fieldToSchema(field, options, new Set(visited));
    if (fieldSchema) {
      properties[field.jsonName] = fieldSchema;

      if (field.behaviors.includes(FieldBehavior.REQUIRED)) {
        required.push(field.jsonName);
      }
    }
  }

  const result: any = {
    type: "object",
    properties,
  };

  if (required.length > 0) {
    result.required = required;
  }

  if (message.comment) {
    result.description = message.comment;
  }

  result.additionalProperties = true;

  visited.delete(message.fullName);
  return result;
}

/**
 * Convert a single field to a JSON Schema object.
 */
export function fieldToSchema(
  field: ParsedField,
  options: SchemaMapperOptions,
  visited: Set<string> = new Set(),
): any {
  let schema: any;

  if (field.isMap) {
    // Map field -> object with additionalProperties
    let valueSchema: any;
    if (field.mapValueIsMessage && field.resolvedType) {
      // Check well-known types first
      const wellKnown = WELL_KNOWN_TYPES[field.resolvedType.fullName.replace(/^\./, "")];
      if (wellKnown !== undefined) {
        valueSchema = wellKnown ?? { type: "string" };
      } else {
        valueSchema = messageToSchema(field.resolvedType, options, new Set(visited));
      }
    } else {
      valueSchema = scalarTypeToSchema(field.mapValueType || "string");
    }
    schema = { type: "object", additionalProperties: valueSchema };
  } else if (field.isEnum && field.resolvedEnum) {
    schema = enumToSchema(field.resolvedEnum);
  } else if (field.isMessage && field.resolvedType) {
    // Check well-known types
    const fullName = field.resolvedType.fullName.replace(/^\./, "");
    const wellKnown = WELL_KNOWN_TYPES[fullName];
    if (wellKnown !== undefined) {
      schema = wellKnown ? { ...wellKnown } : { type: "object" };
    } else {
      schema = messageToSchema(field.resolvedType, options, new Set(visited));
    }
  } else {
    // Scalar type
    schema = scalarTypeToSchema(field.protoType);
  }

  // Wrap in array if repeated (and not a map)
  if (field.isRepeated && !field.isMap) {
    schema = { type: "array", items: schema };
  }

  // Add description from comment
  if (field.comment && !schema.description) {
    schema.description = field.comment;
  }

  // Add oneof note
  if (field.oneofGroup) {
    const note = `(Part of '${field.oneofGroup}' - only one field in this group can be set)`;
    schema.description = schema.description
      ? `${schema.description} ${note}`
      : note;
  }

  return schema;
}

/**
 * Generate a JSON Schema for a message's fields suitable for Flows block input config.
 * Excludes OUTPUT_ONLY fields, marks REQUIRED fields.
 *
 * Returns an object where keys are field jsonNames and values are Flows config field definitions.
 */
export function messageToInputConfig(
  message: ParsedMessage,
): Record<string, any> {
  const config: Record<string, any> = {};
  const options = INPUT_SCHEMA_OPTIONS;

  for (const field of message.fields) {
    if (shouldExcludeField(field, options)) continue;

    const fieldSchema = fieldToSchema(field, options);
    if (!fieldSchema) continue;

    // Humanize field name: "messageRetentionDuration" -> "Message Retention Duration"
    const humanName = field.jsonName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

    config[field.jsonName] = {
      name: humanName,
      description: field.comment || `${humanName} field`,
      type: fieldSchema,
      required: field.behaviors.includes(FieldBehavior.REQUIRED),
    };
  }

  return config;
}

/**
 * Generate a JSON Schema for a message suitable for Flows block output type.
 * Excludes INPUT_ONLY fields, includes OUTPUT_ONLY fields.
 */
export function messageToOutputSchema(message: ParsedMessage): any {
  // Check if this is google.protobuf.Empty
  const fullName = message.fullName.replace(/^\./, "");
  if (fullName === "google.protobuf.Empty" || WELL_KNOWN_TYPES[fullName] === null) {
    return { type: "object", properties: {}, additionalProperties: true };
  }

  return messageToSchema(message, OUTPUT_SCHEMA_OPTIONS);
}
