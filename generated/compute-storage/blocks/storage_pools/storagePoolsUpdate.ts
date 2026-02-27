import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const storagePoolsUpdate: AppBlock = {
  name: "Storage Pools - Update",
  description: `Updates the specified storagePool with the data included in the request.`,
  category: "Storage Pools",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "[Output Only] URL of the zone where the storage pool resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the zone where the storage pool resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        storagePool: {
          name: "Storage Pool",
          description: "The storagePool name for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "update_mask indicates fields to be updated as part of this request.",
          type: {
            type: "string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#storagePool\nfor storage pools.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description: "Name of the resource.",
          type: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`\nwhich means the first character must be a lowercase letter, and all\nfollowing characters must be a dash, lowercase letter, or digit, except\nthe last character, which cannot be a dash.",
          },
          required: false,
        },
        state: {
          name: "State",
          description: "[Output Only] The status of storage pool creation.",
          type: {
            type: "string",
            enum: ["CREATING", "DELETING", "FAILED", "READY"],
            description:
              "[Output Only] The status of storage pool creation.\n   \n   \n     - CREATING: Storage pool is provisioning.\n     storagePool.\n     - FAILED: Storage pool creation failed.\n     - READY: Storage pool is ready for use.\n     - DELETING: Storage pool is deleting.",
          },
          required: false,
        },
        storagePoolType: {
          name: "Storage Pool Type",
          description: "Type of the storage pool.",
          type: {
            type: "string",
            description: "Type of the storage pool.",
          },
          required: false,
        },
        poolProvisionedIops: {
          name: "Pool Provisioned Iops",
          description: "Provisioned IOPS of the storage pool.",
          type: {
            type: "string",
            description:
              "Provisioned IOPS of the storage pool. Only relevant if the storage pool\ntype is hyperdisk-balanced. (Format: int64)",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "An optional description of this resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          required: false,
        },
        performanceProvisioningType: {
          name: "Performance Provisioning Type",
          description:
            "Provisioning type of the performance-related parameters of the pool, such as throughput and IOPS.",
          type: {
            type: "string",
            enum: ["ADVANCED", "STANDARD", "UNSPECIFIED"],
            description:
              "Provisioning type of the performance-related parameters of the pool,\nsuch as throughput and IOPS.",
          },
          required: false,
        },
        poolProvisionedThroughput: {
          name: "Pool Provisioned Throughput",
          description: "Provisioned throughput of the storage pool in MiB/s.",
          type: {
            type: "string",
            description:
              "Provisioned throughput of the storage pool in MiB/s. Only relevant if the\nstorage pool type is hyperdisk-balanced or hyperdisk-throughput. (Format: int64)",
          },
          required: false,
        },
        capacityProvisioningType: {
          name: "Capacity Provisioning Type",
          description: "Provisioning type of the byte capacity of the pool.",
          type: {
            type: "string",
            enum: ["ADVANCED", "STANDARD", "UNSPECIFIED"],
            description: "Provisioning type of the byte capacity of the pool.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "[Output Only] Status information for the storage pool resource.",
          type: {
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
          required: false,
        },
        selfLinkWithId: {
          name: "Self Link With ID",
          description:
            "[Output Only] Server-defined URL for this resource's resource id.",
          type: {
            type: "string",
            description:
              "[Output Only] Server-defined URL for this resource's resource id.",
          },
          required: false,
        },
        resourceStatus: {
          name: "Resource Status",
          description:
            "[Output Only] Status information for the storage pool resource.",
          type: {
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
          required: false,
        },
        id: {
          name: "ID",
          description: "[Output Only] The unique identifier for the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "[Output Only] Server-defined fully-qualified URL for this resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Server-defined fully-qualified URL for this resource.",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "[Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this storage pool, which is essentially a hash of the labels set used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this storage pool, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a storage pool. (Format: byte)",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Labels to apply to this storage pool.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this storage pool. These can be later modified by\nthe setLabels method.",
          },
          required: false,
        },
        poolProvisionedCapacityGb: {
          name: "Pool Provisioned Capacity Gb",
          description: "Size of the storage pool in GiB.",
          type: {
            type: "string",
            description:
              "Size of the storage pool in GiB. For more information about the size\nlimits, see https://cloud.google.com/compute/docs/disks/storage-pools. (Format: int64)",
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
        let path = `projects/{project}/zones/{zone}/storagePools/{storagePool}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.state !== undefined)
          requestBody.state = input.event.inputConfig.state;
        if (input.event.inputConfig.storagePoolType !== undefined)
          requestBody.storagePoolType = input.event.inputConfig.storagePoolType;
        if (input.event.inputConfig.poolProvisionedIops !== undefined)
          requestBody.poolProvisionedIops =
            input.event.inputConfig.poolProvisionedIops;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.performanceProvisioningType !== undefined)
          requestBody.performanceProvisioningType =
            input.event.inputConfig.performanceProvisioningType;
        if (input.event.inputConfig.poolProvisionedThroughput !== undefined)
          requestBody.poolProvisionedThroughput =
            input.event.inputConfig.poolProvisionedThroughput;
        if (input.event.inputConfig.capacityProvisioningType !== undefined)
          requestBody.capacityProvisioningType =
            input.event.inputConfig.capacityProvisioningType;
        if (input.event.inputConfig.status !== undefined)
          requestBody.status = input.event.inputConfig.status;
        if (input.event.inputConfig.selfLinkWithId !== undefined)
          requestBody.selfLinkWithId = input.event.inputConfig.selfLinkWithId;
        if (input.event.inputConfig.resourceStatus !== undefined)
          requestBody.resourceStatus = input.event.inputConfig.resourceStatus;
        if (input.event.inputConfig.zone !== undefined)
          requestBody.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.poolProvisionedCapacityGb !== undefined)
          requestBody.poolProvisionedCapacityGb =
            input.event.inputConfig.poolProvisionedCapacityGb;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
                                description: "The name of the quota limit.",
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
                                      type: "string",
                                      description: "The URL of the link.",
                                    },
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
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
            description: "[Output Only] Server-defined URL for the resource.",
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
    },
  },
};

export default storagePoolsUpdate;
