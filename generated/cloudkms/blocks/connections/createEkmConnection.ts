import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  ekmConnectionId: "ekm_connection_id",
  ekmConnection: {
    name: "ekm_connection",
    fields: {
      serviceResolvers: {
        name: "service_resolvers",
        fields: {
          serviceDirectoryService: "service_directory_service",
          endpointFilter: "endpoint_filter",
          serverCertificates: {
            name: "server_certificates",
            fields: {
              rawDer: "raw_der",
            },
          },
        },
      },
      keyManagementMode: "key_management_mode",
      cryptoSpacePath: "crypto_space_path",
    },
  },
};

const outputMapping = {
  create_time: "createTime",
  service_resolvers: {
    name: "serviceResolvers",
    fields: {
      service_directory_service: "serviceDirectoryService",
      endpoint_filter: "endpointFilter",
      server_certificates: {
        name: "serverCertificates",
        fields: {
          raw_der: "rawDer",
          subject_alternative_dns_names: "subjectAlternativeDnsNames",
          not_before_time: "notBeforeTime",
          not_after_time: "notAfterTime",
          serial_number: "serialNumber",
          sha256_fingerprint: "sha256Fingerprint",
        },
      },
    },
  },
  key_management_mode: "keyManagementMode",
  crypto_space_path: "cryptoSpacePath",
};

const createEkmConnection: AppBlock = {
  name: "Create Ekm Connection",
  description: `Creates a new [EkmConnection][google.cloud.kms.v1.EkmConnection] in a given Project and Location.`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the location associated with the [EkmConnection][google.cloud.kms.v1.EkmConnection], in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the location associated with the [EkmConnection][google.cloud.kms.v1.EkmConnection], in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        ekmConnectionId: {
          name: "Ekm Connection Id",
          description:
            "Required. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          type: {
            type: "string",
            description:
              "Required. It must be unique within a location and match the regular expression `[a-zA-Z0-9_-]{1,63}`.",
          },
          required: true,
        },
        ekmConnection: {
          name: "Ekm Connection",
          description:
            "Required. An [EkmConnection][google.cloud.kms.v1.EkmConnection] with initial field values.",
          type: {
            type: "object",
            properties: {
              serviceResolvers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    serviceDirectoryService: {
                      type: "string",
                      description:
                        "Required. The resource name of the Service Directory service pointing to an EKM replica, in the format `projects/*/locations/*/namespaces/*/services/*`.",
                    },
                    endpointFilter: {
                      type: "string",
                      description:
                        "Optional. The filter applied to the endpoints of the resolved service. If no filter is specified, all endpoints will be considered. An endpoint will be chosen arbitrarily from the filtered list for each request.  For endpoint filter syntax and examples, see https://cloud.google.com/service-directory/docs/reference/rpc/google.cloud.servicedirectory.v1#resolveservicerequest.",
                    },
                    hostname: {
                      type: "string",
                      description:
                        "Required. The hostname of the EKM replica used at TLS and HTTP layers.",
                    },
                    serverCertificates: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          rawDer: {
                            type: "string",
                            description: "Base64-encoded bytes",
                          },
                        },
                        required: ["rawDer"],
                        description:
                          "A [Certificate][google.cloud.kms.v1.Certificate] represents an X.509 certificate used to authenticate HTTPS connections to EKM replicas.",
                        additionalProperties: true,
                      },
                      description:
                        "Required. A list of leaf server certificates used to authenticate HTTPS connections to the EKM replica. Currently, a maximum of 10 [Certificate][google.cloud.kms.v1.Certificate] is supported.",
                    },
                  },
                  required: [
                    "serviceDirectoryService",
                    "hostname",
                    "serverCertificates",
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
              keyManagementMode: {
                type: "string",
                enum: [
                  "KEY_MANAGEMENT_MODE_UNSPECIFIED",
                  "MANUAL",
                  "CLOUD_KMS",
                ],
                description:
                  "Optional. Describes who can perform control plane operations on the EKM. If unset, this defaults to [MANUAL][google.cloud.kms.v1.EkmConnection.KeyManagementMode.MANUAL].",
              },
              cryptoSpacePath: {
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
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.createEkmConnection(request, (err: any, response: any) => {
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
              "Output only. The resource name for the [EkmConnection][google.cloud.kms.v1.EkmConnection] in the format `projects/*/locations/*/ekmConnections/*`.",
          },
          createTime: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          serviceResolvers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                serviceDirectoryService: {
                  type: "string",
                  description:
                    "Required. The resource name of the Service Directory service pointing to an EKM replica, in the format `projects/*/locations/*/namespaces/*/services/*`.",
                },
                endpointFilter: {
                  type: "string",
                  description:
                    "Optional. The filter applied to the endpoints of the resolved service. If no filter is specified, all endpoints will be considered. An endpoint will be chosen arbitrarily from the filtered list for each request.  For endpoint filter syntax and examples, see https://cloud.google.com/service-directory/docs/reference/rpc/google.cloud.servicedirectory.v1#resolveservicerequest.",
                },
                hostname: {
                  type: "string",
                  description:
                    "Required. The hostname of the EKM replica used at TLS and HTTP layers.",
                },
                serverCertificates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rawDer: {
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
                      subjectAlternativeDnsNames: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Output only. The subject Alternative DNS names. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      notBeforeTime: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      notAfterTime: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                      serialNumber: {
                        type: "string",
                        description:
                          "Output only. The certificate serial number as a hex string. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                      sha256Fingerprint: {
                        type: "string",
                        description:
                          "Output only. The SHA-256 certificate fingerprint as a hex string. Only present if [parsed][google.cloud.kms.v1.Certificate.parsed] is true.",
                      },
                    },
                    required: ["rawDer"],
                    description:
                      "A [Certificate][google.cloud.kms.v1.Certificate] represents an X.509 certificate used to authenticate HTTPS connections to EKM replicas.",
                    additionalProperties: true,
                  },
                  description:
                    "Required. A list of leaf server certificates used to authenticate HTTPS connections to the EKM replica. Currently, a maximum of 10 [Certificate][google.cloud.kms.v1.Certificate] is supported.",
                },
              },
              required: [
                "serviceDirectoryService",
                "hostname",
                "serverCertificates",
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
          keyManagementMode: {
            type: "string",
            enum: ["KEY_MANAGEMENT_MODE_UNSPECIFIED", "MANUAL", "CLOUD_KMS"],
            description:
              "Optional. Describes who can perform control plane operations on the EKM. If unset, this defaults to [MANUAL][google.cloud.kms.v1.EkmConnection.KeyManagementMode.MANUAL].",
          },
          cryptoSpacePath: {
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

export default createEkmConnection;
