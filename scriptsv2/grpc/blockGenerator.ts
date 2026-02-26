/**
 * Block code generation.
 *
 * Generates individual Flows block .ts files for each non-streaming RPC.
 */

import { GeneratedBlock, RoutingParameter } from "./types.ts";
import {
  messageToInputConfig,
  messageToOutputSchema,
  generateFieldMapping,
  INPUT_SCHEMA_OPTIONS,
  OUTPUT_SCHEMA_OPTIONS,
  FieldNameMapping,
} from "./schemaMapper.ts";
import { cleanComment } from "./naming.ts";

/** Convert a proto field path (e.g. "bucket.project") to a JS accessor (e.g. "request.bucket?.project") */
function fieldPathToAccessor(fieldPath: string): string {
  const parts = fieldPath.split(".");
  return "request." + parts[0] + parts.slice(1).map((p) => `?.${p}`).join("");
}

// Convert a routing extraction pattern (e.g. "projects/star/buckets/star") to a RegExp string
function patternToRegex(pattern: string): string {
  return pattern.replace(/\//g, "\\/").replace(/\*/g, "[^/]+");
}

/**
 * Generate routing metadata code for an RPC's routing parameters.
 * Returns the code lines to insert before the gRPC call, or empty string if no routing.
 */
function generateRoutingCode(routingParams: RoutingParameter[]): string {
  if (routingParams.length === 0) return "";

  const lines: string[] = [];
  lines.push("        const routingParams: Record<string, string> = {};");

  for (const param of routingParams) {
    const accessor = fieldPathToAccessor(param.fieldPath);
    if (param.extractPattern) {
      const regex = patternToRegex(param.extractPattern);
      lines.push(
        `        if (${accessor} !== undefined) {`,
        `          const m = String(${accessor}).match(/^(${regex})/);`,
        `          if (m) routingParams["${param.key}"] = m[1];`,
        `        }`,
      );
    } else {
      lines.push(
        `        if (${accessor} !== undefined) routingParams["${param.key}"] = String(${accessor});`,
      );
    }
  }

  lines.push(
    "        const metadata = createRoutingMetadata(routingParams);",
  );
  return lines.join("\n");
}

/** Format a FieldNameMapping as a TypeScript object literal string. */
function formatMapping(mapping: FieldNameMapping, indent: number): string {
  const json = JSON.stringify(mapping, null, 2);
  const pad = " ".repeat(indent);
  return json
    .split("\n")
    .map((line, i) => (i === 0 ? line : pad + line))
    .join("\n");
}

/**
 * Generate the TypeScript source code for a single block.
 */
export function generateBlockSource(block: GeneratedBlock): string {
  const { rpc } = block;
  const hasRouting = rpc.routingParameters.length > 0;

  // Generate input config from request message (camelCase keys)
  const inputConfig = messageToInputConfig(rpc.requestType);

  // Generate output schema from response message (camelCase keys)
  const outputSchema = messageToOutputSchema(rpc.responseType);

  // Generate field name mappings
  const inputMapping = generateFieldMapping(
    rpc.requestType,
    "toProto",
    INPUT_SCHEMA_OPTIONS,
  );
  const outputMapping = generateFieldMapping(
    rpc.responseType,
    "fromProto",
    OUTPUT_SCHEMA_OPTIONS,
  );

  const hasInputMapping = Object.keys(inputMapping).length > 0;
  const hasOutputMapping = Object.keys(outputMapping).length > 0;

  // Get the client factory function name
  const clientFactory = `get${block.serviceName}Client`;

  // Build import list
  const grpcImports = [clientFactory];
  if (hasRouting) grpcImports.push("createRoutingMetadata");
  if (hasInputMapping || hasOutputMapping) grpcImports.push("convertKeys");

  // Clean description
  const description = cleanComment(rpc.comment) || `${block.humanName} operation.`;

  // Escape backticks in description for template literal
  const escapedDescription = description.replace(/`/g, "'");

  // Build routing metadata code
  const routingCode = generateRoutingCode(rpc.routingParameters);

  // gRPC call args: with or without metadata
  const callArgs = hasRouting
    ? `request, metadata, (err: any, response: any)`
    : `request, (err: any, response: any)`;

  // Build mapping constants (placed before the block definition)
  const mappingConsts: string[] = [];
  if (hasInputMapping) {
    mappingConsts.push(
      `const inputMapping = ${formatMapping(inputMapping, 0)};`,
    );
  }
  if (hasOutputMapping) {
    mappingConsts.push(
      `const outputMapping = ${formatMapping(outputMapping, 0)};`,
    );
  }
  const mappingSection =
    mappingConsts.length > 0 ? "\n" + mappingConsts.join("\n\n") + "\n" : "";

  // Request conversion: use convertKeys if mapping exists, otherwise spread input directly
  const requestLine = hasInputMapping
    ? "        const request = convertKeys(input.event.inputConfig, inputMapping);"
    : "        const request = { ...input.event.inputConfig };";

  // Output conversion
  const emitLine = hasOutputMapping
    ? `        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);`
    : "        await events.emit(result || {});";

  const source = `import { AppBlock, events } from "@slflows/sdk/v1";
import { ${grpcImports.join(", ")} } from "../../lib/grpcClient.ts";
${mappingSection}
const ${block.blockName}: AppBlock = {
  name: "${block.humanName}",
  description: \`${escapedDescription}\`,
  category: "${block.category}",
  inputs: {
    default: {
      config: ${formatInputConfig(inputConfig)},
      onEvent: async (input) => {
        const client = await ${clientFactory}(input.app.config);

${requestLine}

${routingCode}
        const result = await new Promise<any>((resolve, reject) => {
          client.${block.rpcMethodName}(${callArgs} => {
            if (err) reject(new Error(\`gRPC error [\${err.code}]: \${err.details || err.message}\`));
            else resolve(response);
          });
        });

${emitLine}
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: ${JSON.stringify(outputSchema, null, 6).split("\n").map((line, i) => (i === 0 ? line : "      " + line)).join("\n")},
    },
  },
};

export default ${block.blockName};
`;

  return source;
}

/**
 * Format the input config object as a string for code generation.
 * This produces valid TypeScript/JavaScript object literal syntax.
 */
function formatInputConfig(config: Record<string, any>): string {
  if (Object.keys(config).length === 0) {
    return "{}";
  }

  const entries: string[] = [];

  for (const [key, value] of Object.entries(config)) {
    const name = JSON.stringify(value.name);
    const desc = JSON.stringify(value.description);
    const type = JSON.stringify(value.type, null, 10);
    const required = value.required ? "true" : "false";

    // Indent the type object nicely
    const indentedType = type
      .split("\n")
      .map((line: string, i: number) => (i === 0 ? line : "          " + line))
      .join("\n");

    entries.push(
      `        ${key}: {
          name: ${name},
          description: ${desc},
          type: ${indentedType},
          required: ${required},
        }`,
    );
  }

  return `{\n${entries.join(",\n")},\n      }`;
}
