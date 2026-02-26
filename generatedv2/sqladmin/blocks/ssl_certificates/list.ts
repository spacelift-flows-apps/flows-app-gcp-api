import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlSslCertsServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  items: {
    name: "items",
    fields: {
      cert_serial_number: "certSerialNumber",
      create_time: "createTime",
      common_name: "commonName",
      expiration_time: "expirationTime",
      sha1_fingerprint: "sha1Fingerprint",
      self_link: "selfLink",
    },
  },
};

const list: AppBlock = {
  name: "List",
  description: `Lists users in the specified Cloud SQL instance.`,
  category: "SSL Certificates",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Cloud SQL instance ID. This does not include the project ID.",
          },
          required: false,
        },
        project: {
          name: "Project",
          description: "Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Project ID of the project that contains the instance.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlSslCertsServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.list(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          kind: {
            type: "string",
            description: "This is always `sql#sslCertsList`.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#sslCert`.",
                },
                certSerialNumber: {
                  type: "string",
                  description:
                    "Serial number, as extracted from the certificate.",
                },
                cert: {
                  type: "string",
                  description: "PEM representation.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                commonName: {
                  type: "string",
                  description:
                    "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
                },
                expirationTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                sha1Fingerprint: {
                  type: "string",
                  description: "Sha1 Fingerprint.",
                },
                instance: {
                  type: "string",
                  description: "Name of the database instance.",
                },
                selfLink: {
                  type: "string",
                  description: "The URI of this resource.",
                },
              },
              description: "SslCerts Resource",
              additionalProperties: true,
            },
            description: "List of client certificates for the instance.",
          },
        },
        description: "SslCerts list response.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
