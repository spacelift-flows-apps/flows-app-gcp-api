import { AppBlock, events } from "@slflows/sdk/v1";
import { getEkmServiceClient } from "../../lib/grpcClient.ts";

const listEkmConnections: AppBlock = {
  name: "List Ekm Connections",
  description: `Lists [EkmConnections][google.cloud.kms.v1.EkmConnection].`,
  category: "Connections",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the location associated with the [EkmConnections][google.cloud.kms.v1.EkmConnection] to list, in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the location associated with the [EkmConnections][google.cloud.kms.v1.EkmConnection] to list, in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [EkmConnections][google.cloud.kms.v1.EkmConnection] to include in the response. Further [EkmConnections][google.cloud.kms.v1.EkmConnection] can subsequently be obtained by including the [ListEkmConnectionsResponse.next_page_token][google.cloud.kms.v1.ListEkmConnectionsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [EkmConnections][google.cloud.kms.v1.EkmConnection] to include in the response. Further [EkmConnections][google.cloud.kms.v1.EkmConnection] can subsequently be obtained by including the [ListEkmConnectionsResponse.next_page_token][google.cloud.kms.v1.ListEkmConnectionsResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListEkmConnectionsResponse.next_page_token][google.cloud.kms.v1.ListEkmConnectionsResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListEkmConnectionsResponse.next_page_token][google.cloud.kms.v1.ListEkmConnectionsResponse.next_page_token].",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Only include resources that match the filter in the response. For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          type: {
            type: "string",
            description:
              "Optional. Specify how the results should be sorted. If not specified, the results will be sorted in the default order.  For more information, see [Sorting and filtering list results](https://cloud.google.com/kms/docs/sorting-and-filtering).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getEkmServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.page_size !== undefined)
          request.page_size = input.event.inputConfig.page_size;
        if (input.event.inputConfig.page_token !== undefined)
          request.page_token = input.event.inputConfig.page_token;
        if (input.event.inputConfig.filter !== undefined)
          request.filter = input.event.inputConfig.filter;
        if (input.event.inputConfig.order_by !== undefined)
          request.order_by = input.event.inputConfig.order_by;

        const result = await new Promise<any>((resolve, reject) => {
          client.listEkmConnections(request, (err: any, response: any) => {
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
          ekm_connections: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name for the [EkmConnection][google.cloud.kms.v1.EkmConnection] in the format `projects/*/locations/*/ekmConnections/*`.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
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
            description:
              "The list of [EkmConnections][google.cloud.kms.v1.EkmConnection].",
          },
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListEkmConnectionsRequest.page_token][google.cloud.kms.v1.ListEkmConnectionsRequest.page_token] to retrieve the next page of results.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of [EkmConnections][google.cloud.kms.v1.EkmConnection] that matched the query.  This field is not populated if [ListEkmConnectionsRequest.filter][google.cloud.kms.v1.ListEkmConnectionsRequest.filter] is applied.",
          },
        },
        description:
          "Response message for [EkmService.ListEkmConnections][google.cloud.kms.v1.EkmService.ListEkmConnections].",
        additionalProperties: true,
      },
    },
  },
};

export default listEkmConnections;
