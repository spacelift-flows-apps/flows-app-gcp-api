import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Storage Pools - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
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
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        max_results: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        return_partial_success: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.max_results !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.max_results,
          );
        if (input.event.inputConfig.order_by !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.order_by);
        if (input.event.inputConfig.page_token !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.page_token);
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/storagePools",
          pathParams,
          queryParams,
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
          etag: {
            type: "string",
          },
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                capacity_provisioning_type: {
                  type: "string",
                  description:
                    "Provisioning type of the byte capacity of the pool. Check the CapacityProvisioningType enum for the list of possible values.",
                },
                creation_timestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you create the resource.",
                },
                exapool_provisioned_capacity_gb: {
                  type: "object",
                  properties: {
                    capacity_optimized: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    read_optimized: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    write_optimized: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description:
                    "Exapool provisioned capacities for each SKU type",
                  additionalProperties: true,
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Always compute#storagePool for storage pools.",
                },
                label_fingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this storage pool, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a storage pool.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this storage pool. These can be later modified by the setLabels method.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                params: {
                  type: "object",
                  properties: {
                    resource_manager_tags: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Input only. Resource manager tags to be bound to the storage pool. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
                    },
                  },
                  description: "Additional storage pool params.",
                  additionalProperties: true,
                },
                performance_provisioning_type: {
                  type: "string",
                  description:
                    "Provisioning type of the performance-related parameters of the pool, such as throughput and IOPS. Check the PerformanceProvisioningType enum for the list of possible values.",
                },
                pool_provisioned_capacity_gb: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                pool_provisioned_iops: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                pool_provisioned_throughput: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                resource_status: {
                  type: "object",
                  properties: {
                    disk_count: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_read_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_read_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_write_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_write_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    last_resize_timestamp: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Timestamp of the last successful resize inRFC3339 text format.",
                    },
                    max_total_provisioned_disk_capacity_gb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_capacity_bytes: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_user_written_bytes: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_capacity_gb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description: "[Output Only] Contains output only fields.",
                  additionalProperties: true,
                },
                self_link: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
                },
                self_link_with_id: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for this resource's resource id.",
                },
                state: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The status of storage pool creation.        - CREATING: Storage pool is provisioning.      storagePool.      - FAILED: Storage pool creation failed.      - READY: Storage pool is ready for use.      - DELETING: Storage pool is deleting. Check the State enum for the list of possible values.",
                },
                status: {
                  type: "object",
                  properties: {
                    disk_count: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_read_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_read_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_write_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    exapool_max_write_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    last_resize_timestamp: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Timestamp of the last successful resize inRFC3339 text format.",
                    },
                    max_total_provisioned_disk_capacity_gb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_capacity_bytes: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_used_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    pool_user_written_bytes: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_capacity_gb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    total_provisioned_disk_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                  },
                  description: "[Output Only] Contains output only fields.",
                  additionalProperties: true,
                },
                storage_pool_type: {
                  type: "string",
                  description: "Type of the storage pool.",
                },
                zone: {
                  type: "string",
                  description:
                    "Output only. [Output Only] URL of the zone where the storage pool resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
                },
              },
              description: "Represents a zonal storage pool resource.",
              additionalProperties: true,
            },
            description: "A list of StoragePool resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#storagePoolList for lists of storagePools.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          unreachables: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] Unreachable resources. end_interface: MixerListResponseWithEtagBuilder",
          },
          warning: {
            type: "object",
            properties: {
              code: {
                type: "string",
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "A list of StoragePool resources.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
