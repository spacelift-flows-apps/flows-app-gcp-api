import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const storagePoolsGet: AppBlock = {
  name: "Storage Pools - Get",
  description: `Returns a specified storage pool.`,
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
        storagePool: {
          name: "Storage Pool",
          description: "Name of the storage pool to return.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `projects/{project}/zones/{zone}/storagePools/{storagePool}`;

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
            description: "Provisioning type of the byte capacity of the pool.",
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
    },
  },
};

export default storagePoolsGet;
