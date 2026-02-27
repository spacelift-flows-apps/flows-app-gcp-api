import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlInstancesServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  certs: {
    name: "certs",
    fields: {
      cert_serial_number: "certSerialNumber",
      create_time: "createTime",
      common_name: "commonName",
      expiration_time: "expirationTime",
      sha1_fingerprint: "sha1Fingerprint",
      self_link: "selfLink",
    },
  },
  active_version: "activeVersion",
};

const listServerCas: AppBlock = {
  name: "List Server Cas",
  description: `Lists all of the trusted Certificate Authorities (CAs) for the specified instance. There can be up to three CAs listed: the CA that was used to sign the certificate that is currently in use, a CA that has been added but not yet used to sign a certificate, and a CA used to sign a certificate that has previously rotated out.`,
  category: "Instances",
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
        const client = await getSqlInstancesServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.listServerCas(request, (err: any, response: any) => {
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
          certs: {
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
            description: "List of server CA certificates for the instance.",
          },
          activeVersion: {
            type: "string",
          },
          kind: {
            type: "string",
            description: "This is always `sql#instancesListServerCas`.",
          },
        },
        description: "Instances ListServerCas response.",
        additionalProperties: true,
      },
    },
  },
};

export default listServerCas;
