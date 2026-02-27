import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const cryptoKeysDecrypt: AppBlock = {
  name: "Crypto Keys - Decrypt",
  description: `Decrypts data that was protected by Encrypt.`,
  category: "Crypto Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the CryptoKey to use for decryption. The server will choose the appropriate version.",
          type: {
            type: "string",
          },
          required: true,
        },
        ciphertext: {
          name: "Ciphertext",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The encrypted data originally returned in EncryptResponse.ciphertext. (Format: byte)",
          },
          required: false,
        },
        additionalAuthenticatedData: {
          name: "Additional Authenticated Data",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Optional data that must match the data originally supplied in EncryptRequest.additional_authenticated_data. (Format: byte)",
          },
          required: false,
        },
        additionalAuthenticatedDataCrc32c: {
          name: "Additional Authenticated Data Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the DecryptRequest.additional_authenticated_data. If specified, KeyManagementService will verify the integrity of the received DecryptRequest.additional_authenticated_data using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(DecryptRequest.additional_authenticated_data) is equal to DecryptRequest.additional_authenticated_data_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
          required: false,
        },
        ciphertextCrc32c: {
          name: "Ciphertext Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the DecryptRequest.ciphertext. If specified, KeyManagementService will verify the integrity of the received DecryptRequest.ciphertext using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(DecryptRequest.ciphertext) is equal to DecryptRequest.ciphertext_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
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
        let path = `v1/{+name}:decrypt`;

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

        if (input.event.inputConfig.ciphertext !== undefined)
          requestBody.ciphertext = input.event.inputConfig.ciphertext;
        if (input.event.inputConfig.additionalAuthenticatedData !== undefined)
          requestBody.additionalAuthenticatedData =
            input.event.inputConfig.additionalAuthenticatedData;
        if (
          input.event.inputConfig.additionalAuthenticatedDataCrc32c !==
          undefined
        )
          requestBody.additionalAuthenticatedDataCrc32c =
            input.event.inputConfig.additionalAuthenticatedDataCrc32c;
        if (input.event.inputConfig.ciphertextCrc32c !== undefined)
          requestBody.ciphertextCrc32c =
            input.event.inputConfig.ciphertextCrc32c;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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
          plaintext: {
            type: "string",
            description:
              "The decrypted data originally supplied in EncryptRequest.plaintext. (Format: byte)",
          },
          usedPrimary: {
            type: "boolean",
            description:
              "Whether the Decryption was performed using the primary key version.",
          },
          plaintextCrc32c: {
            type: "string",
            description:
              "Integrity verification field. A CRC32C checksum of the returned DecryptResponse.plaintext. An integrity check of DecryptResponse.plaintext can be performed by computing the CRC32C checksum of DecryptResponse.plaintext and comparing your results to this field. Discard the response in case of non-matching checksum values, and perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: receiving this response message indicates that KeyManagementService is able to successfully decrypt the ciphertext. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
          protectionLevel: {
            type: "string",
            enum: [
              "PROTECTION_LEVEL_UNSPECIFIED",
              "SOFTWARE",
              "HSM",
              "EXTERNAL",
              "EXTERNAL_VPC",
            ],
            description:
              "The ProtectionLevel of the CryptoKeyVersion used in decryption.",
          },
        },
        description: "Response message for KeyManagementService.Decrypt.",
        additionalProperties: true,
      },
    },
  },
};

export default cryptoKeysDecrypt;
