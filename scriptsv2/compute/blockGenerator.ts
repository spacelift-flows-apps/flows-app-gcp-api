/**
 * REST block code generation for Compute Engine.
 *
 * Generates individual Flows block .ts files for each REST RPC.
 */

import { messageToInputConfig, messageToOutputSchema, fieldToSchema, INPUT_SCHEMA_OPTIONS } from "../grpc/schemaMapper.ts";
import { cleanComment } from "../grpc/naming.ts";
import { ComputeGeneratedBlock } from "./types.ts";

/**
 * Generate the TypeScript source code for a single REST block.
 */
export function generateRestBlockSource(block: ComputeGeneratedBlock): string {
  const { rpc, httpAnnotation } = block;

  // Build input config: path params (except project) + query params + body sub-fields
  const inputConfig = buildInputConfig(block);

  // Generate output schema from response message
  const outputSchema = messageToOutputSchema(rpc.responseType);

  // Build path params assembly code
  const pathLines: string[] = [];
  pathLines.push("        const pathParams: Record<string, string> = {};");
  pathLines.push(
    '        pathParams.project = input.app.config.projectId as string;',
  );
  for (const p of block.pathParams) {
    if (p === "project") continue;
    const field = rpc.requestType.fields.find((f) => f.name === p);
    const configKey = field?.jsonName ?? p;
    pathLines.push(
      `        if (input.event.inputConfig.${configKey} !== undefined) pathParams["${p}"] = String(input.event.inputConfig.${configKey});`,
    );
  }

  // Build query params assembly code
  const queryLines: string[] = [];
  if (block.queryParams.length > 0) {
    queryLines.push("        const queryParams: Record<string, string> = {};");
    for (const q of block.queryParams) {
      const field = rpc.requestType.fields.find((f) => f.name === q);
      const configKey = field?.jsonName ?? q;
      const queryKey = field?.jsonName ?? q;
      queryLines.push(
        `        if (input.event.inputConfig.${configKey} !== undefined) queryParams["${queryKey}"] = String(input.event.inputConfig.${configKey});`,
      );
    }
  }

  // Build body assembly code
  const bodyLines: string[] = [];
  if (block.bodyFieldName) {
    const bodyField = rpc.requestType.fields.find(
      (f) => f.name === block.bodyFieldName,
    );
    if (bodyField?.resolvedType) {
      const bodyFields = bodyField.resolvedType.fields;
      bodyLines.push("        const body: Record<string, any> = {};");
      for (const bf of bodyFields) {
        bodyLines.push(
          `        if (input.event.inputConfig.${bf.jsonName} !== undefined) body.${bf.jsonName} = input.event.inputConfig.${bf.jsonName};`,
        );
      }
    }
  }

  // Clean description
  const description =
    cleanComment(rpc.comment) || `${block.humanName} operation.`;
  const escapedDescription = description.replace(/`/g, "'");

  // Build the fetch call arguments
  const fetchArgs: string[] = [
    "          config: input.app.config,",
    `          method: "${httpAnnotation.method.toUpperCase()}",`,
    `          pathTemplate: "${httpAnnotation.pathTemplate}",`,
    "          pathParams,",
  ];
  if (block.queryParams.length > 0) {
    fetchArgs.push("          queryParams,");
  }
  if (block.bodyFieldName) {
    fetchArgs.push(
      "          body: Object.keys(body).length > 0 ? body : undefined,",
    );
  }

  const source = `import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const ${block.blockName}: AppBlock = {
  name: "${block.humanName}",
  description: \`${escapedDescription}\`,
  category: "${block.category}",
  inputs: {
    default: {
      config: ${formatInputConfig(inputConfig)},
      onEvent: async (input) => {
${pathLines.join("\n")}

${queryLines.length > 0 ? queryLines.join("\n") + "\n" : ""}${bodyLines.length > 0 ? bodyLines.join("\n") + "\n" : ""}
        const result = await computeFetch({
${fetchArgs.join("\n")}
        });

        await events.emit(result || {});
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
 * Build the input config for a REST block.
 * Combines path params (excluding project), query params, and body sub-fields.
 */
function buildInputConfig(
  block: ComputeGeneratedBlock,
): Record<string, any> {
  const config: Record<string, any> = {};
  const { rpc } = block;

  // Path params (excluding project, which comes from app config)
  for (const paramName of block.pathParams) {
    if (paramName === "project") continue;
    const field = rpc.requestType.fields.find((f) => f.name === paramName);
    const configKey = field?.jsonName ?? paramName;
    // Humanize from snake_case name (explicit word boundaries)
    const humanName = paramName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const fieldSchema = field ? fieldToSchema(field, INPUT_SCHEMA_OPTIONS) : { type: "string" };
    config[configKey] = {
      name: humanName,
      description: field?.comment || `${humanName} for this request.`,
      type: fieldSchema,
      required: true,
    };
  }

  // Body sub-fields (flattened from the body resource message)
  if (block.bodyFieldName) {
    const bodyField = rpc.requestType.fields.find(
      (f) => f.name === block.bodyFieldName,
    );
    if (bodyField?.resolvedType) {
      const bodyInputConfig = messageToInputConfig(bodyField.resolvedType);
      Object.assign(config, bodyInputConfig);
    }
  }

  // Query params
  for (const qName of block.queryParams) {
    const field = rpc.requestType.fields.find((f) => f.name === qName);
    const configKey = field?.jsonName ?? qName;
    // Humanize from snake_case name (explicit word boundaries)
    const humanName = qName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const fieldSchema = field ? fieldToSchema(field, INPUT_SCHEMA_OPTIONS) : { type: "string" };
    config[configKey] = {
      name: humanName,
      description: field?.comment || `${humanName} parameter.`,
      type: fieldSchema,
      required: false,
    };
  }

  return config;
}

/**
 * Format the input config object as a string for code generation.
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
