import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlConnectServiceClient } from "../../lib/grpcClient.ts";

const generateEphemeralCert: AppBlock = {
  name: "Generate Ephemeral Cert",
  description: `Generates a short-lived X509 certificate containing the provided public key and signed by a private key specific to the target instance. Users may use the certificate to authenticate as themselves when connecting to the database.`,
  category: "Connect",
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
        public_key: {
          name: "Public Key",
          description:
            "PEM encoded public key to include in the signed certificate.",
          type: {
            type: "string",
            description:
              "PEM encoded public key to include in the signed certificate.",
          },
          required: false,
        },
        access_token: {
          name: "Access Token",
          description:
            "Optional. Access token to include in the signed certificate.",
          type: {
            type: "string",
            description:
              "Optional. Access token to include in the signed certificate.",
          },
          required: false,
        },
        read_time: {
          name: "Read Time",
          description:
            "Optional. Optional snapshot read timestamp to trade freshness for performance.",
          type: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          required: false,
        },
        valid_duration: {
          name: "Valid Duration",
          description:
            "Optional. If set, it will contain the cert valid duration.",
          type: {
            type: "string",
            description: "Duration string (e.g., '1.5s', '300s')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlConnectServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;
        if (input.event.inputConfig.public_key !== undefined)
          request.public_key = input.event.inputConfig.public_key;
        if (input.event.inputConfig.access_token !== undefined)
          request.access_token = input.event.inputConfig.access_token;
        if (input.event.inputConfig.read_time !== undefined)
          request.read_time = input.event.inputConfig.read_time;
        if (input.event.inputConfig.valid_duration !== undefined)
          request.valid_duration = input.event.inputConfig.valid_duration;

        const result = await new Promise<any>((resolve, reject) => {
          client.generateEphemeralCert(request, (err: any, response: any) => {
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
          ephemeral_cert: {
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
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              common_name: {
                type: "string",
                description:
                  "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
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
        description: "Ephemeral certificate creation request.",
        additionalProperties: true,
      },
    },
  },
};

export default generateEphemeralCert;
