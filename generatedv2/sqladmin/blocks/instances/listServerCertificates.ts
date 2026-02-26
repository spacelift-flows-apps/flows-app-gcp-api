import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const listServerCertificates: AppBlock = {
  name: "List Server Certificates",
  description: `Lists all versions of server certificates and certificate authorities (CAs) for the specified instance. There can be up to three sets of certs listed: the certificate that is currently in use, a future that has been added but not yet used to sign a certificate, and a certificate that has been rotated out. For instances not using Certificate Authority Service (CAS) server CA, use ListServerCas instead.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Required. Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Required. Cloud SQL instance ID. This does not include the project ID.",
          },
          required: true,
        },
        project: {
          name: "Project",
          description:
            "Required. Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Required. Project ID of the project that contains the instance.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlInstancesServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

        const result = await new Promise<any>((resolve, reject) => {
          client.listServerCertificates(request, (err: any, response: any) => {
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
          ca_certs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#sslCert`.",
                },
                cert_serial_number: {
                  type: "string",
                  description:
                    "Serial number, as extracted from the certificate.",
                },
                cert: {
                  type: "string",
                  description: "PEM representation.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                common_name: {
                  type: "string",
                  description:
                    "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
                },
                expiration_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                sha1_fingerprint: {
                  type: "string",
                  description: "Sha1 Fingerprint.",
                },
                instance: {
                  type: "string",
                  description: "Name of the database instance.",
                },
                self_link: {
                  type: "string",
                  description: "The URI of this resource.",
                },
              },
              description: "SslCerts Resource",
              additionalProperties: true,
            },
            description: "List of server CA certificates for the instance.",
          },
          server_certs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description: "This is always `sql#sslCert`.",
                },
                cert_serial_number: {
                  type: "string",
                  description:
                    "Serial number, as extracted from the certificate.",
                },
                cert: {
                  type: "string",
                  description: "PEM representation.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                common_name: {
                  type: "string",
                  description:
                    "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
                },
                expiration_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                sha1_fingerprint: {
                  type: "string",
                  description: "Sha1 Fingerprint.",
                },
                instance: {
                  type: "string",
                  description: "Name of the database instance.",
                },
                self_link: {
                  type: "string",
                  description: "The URI of this resource.",
                },
              },
              description: "SslCerts Resource",
              additionalProperties: true,
            },
            description:
              "List of server certificates for the instance, signed by the corresponding CA from the `ca_certs` list.",
          },
          active_version: {
            type: "string",
            description:
              "The `sha1_fingerprint` of the active certificate from `server_certs`.",
          },
          kind: {
            type: "string",
            description:
              "This is always `sql#instancesListServerCertificates`.",
          },
        },
        description: "Instances ListServerCertificates response.",
        additionalProperties: true,
      },
    },
  },
};

export default listServerCertificates;
