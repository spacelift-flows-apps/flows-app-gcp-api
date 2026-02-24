import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const storagePoolsList: AppBlock = {
  name: "Storage Pools - List",
  description: `Retrieves a list of storage pools contained within the specified zone.`,
  category: "Storage Pools",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
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
        let path = `projects/{project}/zones/{zone}/storagePools`;

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
          kind: {
            type: "string",
            description:
              "[Output Only] Type of resource. Always compute#storagePoolList\nfor lists of storagePools.",
          },
          etag: {
            type: "string",
          },
          unreachables: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] Unreachable resources.\nend_interface: MixerListResponseWithEtagBuilder",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          warning: {
            type: "object",
            properties: {
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
            },
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#storagePool\nfor storage pools.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`\nwhich means the first character must be a lowercase letter, and all\nfollowing characters must be a dash, lowercase letter, or digit, except\nthe last character, which cannot be a dash.",
                },
                state: {
                  type: "string",
                  enum: ["CREATING", "DELETING", "FAILED", "READY"],
                  description:
                    "[Output Only] The status of storage pool creation.\n   \n   \n     - CREATING: Storage pool is provisioning.\n     storagePool.\n     - FAILED: Storage pool creation failed.\n     - READY: Storage pool is ready for use.\n     - DELETING: Storage pool is deleting.",
                },
                storagePoolType: {
                  type: "string",
                  description: "Type of the storage pool.",
                },
                poolProvisionedIops: {
                  type: "string",
                  description:
                    "Provisioned IOPS of the storage pool. Only relevant if the storage pool\ntype is hyperdisk-balanced. (Format: int64)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                performanceProvisioningType: {
                  type: "string",
                  enum: ["ADVANCED", "STANDARD", "UNSPECIFIED"],
                  description:
                    "Provisioning type of the performance-related parameters of the pool,\nsuch as throughput and IOPS.",
                },
                poolProvisionedThroughput: {
                  type: "string",
                  description:
                    "Provisioned throughput of the storage pool in MiB/s. Only relevant if the\nstorage pool type is hyperdisk-balanced or hyperdisk-throughput. (Format: int64)",
                },
                capacityProvisioningType: {
                  type: "string",
                  enum: ["ADVANCED", "STANDARD", "UNSPECIFIED"],
                  description:
                    "Provisioning type of the byte capacity of the pool.",
                },
                status: {
                  type: "object",
                  properties: {
                    poolUsedIops: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned IOPS, minus some amount\nthat is allowed per disk that is not counted towards pool's IOPS\ncapacity. For more information, see\nhttps://cloud.google.com/compute/docs/disks/storage-pools. (Format: int64)",
                    },
                    diskCount: {
                      type: "string",
                      description:
                        "[Output Only] Number of disks used. (Format: int64)",
                    },
                    poolUsedThroughput: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned throughput in MiB/s. (Format: int64)",
                    },
                    poolUserWrittenBytes: {
                      type: "string",
                      description:
                        "[Output Only] Amount of data written into the pool, before it is\ncompacted. (Format: int64)",
                    },
                    poolUsedCapacityBytes: {
                      type: "string",
                      description:
                        "[Output Only] Space used by data stored in disks within the storage pool\n(in bytes). This will reflect the total number of bytes written to the\ndisks in the pool, in contrast to the capacity of those disks. (Format: int64)",
                    },
                    totalProvisionedDiskIops: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned IOPS. (Format: int64)",
                    },
                    lastResizeTimestamp: {
                      type: "string",
                      description:
                        "[Output Only] Timestamp of the last successful resize inRFC3339 text format.",
                    },
                    totalProvisionedDiskThroughput: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned throughput in MiB/s,\nminus some amount that is allowed per disk that is not counted towards\npool's throughput capacity. (Format: int64)",
                    },
                    totalProvisionedDiskCapacityGb: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned capacity (in GiB) in\nthis storage pool. A disk's provisioned capacity is the same as its total\ncapacity. (Format: int64)",
                    },
                    maxTotalProvisionedDiskCapacityGb: {
                      type: "string",
                      description:
                        "[Output Only] Maximum allowed aggregate disk size in GiB. (Format: int64)",
                    },
                  },
                  description: "[Output Only] Contains output only fields.",
                  additionalProperties: true,
                },
                selfLinkWithId: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for this resource's resource id.",
                },
                resourceStatus: {
                  type: "object",
                  properties: {
                    poolUsedIops: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned IOPS, minus some amount\nthat is allowed per disk that is not counted towards pool's IOPS\ncapacity. For more information, see\nhttps://cloud.google.com/compute/docs/disks/storage-pools. (Format: int64)",
                    },
                    diskCount: {
                      type: "string",
                      description:
                        "[Output Only] Number of disks used. (Format: int64)",
                    },
                    poolUsedThroughput: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned throughput in MiB/s. (Format: int64)",
                    },
                    poolUserWrittenBytes: {
                      type: "string",
                      description:
                        "[Output Only] Amount of data written into the pool, before it is\ncompacted. (Format: int64)",
                    },
                    poolUsedCapacityBytes: {
                      type: "string",
                      description:
                        "[Output Only] Space used by data stored in disks within the storage pool\n(in bytes). This will reflect the total number of bytes written to the\ndisks in the pool, in contrast to the capacity of those disks. (Format: int64)",
                    },
                    totalProvisionedDiskIops: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned IOPS. (Format: int64)",
                    },
                    lastResizeTimestamp: {
                      type: "string",
                      description:
                        "[Output Only] Timestamp of the last successful resize inRFC3339 text format.",
                    },
                    totalProvisionedDiskThroughput: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned throughput in MiB/s,\nminus some amount that is allowed per disk that is not counted towards\npool's throughput capacity. (Format: int64)",
                    },
                    totalProvisionedDiskCapacityGb: {
                      type: "string",
                      description:
                        "[Output Only] Sum of all the disks' provisioned capacity (in GiB) in\nthis storage pool. A disk's provisioned capacity is the same as its total\ncapacity. (Format: int64)",
                    },
                    maxTotalProvisionedDiskCapacityGb: {
                      type: "string",
                      description:
                        "[Output Only] Maximum allowed aggregate disk size in GiB. (Format: int64)",
                    },
                  },
                  description: "[Output Only] Contains output only fields.",
                  additionalProperties: true,
                },
                zone: {
                  type: "string",
                  description:
                    "[Output Only] URL of the zone where the storage pool resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined fully-qualified URL for this resource.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this storage pool, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a storage pool. (Format: byte)",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this storage pool. These can be later modified by\nthe setLabels method.",
                },
                poolProvisionedCapacityGb: {
                  type: "string",
                  description:
                    "Size of the storage pool in GiB. For more information about the size\nlimits, see https://cloud.google.com/compute/docs/disks/storage-pools. (Format: int64)",
                },
              },
              description: "Represents a zonal storage pool resource.",
              additionalProperties: true,
            },
            description: "A list of StoragePool resources.",
          },
        },
        description: "A list of StoragePool resources.",
        additionalProperties: true,
      },
    },
  },
};

export default storagePoolsList;
