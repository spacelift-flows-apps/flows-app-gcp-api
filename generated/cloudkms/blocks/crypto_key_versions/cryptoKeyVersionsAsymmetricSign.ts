import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const cryptoKeyVersionsAsymmetricSign: AppBlock = {
  name: "Crypto Key Versions - Asymmetric Sign",
  description: `Signs data using a CryptoKeyVersion with CryptoKey.`,
  category: "Crypto Key Versions",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The resource name of the CryptoKeyVersion to use for signing.",
          type: {
            type: "string",
          },
          required: true,
        },
        data: {
          name: "Data",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. The data to sign. It can't be supplied if AsymmetricSignRequest.digest is supplied. (Format: byte)",
          },
          required: false,
        },
        digest: {
          name: "Digest",
          description: "Optional.",
          type: {
            type: "object",
            properties: {
              sha512: {
                type: "string",
                description:
                  "A message digest produced with the SHA-512 algorithm. (Format: byte)",
              },
              sha256: {
                type: "string",
                description:
                  "A message digest produced with the SHA-256 algorithm. (Format: byte)",
              },
              sha384: {
                type: "string",
                description:
                  "A message digest produced with the SHA-384 algorithm. (Format: byte)",
              },
            },
            description: "A Digest holds a cryptographic message digest.",
            additionalProperties: true,
          },
          required: false,
        },
        dataCrc32c: {
          name: "Data Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the AsymmetricSignRequest.data. If specified, KeyManagementService will verify the integrity of the received AsymmetricSignRequest.data using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(AsymmetricSignRequest.data) is equal to AsymmetricSignRequest.data_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
          },
          required: false,
        },
        digestCrc32c: {
          name: "Digest Crc32c",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. An optional CRC32C checksum of the AsymmetricSignRequest.digest. If specified, KeyManagementService will verify the integrity of the received AsymmetricSignRequest.digest using this checksum. KeyManagementService will report an error if the checksum verification fails. If you receive a checksum error, your client should verify that CRC32C(AsymmetricSignRequest.digest) is equal to AsymmetricSignRequest.digest_crc32c, and if so, perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
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
        let path = `v1/{+name}:asymmetricSign`;

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

        if (input.event.inputConfig.data !== undefined)
          requestBody.data = input.event.inputConfig.data;
        if (input.event.inputConfig.digest !== undefined)
          requestBody.digest = input.event.inputConfig.digest;
        if (input.event.inputConfig.dataCrc32c !== undefined)
          requestBody.dataCrc32c = input.event.inputConfig.dataCrc32c;
        if (input.event.inputConfig.digestCrc32c !== undefined)
          requestBody.digestCrc32c = input.event.inputConfig.digestCrc32c;

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
          verifiedDigestCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether AsymmetricSignRequest.digest_crc32c was received by KeyManagementService and used for the integrity verification of the digest. A false value of this field indicates either that AsymmetricSignRequest.digest_crc32c was left unset or that it was not delivered to KeyManagementService. If you've set AsymmetricSignRequest.digest_crc32c but this field is still false, discard the response and perform a limited number of retries.",
          },
          signature: {
            type: "string",
            description: "The created signature. (Format: byte)",
          },
          verifiedDataCrc32c: {
            type: "boolean",
            description:
              "Integrity verification field. A flag indicating whether AsymmetricSignRequest.data_crc32c was received by KeyManagementService and used for the integrity verification of the data. A false value of this field indicates either that AsymmetricSignRequest.data_crc32c was left unset or that it was not delivered to KeyManagementService. If you've set AsymmetricSignRequest.data_crc32c but this field is still false, discard the response and perform a limited number of retries.",
          },
          name: {
            type: "string",
            description:
              "The resource name of the CryptoKeyVersion used for signing. Check this field to verify that the intended resource was used for signing.",
          },
          signatureCrc32c: {
            type: "string",
            description:
              "Integrity verification field. A CRC32C checksum of the returned AsymmetricSignResponse.signature. An integrity check of AsymmetricSignResponse.signature can be performed by computing the CRC32C checksum of AsymmetricSignResponse.signature and comparing your results to this field. Discard the response in case of non-matching checksum values, and perform a limited number of retries. A persistent mismatch may indicate an issue in your computation of the CRC32C checksum. Note: This field is defined as int64 for reasons of compatibility across different languages. However, it is a non-negative integer, which will never exceed 2^32-1, and can be safely downconverted to uint32 in languages that support this type. (Format: int64)",
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
              "The ProtectionLevel of the CryptoKeyVersion used for signing.",
          },
        },
        description:
          "Response message for KeyManagementService.AsymmetricSign.",
        additionalProperties: true,
      },
    },
  },
};

export default cryptoKeyVersionsAsymmetricSign;
