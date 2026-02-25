/**
 * Block code generation.
 *
 * Generates individual Flows block .ts files for each non-streaming RPC.
 */

import { GeneratedBlock, ParsedRPC } from "./types.ts";
import { messageToInputConfig, messageToOutputSchema } from "./schemaMapper.ts";
import { cleanComment } from "./naming.ts";

/**
 * Generate the TypeScript source code for a single block.
 */
export function generateBlockSource(block: GeneratedBlock): string {
  const { rpc } = block;

  // Generate input config from request message
  const inputConfig = messageToInputConfig(rpc.requestType);

  // Generate output schema from response message
  const outputSchema = messageToOutputSchema(rpc.responseType);

  // Build the request assembly code
  const inputFields = Object.keys(inputConfig);
  const requestAssembly = inputFields
    .map(
      (field) =>
        `      if (input.event.inputConfig.${field} !== undefined) request.${field} = input.event.inputConfig.${field};`,
    )
    .join("\n");

  // Get the client factory function name
  const clientFactory = `get${block.serviceName}Client`;

  // Clean description
  const description = cleanComment(rpc.comment) || `${block.humanName} operation.`;

  // Escape backticks in description for template literal
  const escapedDescription = description.replace(/`/g, "'");

  const source = `import { AppBlock, events } from "@slflows/sdk/v1";
import { ${clientFactory} } from "../../lib/grpcClient.ts";

const ${block.blockName}: AppBlock = {
  name: "${block.humanName}",
  description: \`${escapedDescription}\`,
  category: "${block.category}",
  inputs: {
    default: {
      config: ${formatInputConfig(inputConfig)},
      onEvent: async (input) => {
        const client = await ${clientFactory}(input.app.config);

        const request: Record<string, any> = {};
${requestAssembly}

        const result = await new Promise<any>((resolve, reject) => {
          client.${block.rpcMethodName}(request, (err: any, response: any) => {
            if (err) reject(new Error(\`gRPC error [\${err.code}]: \${err.details || err.message}\`));
            else resolve(response);
          });
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
