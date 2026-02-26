import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient } from "../../lib/grpcClient.ts";

const updateEkmConnection: AppBlock = {
  name: "Update Ekm Connection",
  description: `Updates an [EkmConnection][google.cloud.kms.v1.EkmConnection]'s metadata.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        ekm_connection: {
          name: "Ekm Connection",
          description:
            "Required. [EkmConnection][google.cloud.kms.v1.EkmConnection] with updated values.",
          type: {
            type: "object",
            properties: {
              service_resolvers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    service_directory_service: {
                      type: "string",
                      description:
                        "Required. The resource name of the Service Directory service pointing to an EKM replica, in the format `projects/*/locations/*/namespaces/*/services/*`.",
                    },
                    endpoint_filter: {
                      type: "string",
                      description:
                        "Optional. The filter applied to the endpoints of the resolved service. If no filter is specified, all endpoints will be considered. An endpoint will be chosen arbitrarily from the filtered list for each request.  For endpoint filter syntax and examples, see https://cloud.google.com/service-directory/docs/reference/rpc/google.cloud.servicedirectory.v1#resolveservicerequest.",
                    },
                    hostname: {
                      type: "string",
                      description:
                        "Required. The hostname of the EKM replica used at TLS and HTTP layers.",
                    },
                    server_certificates: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          raw_der: {
                            type: "string",
                            description: "Base64-encoded bytes",
                          },
                        },
                        required: ["raw_der"],
                        description:
                          "A [Certificate][google.cloud.kms.v1.Certificate] represents an X.509 certificate used to authenticate HTTPS connections to EKM replicas.",
                        additionalProperties: true,
                      },
                      description:
                        "Required. A list of leaf server certificates used to authenticate HTTPS connections to the EKM replica. Currently, a maximum of 10 [Certificate][google.cloud.kms.v1.Certificate] is supported.",
                    },
                  },
                  required: [
                    "service_directory_service",
                    "hostname",
                    "server_certificates",
                  ],
                  description:
                    "A [ServiceResolver][google.cloud.kms.v1.EkmConnection.ServiceResolver] represents an EKM replica that can be reached within an [EkmConnection][google.cloud.kms.v1.EkmConnection].",
                  additionalProperties: true,
                },
                description:
                  "Optional. A list of [ServiceResolvers][google.cloud.kms.v1.EkmConnection.ServiceResolver] where the EKM can be reached. There should be one ServiceResolver per EKM replica. Currently, only a single [ServiceResolver][google.cloud.kms.v1.EkmConnection.ServiceResolver] is supported.",
              },
              etag: {
                type: "string",
                description:
                  "Optional. Etag of the currently stored [EkmConnection][google.cloud.kms.v1.EkmConnection].",
              },
              key_management_mode: {
                type: "string",
                enum: [
                  "KEY_MANAGEMENT_MODE_UNSPECIFIED",
                  "MANUAL",
                  "CLOUD_KMS",
                ],
                description:
                  "Optional. Describes who can perform control plane operations on the EKM. If unset, this defaults to [MANUAL][google.cloud.kms.v1.EkmConnection.KeyManagementMode.MANUAL].",
              },
              crypto_space_path: {
                type: "string",
                description:
                  "Optional. Identifies the EKM Crypto Space that this [EkmConnection][google.cloud.kms.v1.EkmConnection] maps to. Note: This field is required if [KeyManagementMode][google.cloud.kms.v1.EkmConnection.KeyManagementMode] is [CLOUD_KMS][google.cloud.kms.v1.EkmConnection.KeyManagementMode.CLOUD_KMS].",
              },
            },
            description:
              "An [EkmConnection][google.cloud.kms.v1.EkmConnection] represents an individual EKM connection. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] and [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC], as well as performing cryptographic operations using keys created within the [EkmConnection][google.cloud.kms.v1.EkmConnection].",
            additionalProperties: true,
          },
          required: true,
        },
        update_mask: {
          name: "Update Mask",
          description:
            "Required. List of fields to be updated in this request.",
          type: {
            type: "string",
            description:
              "Comma-separated field paths (e.g., 'field1,field2.subfield')",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.ekm_connection !== undefined)
          request.ekm_connection = input.event.inputConfig.ekm_connection;
        if (input.event.inputConfig.update_mask !== undefined)
          request.update_mask = input.event.inputConfig.update_mask;

        const result = await new Promise<any>((resolve, reject) => {
          client.updateEkmConnection(request, (err: any, response: any) => {
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
          name: {
            type: "string",
            description:
              "Output only. The resource name for the [EkmConnection][google.cloud.kms.v1.EkmConnection] in the format `projects/*/locations/*/ekmConnections/*`.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          service_resolvers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                service_directory_service: {
                  type: "string",
                  description:
                    "Required. The resource name of the Service Directory service pointing to an EKM replica, in the format `projects/*/locations/*/namespaces/*/services/*`.",
                },
                endpoint_filter: {
                  type: "string",
                  description:
                    "Optional. The filter applied to the endpoints of the resolved service. If no filter is specified, all endpoints will be considered. An endpoint will be chosen arbitrarily from the filtered list for each request.  For endpoint filter syntax and examples, see https://cloud.google.com/service-directory/docs/reference/rpc/google.cloud.servicedirectory.v1#resolveservicerequest.",
                },
                hostname: {
                  type: "string",
                  description:
                    "Required. The hostname of the EKM replica used at TLS and HTTP layers.",
                },
                server_certificates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      raw_der: {
                        type: "string",
                        description: "Base64-encoded bytes",
                      },
                      parsed: {
                        type: "boolean",
                        description:
                          "Output only. True if the certificate was parsed successfully.",
                      },
                      issuer: {
                        type: "string",
                        description:
                          "Output only. The issuer distinguished name in RFC 2253 format. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      subject: {
                        type: "string",
                        description:
                          "Output only. The subject distinguished name in RFC 2253 format. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      subject_alternative_dns_names: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Output only. The subject Alternative DNS names. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      not_before_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      not_after_time: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      serial_number: {
                        type: "string",
                        description:
                          "Output only. The certificate serial number as a hex string. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      sha256_fingerprint: {
                        type: "string",
                        description:
                          "Output only. The SHA-256 certificate fingerprint as a hex string. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                    },
                    required: ["raw_der"],
                    description:
                      "A [Certificate][google.cloud.kms.v1.Certificate] represents an X.509 certificate used to authenticate HTTPS connections to EKM replicas.",
                    additionalProperties: true,
                  },
                  description:
                    "Required. A list of leaf server certificates used to authenticate HTTPS connections to the EKM replica. Currently, a maximum of 10 [Certificate][google.cloud.kms.v1.Certificate] is supported.",
                },
              },
              required: [
                "service_directory_service",
                "hostname",
                "server_certificates",
              ],
              description:
                "A [ServiceResolver][google.cloud.kms.v1.EkmConnection.ServiceResolver] represents an EKM replica that can be reached within an [EkmConnection][google.cloud.kms.v1.EkmConnection].",
              additionalProperties: true,
            },
            description:
              "Optional. A list of [ServiceResolvers][google.cloud.kms.v1.EkmConnection.ServiceResolver] where the EKM can be reached. There should be one ServiceResolver per EKM replica. Currently, only a single [ServiceResolver][google.cloud.kms.v1.EkmConnection.ServiceResolver] is supported.",
          },
          etag: {
            type: "string",
            description:
              "Optional. Etag of the currently stored [EkmConnection][google.cloud.kms.v1.EkmConnection].",
          },
          key_management_mode: {
            type: "string",
            enum: ["KEY_MANAGEMENT_MODE_UNSPECIFIED", "MANUAL", "CLOUD_KMS"],
            description:
              "Optional. Describes who can perform control plane operations on the EKM. If unset, this defaults to [MANUAL][google.cloud.kms.v1.EkmConnection.KeyManagementMode.MANUAL].",
          },
          crypto_space_path: {
            type: "string",
            description:
              "Optional. Identifies the EKM Crypto Space that this [EkmConnection][google.cloud.kms.v1.EkmConnection] maps to. Note: This field is required if [KeyManagementMode][google.cloud.kms.v1.EkmConnection.KeyManagementMode] is [CLOUD_KMS][google.cloud.kms.v1.EkmConnection.KeyManagementMode.CLOUD_KMS].",
          },
        },
        description:
          "An [EkmConnection][google.cloud.kms.v1.EkmConnection] represents an individual EKM connection. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] and [CryptoKeyVersions][google.cloud.kms.v1.CryptoKeyVersion] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [EXTERNAL_VPC][google.cloud.kms.v1.ProtectionLevel.EXTERNAL_VPC], as well as performing cryptographic operations using keys created within the [EkmConnection][google.cloud.kms.v1.EkmConnection].",
        additionalProperties: true,
      },
    },
  },
};

export default updateEkmConnection;
