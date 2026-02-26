import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getSqlSslCertsServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  sha1Fingerprint: "sha1_fingerprint",
};

const outputMapping = {
  cert_serial_number: "certSerialNumber",
  create_time: "createTime",
  common_name: "commonName",
  expiration_time: "expirationTime",
  sha1_fingerprint: "sha1Fingerprint",
  self_link: "selfLink",
};

const get: AppBlock = {
  name: "Get",
  description: `Retrieves a resource containing information about a user.`,
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
        sha1Fingerprint: {
          name: "Sha1 Fingerprint",
          description: "Sha1 FingerPrint.",
          type: {
            type: "string",
            description: "Sha1 FingerPrint.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlSslCertsServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.get(request, (err: any, response: any) => {
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
            description: "This is always `sql#sslCert`.",
          },
          certSerialNumber: {
            type: "string",
            description: "Serial number, as extracted from the certificate.",
          },
          cert: {
            type: "string",
            description: "PEM representation.",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          commonName: {
            type: "string",
            description: "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
          },
          expirationTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
    },
  },
};

export default get;
