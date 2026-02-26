import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlInstancesServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  ca_certs: {
    name: "caCerts",
    fields: {
      cert_serial_number: "certSerialNumber",
      create_time: "createTime",
      common_name: "commonName",
      expiration_time: "expirationTime",
      sha1_fingerprint: "sha1Fingerprint",
      self_link: "selfLink",
    },
  },
  server_certs: {
    name: "serverCerts",
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

        const request = { ...input.event.inputConfig };

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
          caCerts: {
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
          serverCerts: {
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
            description:
              "List of server certificates for the instance, signed by the corresponding CA from the `ca_certs` list.",
          },
          activeVersion: {
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
