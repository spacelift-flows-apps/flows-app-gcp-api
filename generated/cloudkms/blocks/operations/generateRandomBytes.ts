import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const generateRandomBytes: AppBlock = {
  name: "Operations - Generate Random Bytes",
  description: `Generate random bytes using the Cloud KMS randomness source in the provided location.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        location: {
          name: "Location",
          description:
            'The project-specific location in which to generate random bytes. For example, "projects/my-project/locations/us-central1".',
          type: {
            type: "string",
          },
          required: true,
        },
        lengthBytes: {
          name: "Length Bytes",
          description:
            "The length in bytes of the amount of randomness to retrieve.",
          type: {
            type: "integer",
            description:
              "The length in bytes of the amount of randomness to retrieve. Minimum 8 bytes, maximum 1024 bytes. (Format: int32)",
          },
          required: false,
        },
        protectionLevel: {
          name: "Protection Level",
          description:
            "The ProtectionLevel to use when generating the random data.",
          type: {
            type: "string",
            enum: [
              "PROTECTION_LEVEL_UNSPECIFIED",
              "SOFTWARE",
              "HSM",
              "EXTERNAL",
              "EXTERNAL_VPC",
            ],
            description:
              "The ProtectionLevel to use when generating the random data. Currently, only HSM protection level is supported.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/cloudkms",
            ],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://cloudkms.googleapis.com/";
        let path = `v1/{+location}:generateRandomBytes`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.lengthBytes !== undefined)
          requestBody.lengthBytes = input.event.inputConfig.lengthBytes;
        if (input.event.inputConfig.protectionLevel !== undefined)
          requestBody.protectionLevel = input.event.inputConfig.protectionLevel;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
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
          data: {
            type: "string",
            description: "The generated data. (Format: byte)",
          },
          dataCrc32c: {
            type: "string",
            description:
              "Integrity verification field. A CRC32C checksum of the returned GenerateRandomBytesResponse.data. An integrity check of GenerateRandomBytesResponse.data can be performed by computing the CRC32C checksum of GenerateRandomBytesResponse.data and comparing your results to this field. Discard the response in case of non-matching checksum values, and perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
        },
        description:
          "Response message for KeyManagementService.GenerateRandomBytes.",
        additionalProperties: true,
      },
    },
  },
};

export default generateRandomBytes;
