import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getKeyManagementServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const outputMapping = {
  import_method: "importMethod",
  protection_level: "protectionLevel",
  create_time: "createTime",
  generate_time: "generateTime",
  expire_time: "expireTime",
  expire_event_time: "expireEventTime",
  public_key: "publicKey",
  attestation: {
    name: "attestation",
    fields: {
      cert_chains: {
        name: "certChains",
        fields: {
          cavium_certs: "caviumCerts",
          google_card_certs: "googleCardCerts",
          google_partition_certs: "googlePartitionCerts",
        },
      },
    },
  },
  crypto_key_backend: "cryptoKeyBackend",
};

const getImportJob: AppBlock = {
  name: "Get Import Job",
  description: `Returns metadata for a given [ImportJob][google.cloud.kms.v1.ImportJob].`,
  category: "Import Jobs",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [name][google.cloud.kms.v1.ImportJob.name] of the [ImportJob][google.cloud.kms.v1.ImportJob] to get.",
          type: {
            type: "string",
            description:
              "Required. The [name][google.cloud.kms.v1.ImportJob.name] of the [ImportJob][google.cloud.kms.v1.ImportJob] to get.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getKeyManagementServiceClient(input.app.config);

        const request = { ...input.event.inputConfig };

        const result = await new Promise<any>((resolve, reject) => {
          client.getImportJob(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              "Output only. The resource name for this [ImportJob][google.cloud.kms.v1.ImportJob] in the format `projects/*/locations/*/keyRings/*/importJobs/*`.",
          },
          importMethod: {
            type: "string",
            enum: [
              "IMPORT_METHOD_UNSPECIFIED",
              "RSA_OAEP_3072_SHA1_AES_256",
              "RSA_OAEP_4096_SHA1_AES_256",
              "RSA_OAEP_3072_SHA256_AES_256",
              "RSA_OAEP_4096_SHA256_AES_256",
              "RSA_OAEP_3072_SHA256",
              "RSA_OAEP_4096_SHA256",
            ],
            description:
              "Required. Immutable. The wrapping method to be used for incoming key material.",
          },
          protectionLevel: {
            type: "string",
            enum: [
              "PROTECTION_LEVEL_UNSPECIFIED",
              "SOFTWARE",
              "HSM",
              "EXTERNAL",
              "EXTERNAL_VPC",
              "HSM_SINGLE_TENANT",
            ],
            description:
              "[ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] specifies how cryptographic operations are performed. For more information, see [Protection levels] (https://cloud.google.com/kms/docs/algorithms#protection_levels).",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          generateTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          expireTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          expireEventTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          state: {
            type: "string",
            enum: [
              "IMPORT_JOB_STATE_UNSPECIFIED",
              "PENDING_GENERATION",
              "ACTIVE",
              "EXPIRED",
            ],
            description:
              "Output only. The current state of the [ImportJob][google.cloud.kms.v1.ImportJob], indicating if it can be used.",
          },
          publicKey: {
            type: "object",
            properties: {
              pem: {
                type: "string",
                description:
                  "The public key, encoded in PEM format. For more information, see the [RFC 7468](https://tools.ietf.org/html/rfc7468) sections for [General Considerations](https://tools.ietf.org/html/rfc7468#section-2) and [Textual Encoding of Subject Public Key Info] (https://tools.ietf.org/html/rfc7468#section-13).",
              },
            },
            description:
              "The public key component of the wrapping key. For details of the type of key this public key corresponds to, see the [ImportMethod][google.cloud.kms.v1.ImportJob.ImportMethod].",
            additionalProperties: true,
          },
          attestation: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: [
                  "ATTESTATION_FORMAT_UNSPECIFIED",
                  "CAVIUM_V1_COMPRESSED",
                  "CAVIUM_V2_COMPRESSED",
                ],
                description: "Output only. The format of the attestation data.",
              },
              content: {
                type: "string",
                description: "Base64-encoded bytes",
              },
              certChains: {
                type: "object",
                properties: {
                  caviumCerts: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Cavium certificate chain corresponding to the attestation.",
                  },
                  googleCardCerts: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Google card certificate chain corresponding to the attestation.",
                  },
                  googlePartitionCerts: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "Google partition certificate chain corresponding to the attestation.",
                  },
                },
                description:
                  "Certificate chains needed to verify the attestation. Certificates in chains are PEM-encoded and are ordered based on https://tools.ietf.org/html/rfc5246#section-7.4.2.",
                additionalProperties: true,
              },
            },
            description:
              "Contains an HSM-generated attestation about a key operation. For more information, see [Verifying attestations] (https://cloud.google.com/kms/docs/attest-key).",
            additionalProperties: true,
          },
          cryptoKeyBackend: {
            type: "string",
            description:
              'Immutable. The resource name of the backend environment where the key material for the wrapping key resides and where all related cryptographic operations are performed. Currently, this field is only populated for keys stored in HSM_SINGLE_TENANT. Note, this list is non-exhaustive and may apply to additional [ProtectionLevels][google.cloud.kms.v1.ProtectionLevel] in the future. Supported resources: * `"projects/*/locations/*/singleTenantHsmInstances/*"`',
          },
        },
        required: ["importMethod", "protectionLevel"],
        description:
          'An [ImportJob][google.cloud.kms.v1.ImportJob] can be used to create [CryptoKeys][google.cloud.kms.v1.CryptoKey] and [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] using pre-existing key material, generated outside of Cloud KMS.  When an [ImportJob][google.cloud.kms.v1.ImportJob] is created, Cloud KMS will generate a "wrapping key", which is a public/private key pair. You use the wrapping key to encrypt (also known as wrap) the pre-existing key material to protect it during the import process. The nature of the wrapping key depends on the choice of [import_method][google.cloud.kms.v1.ImportJob.import_method]. When the wrapping key generation is complete, the [state][google.cloud.kms.v1.ImportJob.state] will be set to [ACTIVE][google.cloud.kms.v1.ImportJob.ImportJobState.ACTIVE] and the [public_key][google.cloud.kms.v1.ImportJob.public_key] can be fetched. The fetched public key can then be used to wrap your pre-existing key material.  Once the key material is wrapped, it can be imported into a new [CryptoKeyVersion][google.cloud.kms.v1.CryptoKeyVersion] in an existing [CryptoKey][google.cloud.kms.v1.CryptoKey] by calling [ImportCryptoKeyVersion][google.cloud.kms.v1.KeyManagementService.ImportCryptoKeyVersion]. Multiple [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] can be imported with a single [ImportJob][google.cloud.kms.v1.ImportJob]. Cloud KMS uses the private key portion of the wrapping key to unwrap the key material. Only Cloud KMS has access to the private key.  An [ImportJob][google.cloud.kms.v1.ImportJob] expires 3 days after it is created. Once expired, Cloud KMS will no longer be able to import or unwrap any key material that was wrapped with the [ImportJob][google.cloud.kms.v1.ImportJob]\'s public key.  For more information, see [Importing a key](https://cloud.google.com/kms/docs/importing-a-key).',
        additionalProperties: true,
      },
    },
  },
};

export default getImportJob;
