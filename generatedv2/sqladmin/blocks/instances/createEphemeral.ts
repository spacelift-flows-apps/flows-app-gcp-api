import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlInstancesServiceClient } from "../../lib/grpcClient.ts";

const createEphemeral: AppBlock = {
  name: "Create Ephemeral",
  description: `Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.`,
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
          description: "Project ID of the Cloud SQL project.",
          type: {
            type: "string",
            description: "Project ID of the Cloud SQL project.",
          },
          required: false,
        },
        body: {
          name: "Body",
          description: "Body field",
          type: {
            type: "object",
            properties: {
              public_key: {
                type: "string",
                description:
                  "PEM encoded public key to include in the signed certificate.",
              },
              access_token: {
                type: "string",
                description:
                  "Access token to include in the signed certificate.",
              },
            },
            description: "SslCerts create ephemeral certificate request.",
            additionalProperties: true,
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
        if (input.event.inputConfig.body !== undefined)
          request.body = input.event.inputConfig.body;

        const result = await new Promise<any>((resolve, reject) => {
          client.createEphemeral(request, (err: any, response: any) => {
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
          kind: {
            type: "string",
            description: "This is always `sql#sslCert`.",
          },
          cert_serial_number: {
            type: "string",
            description: "Serial number, as extracted from the certificate.",
          },
          cert: {
            type: "string",
            description: "PEM representation.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          common_name: {
            type: "string",
            description: "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
          },
          expiration_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default createEphemeral;
