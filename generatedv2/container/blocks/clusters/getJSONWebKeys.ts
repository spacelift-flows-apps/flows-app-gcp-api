import { AppBlock, events } from "@slflows/sdk/v1";
import { getClusterManagerClient } from "../../lib/grpcClient.ts";

const getJSONWebKeys: AppBlock = {
  name: "Get JSON Web Keys",
  description: `Gets the public component of the cluster signing keys in JSON Web Key format.`,
  category: "Clusters",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "The cluster (project, location, cluster name) to get keys for. Specified in the format `projects/*/locations/*/clusters/*`.",
          type: {
            type: "string",
            description:
              "The cluster (project, location, cluster name) to get keys for. Specified in the format `projects/*/locations/*/clusters/*`.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getClusterManagerClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getJSONWebKeys(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
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
      type: {
        type: "object",
        properties: {
          keys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kty: {
                  type: "string",
                  description: "Key Type.",
                },
                alg: {
                  type: "string",
                  description: "Algorithm.",
                },
                use: {
                  type: "string",
                  description: "Permitted uses for the public keys.",
                },
                kid: {
                  type: "string",
                  description: "Key ID.",
                },
                n: {
                  type: "string",
                  description: "Used for RSA keys.",
                },
                e: {
                  type: "string",
                  description: "Used for RSA keys.",
                },
                x: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
                y: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
                crv: {
                  type: "string",
                  description: "Used for ECDSA keys.",
                },
              },
              description: "Jwk is a JSON Web Key as specified in RFC 7517",
              additionalProperties: true,
            },
            description:
              "The public component of the keys used by the cluster to sign token requests.",
          },
        },
        description:
          "GetJSONWebKeysResponse is a valid JSON Web Key Set as specified in rfc 7517",
        additionalProperties: true,
      },
    },
  },
};

export default getJSONWebKeys;
