import { AppBlock, events } from "@slflows/sdk/v1";
import { getHsmManagementClient } from "../../lib/grpcClient.ts";

const listSingleTenantHsmInstances: AppBlock = {
  name: "List Single Tenant Hsm Instances",
  description: `Lists [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance].`,
  category: "General",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The resource name of the location associated with the [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] to list, in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The resource name of the location associated with the [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] to list, in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        page_size: {
          name: "Page Size",
          description:
            "Optional. Optional limit on the number of [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] to include in the response. Further [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] can subsequently be obtained by including the [ListSingleTenantHsmInstancesResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstancesResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          type: {
            type: "integer",
            description:
              "Optional. Optional limit on the number of [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] to include in the response. Further [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] can subsequently be obtained by including the [ListSingleTenantHsmInstancesResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstancesResponse.next_page_token] in a subsequent request. If unspecified, the server will pick an appropriate default.",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Optional. Optional pagination token, returned earlier via [ListSingleTenantHsmInstancesResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstancesResponse.next_page_token].",
          type: {
            type: "string",
            description:
              "Optional. Optional pagination token, returned earlier via [ListSingleTenantHsmInstancesResponse.next_page_token][google.cloud.kms.v1.ListSingleTenantHsmInstancesResponse.next_page_token].",
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
        show_deleted: {
          name: "Show Deleted",
          description:
            "Optional. If set to true, [HsmManagement.ListSingleTenantHsmInstances][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstances] will also return [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] in DELETED state.",
          type: {
            type: "boolean",
            description:
              "Optional. If set to true, [HsmManagement.ListSingleTenantHsmInstances][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstances] will also return [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] in DELETED state.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getHsmManagementClient(input.app.config);

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
        if (input.event.inputConfig.show_deleted !== undefined)
          request.show_deleted = input.event.inputConfig.show_deleted;

        const result = await new Promise<any>((resolve, reject) => {
          client.listSingleTenantHsmInstances(
            request,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          single_tenant_hsm_instances: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. The resource name for this [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] in the format `projects/*/locations/*/singleTenantHsmInstances/*`.",
                },
                create_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "CREATING",
                    "PENDING_TWO_FACTOR_AUTH_REGISTRATION",
                    "ACTIVE",
                    "DISABLING",
                    "DISABLED",
                    "DELETING",
                    "DELETED",
                    "FAILED",
                  ],
                  description:
                    "Output only. The state of the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
                },
                quorum_auth: {
                  type: "object",
                  properties: {
                    total_approver_count: {
                      type: "integer",
                      description:
                        "Required. The total number of approvers. This is the N value used for M of N quorum auth. Must be greater than or equal to 3 and less than or equal to 16.",
                    },
                    required_approver_count: {
                      type: "integer",
                      description:
                        "Output only. The required numbers of approvers. The M value used for M of N quorum auth. Must be greater than or equal to 2 and less than or equal to [total_approver_count][google.cloud.kms.v1.SingleTenantHsmInstance.QuorumAuth.total_approver_count] - 1.",
                    },
                    two_factor_public_key_pems: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Output only. The public keys associated with the 2FA keys for M of N quorum auth.",
                    },
                  },
                  required: ["total_approver_count"],
                  description: "Configuration for M of N quorum auth.",
                  additionalProperties: true,
                },
                delete_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                unrefreshed_duration_until_disable: {
                  type: "string",
                  description: "Duration string (e.g., '1.5s', '300s')",
                },
                disable_time: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              required: ["quorum_auth"],
              description:
                "A [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance] represents a single-tenant HSM instance. It can be used for creating [CryptoKeys][google.cloud.kms.v1.CryptoKey] with a [ProtectionLevel][google.cloud.kms.v1.ProtectionLevel] of [HSM_SINGLE_TENANT][CryptoKeyVersion.ProtectionLevel.HSM_SINGLE_TENANT], as well as performing cryptographic operations using keys created within the [SingleTenantHsmInstance][google.cloud.kms.v1.SingleTenantHsmInstance].",
              additionalProperties: true,
            },
            description:
              "The list of [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance].",
          },
          next_page_token: {
            type: "string",
            description:
              "A token to retrieve next page of results. Pass this value in [ListSingleTenantHsmInstancesRequest.page_token][google.cloud.kms.v1.ListSingleTenantHsmInstancesRequest.page_token] to retrieve the next page of results.",
          },
          total_size: {
            type: "integer",
            description:
              "The total number of [SingleTenantHsmInstances][google.cloud.kms.v1.SingleTenantHsmInstance] that matched the query.  This field is not populated if [ListSingleTenantHsmInstancesRequest.filter][google.cloud.kms.v1.ListSingleTenantHsmInstancesRequest.filter] is applied.",
          },
        },
        description:
          "Response message for [HsmManagement.ListSingleTenantHsmInstances][google.cloud.kms.v1.HsmManagement.ListSingleTenantHsmInstances].",
        additionalProperties: true,
      },
    },
  },
};

export default listSingleTenantHsmInstances;
