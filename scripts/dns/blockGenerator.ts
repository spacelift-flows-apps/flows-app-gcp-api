/**
 * REST block code generation for DNS.
 *
 * Generates individual Flows block .ts files for each discovery method.
 */

import { DiscoverySchema, DnsGeneratedBlock } from "./types.ts";
import {
  parameterToInputConfig,
  schemaToInputConfig,
  schemaToOutputSchema,
} from "./schemaMapper.ts";

/**
 * Generate the TypeScript source code for a single REST block.
 */
export function generateDnsBlockSource(
  block: DnsGeneratedBlock,
  allSchemas: Record<string, DiscoverySchema>,
): string {
  const { method } = block;

  // Build input config: path params + request body fields + query params
  const inputConfig = buildInputConfig(block, allSchemas);

  // Build output schema from response type
  const outputSchema = method.responseSchemaRef
    ? schemaToOutputSchema(method.responseSchemaRef, allSchemas)
    : { type: "object", properties: {}, additionalProperties: true };

  // Build path params assembly code
  const pathLines: string[] = [];
  pathLines.push("        const pathParams: Record<string, string> = {};");
  pathLines.push(
    '        pathParams.project = input.app.config.projectId as string;',
  );
  for (const param of method.pathParams) {
    const paramName = (param as any).name as string;
    pathLines.push(
      `        if (input.event.inputConfig.${paramName} !== undefined) pathParams["${paramName}"] = String(input.event.inputConfig.${paramName});`,
    );
  }

  // Build query params assembly code
  const queryLines: string[] = [];
  if (method.queryParams.length > 0) {
    queryLines.push(
      "        const queryParams: Record<string, string> = {};",
    );
    for (const param of method.queryParams) {
      const paramName = (param as any).name as string;
      queryLines.push(
        `        if (input.event.inputConfig.${paramName} !== undefined) queryParams["${paramName}"] = String(input.event.inputConfig.${paramName});`,
      );
    }
  }

  // Build body assembly code (from request schema fields)
  const bodyLines: string[] = [];
  if (method.requestSchemaRef) {
    const schema = allSchemas[method.requestSchemaRef];
    if (schema?.properties) {
      bodyLines.push("        const body: Record<string, any> = {};");
      for (const fieldName of Object.keys(schema.properties)) {
        const fieldSchema = schema.properties[fieldName];
        if (fieldSchema.readOnly) continue;
        if (fieldName === "kind") continue;
        bodyLines.push(
          `        if (input.event.inputConfig.${fieldName} !== undefined) body.${fieldName} = input.event.inputConfig.${fieldName};`,
        );
      }
    }
  }

  // Build the fetch call arguments
  const escapedDescription = (method.description || `${block.humanName} operation.`).replace(
    /`/g,
    "'",
  );

  const fetchArgs: string[] = [
    "          config: input.app.config,",
    `          method: "${method.httpMethod}",`,
    `          pathTemplate: "${method.path}",`,
    "          pathParams,",
  ];
  if (method.queryParams.length > 0) {
    fetchArgs.push("          queryParams,");
  }
  if (method.requestSchemaRef) {
    fetchArgs.push(
      "          body: Object.keys(body).length > 0 ? body : undefined,",
    );
  }

  const source = `import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

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
        const result = await dnsFetch({
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
 * Combines path params (excluding project), request body fields, and query params.
 */
function buildInputConfig(
  block: DnsGeneratedBlock,
  allSchemas: Record<string, DiscoverySchema>,
): Record<string, any> {
  const config: Record<string, any> = {};
  const { method } = block;

  // Path params (excluding project, which comes from app config)
  for (const param of method.pathParams) {
    const paramName = (param as any).name as string;
    config[paramName] = parameterToInputConfig(paramName, param);
  }

  // Request body fields (flattened from schema)
  if (method.requestSchemaRef) {
    const bodyConfig = schemaToInputConfig(method.requestSchemaRef, allSchemas);
    Object.assign(config, bodyConfig);
  }

  // Query params
  for (const param of method.queryParams) {
    const paramName = (param as any).name as string;
    config[paramName] = parameterToInputConfig(paramName, param);
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
