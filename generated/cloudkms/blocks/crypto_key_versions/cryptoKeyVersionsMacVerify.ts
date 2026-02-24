import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const cryptoKeyVersionsMacVerify: AppBlock = {
  name: "Crypto Key Versions - Mac Verify",
  description: `Verifies MAC tag using a CryptoKeyVersion with CryptoKey.`,
  category: "Crypto Key Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the CryptoKeyVersion to use for verification.",
          type: {
            type: "string",
          },
          required: true,
        },
        dataCrc32c: {
          name: "Data Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the MacVerifyRequest.data. If specified, KeyManagementService will verify the integrity of the received MacVerifyRequest.data using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(MacVerifyRequest.data) is equal to MacVerifyRequest.data_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
          required: false,
        },
        macCrc32c: {
          name: "Mac Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the MacVerifyRequest.mac. If specified, KeyManagementService will verify the integrity of the received MacVerifyRequest.mac using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(MacVerifyRequest.mac) is equal to MacVerifyRequest.mac_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
          required: false,
        },
        mac: {
          name: "Mac",
          description: "Required.",
          type: {
            type: "string",
            description: "Required. The signature to verify. (Format: byte)",
          },
          required: false,
        },
        data: {
          name: "Data",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. The data used previously as a MacSignRequest.data to generate the MAC tag. (Format: byte)",
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
        let path = `v1/{+name}:macVerify`;

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

        if (input.event.inputConfig.dataCrc32c !== undefined)
          requestBody.dataCrc32c = input.event.inputConfig.dataCrc32c;
        if (input.event.inputConfig.macCrc32c !== undefined)
          requestBody.macCrc32c = input.event.inputConfig.macCrc32c;
        if (input.event.inputConfig.mac !== undefined)
          requestBody.mac = input.event.inputConfig.mac;
        if (input.event.inputConfig.data !== undefined)
          requestBody.data = input.event.inputConfig.data;

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
          name: {
            type: "string",
            description:
              "The resource name of the CryptoKeyVersion used for verification. Check this field to verify that the intended resource was used for verification.",
          },
          verifiedMacCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether MacVerifyRequest.mac_crc32c was received by KeyManagementService and used for the integrity verification of the data. A false value of this field indicates either that MacVerifyRequest.mac_crc32c was left unset or that it was not delivered to KeyManagementService. If you've set MacVerifyRequest.mac_crc32c but this field is still false, discard the response and perform a limited number of retries.",
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
              "The ProtectionLevel of the CryptoKeyVersion used for verification.",
          },
          success: {
            type: "boolean",
            description:
              "This field indicates whether or not the verification operation for MacVerifyRequest.mac over MacVerifyRequest.data was successful.",
          },
          verifiedDataCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether MacVerifyRequest.data_crc32c was received by KeyManagementService and used for the integrity verification of the data. A false value of this field indicates either that MacVerifyRequest.data_crc32c was left unset or that it was not delivered to KeyManagementService. If you've set MacVerifyRequest.data_crc32c but this field is still false, discard the response and perform a limited number of retries.",
          },
          verifiedSuccessIntegrity: {
            type: "boolean",
            description:
              "Integrity verification field. This value is used for the integrity verification of [MacVerifyResponse.success]. If the value of this field contradicts the value of [MacVerifyResponse.success], discard the response and perform a limited number of retries.",
          },
        },
        description: "Response message for KeyManagementService.MacVerify.",
        additionalProperties: true,
      },
    },
  },
};

export default cryptoKeyVersionsMacVerify;
