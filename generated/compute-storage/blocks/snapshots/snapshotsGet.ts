import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const snapshotsGet: AppBlock = {
  name: "Snapshots - Get",
  description: `Returns the specified Zone resource.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        snapshot: {
          name: "Snapshot",
          description: "Name of the Snapshot resource to return.",
          type: {
            type: "string",
            description: "Name of the Snapshot resource to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.snapshot !== undefined)
          pathParams["snapshot"] = String(input.event.inputConfig.snapshot);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/snapshots/{snapshot}",
          pathParams,
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
          architecture: {
            type: "string",
            enum: [
              "UNDEFINED_ARCHITECTURE",
              "ARCHITECTURE_UNSPECIFIED",
              "ARM64",
              "X86_64",
            ],
            description:
              "Output only. [Output Only] The architecture of the snapshot. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          },
          autoCreated: {
            type: "boolean",
            description:
              "Output only. [Output Only] Set to true if snapshots are automatically created by applying resource policy on the target disk.",
          },
          chainName: {
            type: "string",
            description:
              "Creates the new snapshot in the snapshot chain labeled with the specified name. The chain name must be 1-63 characters long and comply with RFC1035. This is an uncommon option only for advanced service owners who needs to create separate snapshot chains, for example, for chargeback tracking. When you describe your snapshot resource, this field is visible only if it has a non-empty value.",
          },
          creationSizeBytes: {
            type: "string",
            description: "64-bit integer as string",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          diskSizeGb: {
            type: "string",
            description: "64-bit integer as string",
          },
          downloadBytes: {
            type: "string",
            description: "64-bit integer as string",
          },
          enableConfidentialCompute: {
            type: "boolean",
            description:
              "Output only. Whether this snapshot is created from a confidential compute mode disk. [Output Only]: This field is not set by user, but from source disk.",
          },
          guestOsFeatures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "UNDEFINED_TYPE",
                    "BARE_METAL_LINUX_COMPATIBLE",
                    "FEATURE_TYPE_UNSPECIFIED",
                    "GVNIC",
                    "IDPF",
                    "MULTI_IP_SUBNET",
                    "SECURE_BOOT",
                    "SEV_CAPABLE",
                    "SEV_LIVE_MIGRATABLE",
                    "SEV_LIVE_MIGRATABLE_V2",
                    "SEV_SNP_CAPABLE",
                    "SNP_SVSM_CAPABLE",
                    "TDX_CAPABLE",
                    "UEFI_COMPATIBLE",
                    "VIRTIO_SCSI_MULTIQUEUE",
                    "WINDOWS",
                  ],
                  description:
                    "The ID of a supported feature. To add multiple values, use commas to separate values. Set to one or more of the following values:     - VIRTIO_SCSI_MULTIQUEUE    - WINDOWS    - MULTI_IP_SUBNET    - UEFI_COMPATIBLE    - GVNIC    - SEV_CAPABLE    - SUSPEND_RESUME_COMPATIBLE    - SEV_LIVE_MIGRATABLE_V2    - SEV_SNP_CAPABLE    - TDX_CAPABLE    - IDPF    - SNP_SVSM_CAPABLE   For more information, see Enabling guest operating system features. Check the Type enum for the list of possible values.",
                },
              },
              description: "Guest OS features.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#snapshot for Snapshot resources.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this snapshot, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a snapshot.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this snapshot. These can be later modified by the setLabels method. Label values may be empty.",
          },
          licenseCodes: {
            type: "array",
            items: {
              type: "string",
              description: "64-bit integer as string",
            },
            description:
              "Output only. [Output Only] Integer license codes indicating which licenses are attached to this snapshot.",
          },
          licenses: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of public visible licenses that apply to this snapshot. This can be because the original image had licenses attached (such as a Windows image).",
          },
          locationHint: {
            type: "string",
            description:
              "An opaque location hint used to place the snapshot close to other resources. This field is for use by internal tools that use the public API.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          satisfiesPzi: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          satisfiesPzs: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          snapshotEncryptionKey: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
              },
            },
            additionalProperties: true,
            description:
              "Encrypts the snapshot using acustomer-supplied encryption key.  After you encrypt a snapshot using a customer-supplied key, you must provide the same key if you use the snapshot later. For example, you must provide the encryption key when you create a disk from the encrypted snapshot in a future request.  Customer-supplied encryption keys do not protect access to metadata of the snapshot.  If you do not provide an encryption key when creating the snapshot, then the snapshot will be encrypted using an automatically generated key and you do not need to provide a key to use the snapshot later.",
          },
          snapshotType: {
            type: "string",
            enum: ["UNDEFINED_SNAPSHOT_TYPE", "ARCHIVE", "STANDARD"],
            description:
              "Indicates the type of the snapshot. Check the SnapshotType enum for the list of possible values.",
          },
          sourceDisk: {
            type: "string",
            description: "The source disk used to create this snapshot.",
          },
          sourceDiskEncryptionKey: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
              },
            },
            additionalProperties: true,
            description:
              "The customer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.",
          },
          sourceDiskForRecoveryCheckpoint: {
            type: "string",
            description:
              "The source disk whose recovery checkpoint will be used to create this snapshot.",
          },
          sourceDiskId: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the disk used to create this snapshot. This value may be used to determine whether the snapshot was taken from the current or a previous instance of a given disk name.",
          },
          sourceInstantSnapshot: {
            type: "string",
            description:
              "The source instant snapshot used to create this snapshot. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot      - projects/project/zones/zone/instantSnapshots/instantSnapshot    - zones/zone/instantSnapshots/instantSnapshot",
          },
          sourceInstantSnapshotEncryptionKey: {
            type: "object",
            properties: {
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit customer-supplied encryption key to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rsaEncryptedKey": "ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH z0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD D6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="  The key must meet the following requirements before you can provide it to Compute Engine:     1. The key is wrapped using a RSA public key certificate provided by    Google.    2. After being wrapped, the key must be encoded in RFC 4648 base64    encoding.  Gets the RSA public key certificate provided by Google at:   https://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC 4648 base64 encoded SHA-256 hash of the customer-supplied encryption key that protects this resource.",
              },
            },
            additionalProperties: true,
            description:
              "Customer provided encryption key when creating Snapshot from Instant Snapshot.",
          },
          sourceInstantSnapshotId: {
            type: "string",
            description:
              "Output only. [Output Only] The unique ID of the instant snapshot used to create this snapshot. This value identifies the exact instant snapshot that was used to create this snapshot. For example, if you created the snapshot from an instant snapshot that was later deleted and recreated under the same name, the source instant snapshot ID would identify the exact instant snapshot that was used.",
          },
          sourceSnapshotSchedulePolicy: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the resource policy which created this scheduled snapshot.",
          },
          sourceSnapshotSchedulePolicyId: {
            type: "string",
            description:
              "Output only. [Output Only] ID of the resource policy which created this scheduled snapshot.",
          },
          status: {
            type: "string",
            enum: [
              "UNDEFINED_STATUS",
              "CREATING",
              "DELETING",
              "FAILED",
              "READY",
              "UPLOADING",
            ],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          storageBytes: {
            type: "string",
            description: "64-bit integer as string",
          },
          storageBytesStatus: {
            type: "string",
            enum: ["UNDEFINED_STORAGE_BYTES_STATUS", "UPDATING", "UP_TO_DATE"],
            description:
              "Output only. [Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation. This status can either be UPDATING, meaning the size of the snapshot is being updated, or UP_TO_DATE, meaning the size of the snapshot is up-to-date. Check the StorageBytesStatus enum for the list of possible values.",
          },
          storageLocations: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Cloud Storage bucket storage location of the snapshot (regional or multi-regional).",
          },
        },
        description:
          "Represents a Persistent Disk Snapshot resource.  You can use snapshots to back up data on a regular interval. For more information, read  Creating persistent disk snapshots.",
        additionalProperties: true,
      },
    },
  },
};

export default snapshotsGet;
