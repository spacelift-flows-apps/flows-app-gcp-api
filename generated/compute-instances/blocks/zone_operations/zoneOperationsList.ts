import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const zoneOperationsList: AppBlock = {
  name: "Zone Operations - List",
  description: `Retrieves a list of Operation resources contained within the specified zone.`,
  category: "Zone Operations",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "Name of the zone for request.",
          type: {
            type: "string",
          },
          required: true,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most\nCompute resources support two types of filter expressions:\nexpressions that support regular expressions and expressions that follow\nAPI improvement proposal AIP-160.\nThese two types of filter expressions cannot be mixed in one request.\n\nIf you want to use AIP-160, your expression must specify the field name, an\noperator, and the value that you want to use for filtering. The value\nmust be a string, a number, or a boolean. The operator\nmust be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.\n\nFor example, if you are filtering Compute Engine instances, you can\nexclude instances named `example-instance` by specifying\n`name != example-instance`.\n\nThe `:*` comparison can be used to test whether a key has been defined.\nFor example, to find all objects with `owner` label use:\n```\nlabels.owner:*\n```\n\nYou can also filter nested fields. For example, you could specify\n`scheduling.automaticRestart = false` to include instances only\nif they are not scheduled for automatic restarts. You can use filtering\non nested fields to filter based onresource labels.\n\nTo filter on multiple expressions, provide each separate expression within\nparentheses. For example:\n```\n(scheduling.automaticRestart = true)\n(cpuPlatform = "Intel Skylake")\n```\nBy default, each expression is an `AND` expression. However, you\ncan include `AND` and `OR` expressions explicitly.\nFor example:\n```\n(cpuPlatform = "Intel Skylake") OR\n(cpuPlatform = "Intel Broadwell") AND\n(scheduling.automaticRestart = true)\n```\n\nIf you want to use a regular expression, use the `eq` (equal) or `ne`\n(not equal) operator against a single un-parenthesized expression with or\nwithout quotes or against multiple parenthesized expressions. Examples:\n\n`fieldname eq unquoted literal`\n`fieldname eq \'single quoted literal\'`\n`fieldname eq "double quoted literal"`\n`(fieldname1 eq literal) (fieldname2 ne "literal")`\n\nThe literal value is interpreted as a regular expression using GoogleRE2 library syntax.\nThe literal value must match the entire field.\n\nFor example, to filter for instances that do not end with name "instance",\nyou would use `name ne .*instance`.\n\nYou cannot combine constraints on multiple fields using regular\nexpressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/zones/{zone}/operations`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

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
          warning: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "[Output Only] A human-readable description of the warning code.",
              },
              code: {
                type: "string",
                enum: [
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
                  "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      description:
                        "[Output Only] A warning data value corresponding to the key.",
                    },
                    key: {
                      type: "string",
                      description:
                        "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
              },
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                targetId: {
                  type: "string",
                  description:
                    "[Output Only] The unique target ID, which identifies a specific incarnation\nof the target resource. (Format: uint64)",
                },
                creationTimestamp: {
                  type: "string",
                  description: "[Deprecated] This field is deprecated.",
                },
                httpErrorMessage: {
                  type: "string",
                  description:
                    "[Output Only] If the operation fails, this field contains the HTTP error\nmessage that was returned, such as `NOT FOUND`.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always `compute#operation` for\nOperation resources.",
                },
                setCommonInstanceMetadataOperationMetadata: {
                  type: "object",
                  properties: {
                    perLocationOperations: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "[Output Only] Status information per location (location name is key).\nExample key: zones/us-central1-a",
                    },
                    clientOperationId: {
                      type: "string",
                      description: "[Output Only] The client operation id.",
                    },
                  },
                  additionalProperties: true,
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the operation. This identifier is\ndefined by the server. (Format: uint64)",
                },
                region: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the region where the operation resides. Only\napplicable when performing regional operations.",
                },
                startTime: {
                  type: "string",
                  description:
                    "[Output Only] The time that this operation was started by the server.\nThis value is inRFC3339\ntext format.",
                },
                zone: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the zone where the operation resides. Only\napplicable when performing per-zone operations.",
                },
                statusMessage: {
                  type: "string",
                  description:
                    "[Output Only] An optional textual description of the current status of the\noperation.",
                },
                user: {
                  type: "string",
                  description:
                    "[Output Only] User who requested the operation, for example:\n`user@example.com` or\n`alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
                },
                warnings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description:
                          "[Output Only] A human-readable description of the warning code.",
                      },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            key: {
                              type: "string",
                              description:
                                "[Output Only] A key that provides more detail on the warning being\nreturned. For example, for warnings where there are no results in a list\nrequest for a particular zone, this key might be scope and\nthe key value might be the zone name. Other examples might be a key\nindicating a deprecated resource and a suggested replacement, or a\nwarning about invalid network settings (for example, if an instance\nattempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                          '[Output Only] Metadata about this warning in key:\nvalue format. For example:\n\n"data": [\n  {\n   "key": "scope",\n   "value": "zones/us-east1-d"\n  }',
                      },
                      code: {
                        type: "string",
                        enum: [
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
                          "[Output Only] A warning code, if applicable. For example, Compute\nEngine returns NO_RESULTS_ON_PAGE if there\nare no results in the response.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "[Output Only] If warning messages are generated during processing of the\noperation, this field will be populated.",
                },
                operationType: {
                  type: "string",
                  description:
                    "[Output Only] The type of operation, such as `insert`,\n`update`, or `delete`, and so on.",
                },
                targetLink: {
                  type: "string",
                  description:
                    "[Output Only] The URL of the resource that the operation modifies. For\noperations related to creating a snapshot, this points to the disk\nthat the snapshot was created from.",
                },
                instancesBulkInsertOperationMetadata: {
                  type: "object",
                  properties: {
                    perLocationStatus: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Status information per location (location name is key).\nExample key: zones/us-central1-a",
                    },
                  },
                  additionalProperties: true,
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
                          message: {
                            type: "string",
                            description:
                              "[Output Only] An optional, human-readable error message.",
                          },
                          errorDetails: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                localizedMessage: {
                                  type: "object",
                                  properties: {
                                    message: {
                                      type: "string",
                                      description:
                                        "The localized error message in the above locale.",
                                    },
                                    locale: {
                                      type: "string",
                                      description:
                                        'The locale used following the specification defined at\nhttps://www.rfc-editor.org/rfc/bcp/bcp47.txt.\nExamples are: "en-US", "fr-CH", "es-MX"',
                                    },
                                  },
                                  description:
                                    "Provides a localized error message that is safe to return to the user\nwhich can be attached to an RPC error.",
                                  additionalProperties: true,
                                },
                                errorInfo: {
                                  type: "object",
                                  properties: {
                                    metadatas: {
                                      type: "object",
                                      additionalProperties: {
                                        type: "string",
                                      },
                                      description:
                                        'Additional structured details about this error.\n\nKeys must match a regular expression of `a-z+` but should\nideally be lowerCamelCase. Also, they must be limited to 64 characters in\nlength. When identifying the current value of an exceeded limit, the units\nshould be contained in the key, not the value.  For example, rather than\n`{"instanceLimit": "100/request"}`, should be returned as,\n`{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of\ninstances that can be created in a single (batch) request.',
                                    },
                                    domain: {
                                      type: "string",
                                      description:
                                        'The logical grouping to which the "reason" belongs. The error domain\nis typically the registered service name of the tool or product that\ngenerates the error. Example: "pubsub.googleapis.com". If the error is\ngenerated by some common infrastructure, the error domain must be a\nglobally unique value that identifies the infrastructure. For Google API\ninfrastructure, the error domain is "googleapis.com".',
                                    },
                                    reason: {
                                      type: "string",
                                      description:
                                        "The reason of the error. This is a constant value that identifies the\nproximate cause of the error. Error reasons are unique within a particular\ndomain of errors. This should be at most 63 characters and match a\nregular expression of `A-Z+[A-Z0-9]`, which represents\nUPPER_SNAKE_CASE.",
                                    },
                                  },
                                  description:
                                    'Describes the cause of the error with structured details.\n\nExample of an error when contacting the "pubsub.googleapis.com" API when it\nis not enabled:\n\n    { "reason": "API_DISABLED"\n      "domain": "googleapis.com"\n      "metadata": {\n        "resource": "projects/123",\n        "service": "pubsub.googleapis.com"\n      }\n    }\n\nThis response indicates that the pubsub.googleapis.com API is not enabled.\n\nExample of an error that is returned when attempting to create a Spanner\ninstance in a region that is out of stock:\n\n    { "reason": "STOCKOUT"\n      "domain": "spanner.googleapis.com",\n      "metadata": {\n        "availableRegions": "us-central1,us-east2"\n      }\n    }',
                                  additionalProperties: true,
                                },
                                quotaInfo: {
                                  type: "object",
                                  properties: {
                                    limit: {
                                      type: "number",
                                      description:
                                        "Current effective quota limit. The limit's unit depends on the quota type\nor metric. (Format: double)",
                                    },
                                    futureLimit: {
                                      type: "number",
                                      description:
                                        "Future quota limit being rolled out. The limit's unit depends on the quota\n type or metric. (Format: double)",
                                    },
                                    metricName: {
                                      type: "string",
                                      description:
                                        "The Compute Engine quota metric name.",
                                    },
                                    rolloutStatus: {
                                      type: "string",
                                      enum: [
                                        "IN_PROGRESS",
                                        "ROLLOUT_STATUS_UNSPECIFIED",
                                      ],
                                      description:
                                        "Rollout status of the future quota limit.",
                                    },
                                    limitName: {
                                      type: "string",
                                      description:
                                        "The name of the quota limit.",
                                    },
                                    dimensions: {
                                      type: "object",
                                      additionalProperties: {
                                        type: "string",
                                      },
                                      description:
                                        "The map holding related quota dimensions.",
                                    },
                                  },
                                  description:
                                    "Additional details for quota exceeded error for resource quota.",
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
                                          url: {
                                            type: "object",
                                            additionalProperties: true,
                                          },
                                          description: {
                                            type: "object",
                                            additionalProperties: true,
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
                                    "Provides links to documentation or for performing an out of band action.\n\nFor example, if a quota check failed with an error indicating the calling\nproject hasn't enabled the accessed service, this can contain a URL pointing\ndirectly to the right place in the developer console to flip the bit.",
                                  additionalProperties: true,
                                },
                              },
                              additionalProperties: true,
                            },
                            description:
                              "[Output Only] An optional list of messages that contain the error\ndetails. There is a set of defined message types to use for providing\ndetails.The syntax depends on the error code. For example,\nQuotaExceededInfo will have details when the error code is\nQUOTA_EXCEEDED.",
                          },
                          location: {
                            type: "string",
                            description:
                              "[Output Only] Indicates the field in the request that caused the error.\nThis property is optional.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] The array of errors encountered while processing this\noperation.",
                    },
                  },
                  description:
                    "[Output Only] If errors are generated during processing of the operation,\nthis field will be populated.",
                  additionalProperties: true,
                },
                endTime: {
                  type: "string",
                  description:
                    "[Output Only] The time that this operation was completed. This value is inRFC3339\ntext format.",
                },
                httpErrorStatusCode: {
                  type: "integer",
                  description:
                    "[Output Only] If the operation fails, this field contains the HTTP error\nstatus code that was returned. For example, a `404` means the\nresource was not found. (Format: int32)",
                },
                operationGroupId: {
                  type: "string",
                  description:
                    "[Output Only] An ID that represents a group of operations, such as when a\ngroup of operations results from a `bulkInsert` API request.",
                },
                description: {
                  type: "string",
                  description:
                    "[Output Only] A textual description of the operation, which is\nset when the operation is created.",
                },
                name: {
                  type: "string",
                  description: "[Output Only] Name of the operation.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                clientOperationId: {
                  type: "string",
                  description:
                    "[Output Only] The value of `requestId` if you provided it in the request.\nNot present otherwise.",
                },
                insertTime: {
                  type: "string",
                  description:
                    "[Output Only] The time that this operation was requested.\nThis value is inRFC3339\ntext format.",
                },
                status: {
                  type: "string",
                  enum: ["DONE", "PENDING", "RUNNING"],
                  description:
                    "[Output Only] The status of the operation, which can be one of the\nfollowing:\n`PENDING`, `RUNNING`, or `DONE`.",
                },
                progress: {
                  type: "integer",
                  description:
                    "[Output Only] An optional progress indicator that ranges from 0 to 100.\nThere is no requirement that this be linear or support any granularity of\noperations. This should not be used to guess when the operation will be\ncomplete. This number should monotonically increase as the operation\nprogresses. (Format: int32)",
                },
              },
              description:
                "Represents an Operation resource.\n\nGoogle Compute Engine has three Operation resources:\n\n* [Global](/compute/docs/reference/rest/v1/globalOperations)\n* [Regional](/compute/docs/reference/rest/v1/regionOperations)\n* [Zonal](/compute/docs/reference/rest/v1/zoneOperations)\n\nYou can use an operation resource to manage asynchronous API requests.\nFor more information, readHandling\nAPI responses.\n\nOperations can be global, regional or zonal.\n   \n   - For global operations, use the `globalOperations`\n   resource. \n   - For regional operations, use the\n   `regionOperations` resource. \n   - For zonal operations, use\n   the `zoneOperations` resource.\n\n\n\nFor more information, read\nGlobal, Regional, and Zonal Resources.\n\nNote that completed Operation resources have a limited \nretention period.",
              additionalProperties: true,
            },
            description: "[Output Only] A list of Operation resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger than\n`maxResults`, use the `nextPageToken` as a value for\nthe query parameter `pageToken` in the next list request.\nSubsequent list requests will have their own `nextPageToken` to\ncontinue paging through the results.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always `compute#operations` for Operations\nresource.",
          },
        },
        description: "Contains a list of Operation resources.",
        additionalProperties: true,
      },
    },
  },
};

export default zoneOperationsList;
