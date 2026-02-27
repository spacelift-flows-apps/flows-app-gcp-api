import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const globalPublicDelegatedPrefixesPatch: AppBlock = {
  name: "Global Public Delegated Prefixes - Patch",
  description: `Updates the specified wire group resource with the data included in the request. This method supportsPATCH semantics and usesJSON merge patch format and processing rules.`,
  category: "Global Public Delegated Prefixes",
  inputs: {
    default: {
      config: {
        publicDelegatedPrefix: {
          name: "Public Delegated Prefix",
          description: "Name of the PublicDelegatedPrefix resource to patch.",
          type: {
            type: "string",
            description: "Name of the PublicDelegatedPrefix resource to patch.",
          },
          required: true,
        },
        allocatablePrefixLength: {
          name: "Allocatable Prefix Length",
          description:
            "The allocatable prefix length supported by this public delegated prefix. This field is optional and cannot be set for prefixes in DELEGATION mode. It cannot be set for IPv4 prefixes either, and it always defaults to 32.",
          type: {
            type: "integer",
            description:
              "The allocatable prefix length supported by this public delegated prefix. This field is optional and cannot be set for prefixes in DELEGATION mode. It cannot be set for IPv4 prefixes either, and it always defaults to 32.",
          },
          required: false,
        },
        byoipApiVersion: {
          name: "Byoip Api Version",
          description:
            "Output only. [Output Only] The version of BYOIP API. Check the ByoipApiVersion enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_BYOIP_API_VERSION", "V1", "V2"],
            description:
              "Output only. [Output Only] The version of BYOIP API. Check the ByoipApiVersion enum for the list of possible values.",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        enableEnhancedIpv4Allocation: {
          name: "Enable Enhanced Ipv4 Allocation",
          description:
            "Output only. [Output Only] Whether this PDP supports enhanced IPv4 allocations. Applicable for IPv4 PDPs only.",
          type: {
            type: "boolean",
            description:
              "Output only. [Output Only] Whether this PDP supports enhanced IPv4 allocations. Applicable for IPv4 PDPs only.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a new PublicDelegatedPrefix. An up-to-date fingerprint must be provided in order to update thePublicDelegatedPrefix, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a PublicDelegatedPrefix.",
          type: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a new PublicDelegatedPrefix. An up-to-date fingerprint must be provided in order to update thePublicDelegatedPrefix, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a PublicDelegatedPrefix.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource type. The server generates this identifier.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        ipCidrRange: {
          name: "Ip Cidr Range",
          description:
            "The IP address range, in CIDR format, represented by this public delegated prefix.",
          type: {
            type: "string",
            description:
              "The IP address range, in CIDR format, represented by this public delegated prefix.",
          },
          required: false,
        },
        ipv6AccessType: {
          name: "Ipv6 Access Type",
          description:
            "Output only. [Output Only] The internet access type for IPv6 Public Delegated Prefixes. Inherited from parent prefix. Check the Ipv6AccessType enum for the list of possible values.",
          type: {
            type: "string",
            enum: ["UNDEFINED_IPV6_ACCESS_TYPE", "EXTERNAL", "INTERNAL"],
            description:
              "Output only. [Output Only] The internet access type for IPv6 Public Delegated Prefixes. Inherited from parent prefix. Check the Ipv6AccessType enum for the list of possible values.",
          },
          required: false,
        },
        isLiveMigration: {
          name: "Is Live Migration",
          description: "If true, the prefix will be live migrated.",
          type: {
            type: "boolean",
            description: "If true, the prefix will be live migrated.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefix for public delegated prefixes.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#publicDelegatedPrefix for public delegated prefixes.",
          },
          required: false,
        },
        mode: {
          name: "Mode",
          description:
            "The public delegated prefix mode for IPv6 only. Check the Mode enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_MODE",
              "DELEGATION",
              "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
              "EXTERNAL_IPV6_SUBNETWORK_CREATION",
              "INTERNAL_IPV6_SUBNETWORK_CREATION",
            ],
            description:
              "The public delegated prefix mode for IPv6 only. Check the Mode enum for the list of possible values.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        parentPrefix: {
          name: "Parent Prefix",
          description:
            "The URL of parent prefix. Either PublicAdvertisedPrefix or PublicDelegatedPrefix.",
          type: {
            type: "string",
            description:
              "The URL of parent prefix. Either PublicAdvertisedPrefix or PublicDelegatedPrefix.",
          },
          required: false,
        },
        publicDelegatedSubPrefixs: {
          name: "Public Delegated Sub Prefixs",
          description:
            "The list of sub public delegated prefixes that exist for this public delegated prefix.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                allocatablePrefixLength: {
                  type: "integer",
                  description:
                    "The allocatable prefix length supported by this PublicDelegatedSubPrefix.",
                },
                delegateeProject: {
                  type: "string",
                  description:
                    "Name of the project scoping this PublicDelegatedSubPrefix.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                enableEnhancedIpv4Allocation: {
                  type: "boolean",
                  description:
                    "Output only. [Output Only] Whether this PDP supports enhanced IPv4 allocations. Applicable for IPv4 PDPs only.",
                },
                ipCidrRange: {
                  type: "string",
                  description:
                    "The IP address range, in CIDR format, represented by this sub public delegated prefix.",
                },
                ipv6AccessType: {
                  type: "string",
                  enum: ["UNDEFINED_IPV6_ACCESS_TYPE", "EXTERNAL", "INTERNAL"],
                  description:
                    "Output only. [Output Only] The internet access type for IPv6 Public Delegated Sub Prefixes. Inherited from parent prefix. Check the Ipv6AccessType enum for the list of possible values.",
                },
                isAddress: {
                  type: "boolean",
                  description:
                    "Whether the sub prefix is delegated to create Address resources in the delegatee project.",
                },
                mode: {
                  type: "string",
                  enum: [
                    "UNDEFINED_MODE",
                    "DELEGATION",
                    "EXTERNAL_IPV6_FORWARDING_RULE_CREATION",
                    "EXTERNAL_IPV6_SUBNETWORK_CREATION",
                    "INTERNAL_IPV6_SUBNETWORK_CREATION",
                  ],
                  description:
                    "The PublicDelegatedSubPrefix mode for IPv6 only. Check the Mode enum for the list of possible values.",
                },
                name: {
                  type: "string",
                  description: "The name of the sub public delegated prefix.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The region of the sub public delegated prefix if it is regional. If absent, the sub prefix is global.",
                },
                status: {
                  type: "string",
                  enum: ["UNDEFINED_STATUS", "ACTIVE", "INACTIVE"],
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                },
              },
              description: "Represents a sub PublicDelegatedPrefix.",
              additionalProperties: true,
            },
            description:
              "The list of sub public delegated prefixes that exist for this public delegated prefix.",
          },
          required: false,
        },
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] URL of the region where the public delegated prefix resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the public delegated prefix resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "Output only. [Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "[Output Only] The status of the public delegated prefix, which can be one of following values:        - `INITIALIZING` The public delegated prefix is being initialized and      addresses cannot be created yet.      - `READY_TO_ANNOUNCE` The public delegated prefix is a live migration      prefix and is active.      - `ANNOUNCED` The public delegated prefix is announced and ready to      use.      - `DELETING` The public delegated prefix is being deprovsioned.      - `ACTIVE` The public delegated prefix is ready to use. Check the Status enum for the list of possible values.",
          type: {
            type: "string",
            enum: [
              "UNDEFINED_STATUS",
              "ACTIVE",
              "ANNOUNCED",
              "ANNOUNCED_TO_GOOGLE",
              "ANNOUNCED_TO_INTERNET",
              "DELETING",
              "INITIALIZING",
              "READY_TO_ANNOUNCE",
            ],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.publicDelegatedPrefix !== undefined)
          pathParams["public_delegated_prefix"] = String(
            input.event.inputConfig.publicDelegatedPrefix,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.allocatablePrefixLength !== undefined)
          body.allocatablePrefixLength =
            input.event.inputConfig.allocatablePrefixLength;
        if (input.event.inputConfig.byoipApiVersion !== undefined)
          body.byoipApiVersion = input.event.inputConfig.byoipApiVersion;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.enableEnhancedIpv4Allocation !== undefined)
          body.enableEnhancedIpv4Allocation =
            input.event.inputConfig.enableEnhancedIpv4Allocation;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.ipCidrRange !== undefined)
          body.ipCidrRange = input.event.inputConfig.ipCidrRange;
        if (input.event.inputConfig.ipv6AccessType !== undefined)
          body.ipv6AccessType = input.event.inputConfig.ipv6AccessType;
        if (input.event.inputConfig.isLiveMigration !== undefined)
          body.isLiveMigration = input.event.inputConfig.isLiveMigration;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.mode !== undefined)
          body.mode = input.event.inputConfig.mode;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.parentPrefix !== undefined)
          body.parentPrefix = input.event.inputConfig.parentPrefix;
        if (input.event.inputConfig.publicDelegatedSubPrefixs !== undefined)
          body.publicDelegatedSubPrefixs =
            input.event.inputConfig.publicDelegatedSubPrefixs;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;

        const result = await computeFetch({
          config: input.app.config,
          method: "PATCH",
          pathTemplate:
            "/compute/v1/projects/{project}/global/publicDelegatedPrefixes/{public_delegated_prefix}",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
          },
          error: {
            type: "object",
            properties: {
              errors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    code: {
                      type: "string",
                      description:
                        "[Output Only] The error type identifier for this error.",
                    },
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
                            additionalProperties: true,
                          },
                          help: {
                            type: "object",
                            properties: {
                              links: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                  },
                                  description: "Describes a URL link.",
                                  additionalProperties: true,
                                },
                                description:
                                  "URL(s) pointing to additional information on handling the current error.",
                              },
                            },
                            description:
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CODE",
                    "CLEANUP_FAILED",
                    "DEPRECATED_RESOURCE_USED",
                    "DEPRECATED_TYPE_USED",
                    "DISK_SIZE_LARGER_THAN_IMAGE_SIZE",
                    "EXPERIMENTAL_TYPE_USED",
                    "EXTERNAL_API_WARNING",
                    "FIELD_VALUE_OVERRIDEN",
                    "INJECTED_KERNELS_DEPRECATED",
                    "INVALID_HEALTH_CHECK_FOR_DYNAMIC_WIEGHTED_LB",
                    "LARGE_DEPLOYMENT_WARNING",
                    "LIST_OVERHEAD_QUOTA_EXCEED",
                    "MISSING_TYPE_DEPENDENCY",
                    "NEXT_HOP_ADDRESS_NOT_ASSIGNED",
                    "NEXT_HOP_CANNOT_IP_FORWARD",
                    "NEXT_HOP_INSTANCE_HAS_NO_IPV6_INTERFACE",
                    "NEXT_HOP_INSTANCE_NOT_FOUND",
                    "NEXT_HOP_INSTANCE_NOT_ON_NETWORK",
                    "NEXT_HOP_NOT_RUNNING",
                    "NOT_CRITICAL_ERROR",
                    "NO_RESULTS_ON_PAGE",
                    "PARTIAL_SUCCESS",
                    "QUOTA_INFO_UNAVAILABLE",
                    "REQUIRED_TOS_AGREEMENT",
                    "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING",
                    "RESOURCE_NOT_DELETED",
                    "SCHEMA_VALIDATION_IGNORED",
                    "SINGLE_INSTANCE_PROPERTY_TEMPLATE",
                    "UNDECLARED_PROPERTIES",
                    "UNREACHABLE",
                  ],
                  description:
                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
                      },
                      value: {
                        type: "string",
                        description:
                          "[Output Only] A warning data value corresponding to the key.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                },
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default globalPublicDelegatedPrefixesPatch;
