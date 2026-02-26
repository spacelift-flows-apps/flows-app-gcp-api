import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

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

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;

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
          certs: {
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
          active_version: {
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
