import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const snapshotsInsert: AppBlock = {
  name: "Snapshots - Insert",
  description: `Creates a snapshot in the specified project using the data included in the request.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
        requestId: {
          name: "Request ID",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so\nthat if you must retry your request, the server will know to ignore the\nrequest if it has already been completed.\n\nFor example, consider a situation where you make an initial request and\nthe request times out. If you make the request again with the same\nrequest ID, the server can check if original operation with the same\nrequest ID was received, and if so, will ignore the second request. This\nprevents clients from accidentally creating duplicate commitments.\n\nThe request ID must be\na valid UUID with the exception that zero UUID is not supported\n(00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Labels to apply to this snapshot.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this snapshot. These can be later modified by\nthe setLabels method.\nLabel values may be empty.",
          },
          required: false,
        },
        diskSizeGb: {
          name: "Disk Size Gb",
          description:
            "[Output Only] Size of the source disk, specified in GB.",
          type: {
            type: "string",
            description:
              "[Output Only] Size of the source disk, specified in GB. (Format: int64)",
          },
          required: false,
        },
        architecture: {
          name: "Architecture",
          description: "[Output Only] The architecture of the snapshot.",
          type: {
            type: "string",
            enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
            description:
              "[Output Only] The architecture of the snapshot. Valid values are\nARM64 or X86_64.",
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
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for the resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          required: false,
        },
        autoCreated: {
          name: "Auto Created",
          description:
            "[Output Only] Set to true if snapshots are automatically created by applying resource policy on the target disk.",
          type: {
            type: "boolean",
            description:
              "[Output Only] Set to true if snapshots are automatically created by\napplying resource policy on the target disk.",
          },
          required: false,
        },
        snapshotEncryptionKey: {
          name: "Snapshot Encryption Key",
          description:
            "Encrypts the snapshot using acustomer-supplied encryption key.",
          type: {
            type: "object",
            properties: {
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit\ncustomer-supplied encryption key to either encrypt or decrypt this\nresource. You can provide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rsaEncryptedKey":\n"ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH\nz0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD\nD6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="\n\nThe key must meet the following requirements before you can provide it to \nCompute Engine: \n   \n   1. The key is wrapped using a RSA public key certificate provided by \n   Google. \n   2. After being wrapped, the key must be encoded in RFC 4648 base64 \n   encoding. \n\nGets the RSA public key certificate provided by Google at: \n\n\nhttps://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied\nencryption key, encoded in RFC\n4648 base64 to either encrypt or decrypt this resource. You can\nprovide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rawKey":\n"SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS\nkey. If absent, the Compute Engine default service account is used.\nFor example:\n\n"kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC\n4648 base64 encoded SHA-256 hash of the customer-supplied\nencryption key that protects this resource.",
              },
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS.\nFor example:\n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n\nThe fully-qualifed key name may be returned for resource GET requests. For \nexample: \n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n/cryptoKeyVersions/1',
              },
            },
            additionalProperties: true,
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
        sourceInstantSnapshotId: {
          name: "Source Instant Snapshot ID",
          description:
            "[Output Only] The unique ID of the instant snapshot used to create this snapshot.",
          type: {
            type: "string",
            description:
              "[Output Only] The unique ID of the instant snapshot used to create this\nsnapshot. This value identifies the exact instant snapshot that was used to\ncreate this snapshot. For example, if you created the snapshot from an\ninstant snapshot that was later deleted and recreated under the same name,\nthe source instant snapshot ID would identify the exact instant snapshot\nthat was used.",
          },
          required: false,
        },
        creationSizeBytes: {
          name: "Creation Size Bytes",
          description:
            "[Output Only] Size in bytes of the snapshot at creation time.",
          type: {
            type: "string",
            description:
              "[Output Only] Size in bytes of the snapshot at creation time. (Format: int64)",
          },
          required: false,
        },
        licenseCodes: {
          name: "License Codes",
          description:
            "[Output Only] Integer license codes indicating which licenses are attached to this snapshot.",
          type: {
            type: "array",
            items: {
              type: "string",
              description: "Format: int64",
            },
            description:
              "[Output Only] Integer license codes indicating which licenses are attached\nto this snapshot.",
          },
          required: false,
        },
        sourceDiskEncryptionKey: {
          name: "Source Disk Encryption Key",
          description:
            "The customer-supplied encryption key of the source disk.",
          type: {
            type: "object",
            properties: {
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit\ncustomer-supplied encryption key to either encrypt or decrypt this\nresource. You can provide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rsaEncryptedKey":\n"ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH\nz0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD\nD6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="\n\nThe key must meet the following requirements before you can provide it to \nCompute Engine: \n   \n   1. The key is wrapped using a RSA public key certificate provided by \n   Google. \n   2. After being wrapped, the key must be encoded in RFC 4648 base64 \n   encoding. \n\nGets the RSA public key certificate provided by Google at: \n\n\nhttps://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied\nencryption key, encoded in RFC\n4648 base64 to either encrypt or decrypt this resource. You can\nprovide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rawKey":\n"SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS\nkey. If absent, the Compute Engine default service account is used.\nFor example:\n\n"kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC\n4648 base64 encoded SHA-256 hash of the customer-supplied\nencryption key that protects this resource.",
              },
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS.\nFor example:\n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n\nThe fully-qualifed key name may be returned for resource GET requests. For \nexample: \n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n/cryptoKeyVersions/1',
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        sourceSnapshotSchedulePolicyId: {
          name: "Source Snapshot Schedule Policy ID",
          description:
            "[Output Only] ID of the resource policy which created this scheduled snapshot.",
          type: {
            type: "string",
            description:
              "[Output Only] ID of the resource policy which created this\nscheduled snapshot.",
          },
          required: false,
        },
        sourceDiskId: {
          name: "Source Disk ID",
          description:
            "[Output Only] The ID value of the disk used to create this snapshot.",
          type: {
            type: "string",
            description:
              "[Output Only] The ID value of the disk used to create this snapshot. This\nvalue may be used to determine whether the snapshot was taken from the\ncurrent or a previous instance of a given disk name.",
          },
          required: false,
        },
        guestFlush: {
          name: "Guest Flush",
          description:
            "[Input Only] Whether to attempt an application consistent snapshot by informing the OS to prepare for the snapshot process.",
          type: {
            type: "boolean",
            description:
              "[Input Only] Whether to attempt an application consistent snapshot by\ninforming the OS to prepare for the snapshot process.",
          },
          required: false,
        },
        downloadBytes: {
          name: "Download Bytes",
          description:
            "[Output Only] Number of bytes downloaded to restore a snapshot to a disk.",
          type: {
            type: "string",
            description:
              "[Output Only] Number of bytes downloaded to restore a snapshot to a disk. (Format: int64)",
          },
          required: false,
        },
        sourceInstantSnapshot: {
          name: "Source Instant Snapshot",
          description:
            "The source instant snapshot used to create this snapshot.",
          type: {
            type: "string",
            description:
              "The source instant snapshot used to create this snapshot. You can provide\nthis as a partial or full URL to the resource. For example, the following\nare valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot\n     - projects/project/zones/zone/instantSnapshots/instantSnapshot \n   - zones/zone/instantSnapshots/instantSnapshot",
          },
          required: false,
        },
        status: {
          name: "Status",
          description: "[Output Only] The status of the snapshot.",
          type: {
            type: "string",
            enum: ["CREATING", "DELETING", "FAILED", "READY", "UPLOADING"],
            description:
              "[Output Only] The status of the snapshot. This can beCREATING, DELETING, FAILED,READY, or UPLOADING.",
          },
          required: false,
        },
        locationHint: {
          name: "Location Hint",
          description:
            "An opaque location hint used to place the snapshot close to other resources.",
          type: {
            type: "string",
            description:
              "An opaque location hint used to place the snapshot close to other\nresources.\nThis field is for use by internal tools that use the public API.",
          },
          required: false,
        },
        chainName: {
          name: "Chain Name",
          description:
            "Creates the new snapshot in the snapshot chain labeled with the specified name.",
          type: {
            type: "string",
            description:
              "Creates the new snapshot in the snapshot chain labeled with the\nspecified name. The chain name must be 1-63 characters long and comply\nwith RFC1035. This is an uncommon option only for advanced service\nowners who needs to create separate snapshot chains, for example,\nfor chargeback tracking. When you describe your snapshot resource, this\nfield is visible only if it has a non-empty value.",
          },
          required: false,
        },
        sourceSnapshotSchedulePolicy: {
          name: "Source Snapshot Schedule Policy",
          description:
            "[Output Only] URL of the resource policy which created this scheduled snapshot.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the resource policy which created this\nscheduled snapshot.",
          },
          required: false,
        },
        licenses: {
          name: "Licenses",
          description:
            "[Output Only] A list of public visible licenses that apply to this snapshot.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] A list of public visible licenses that apply to this\nsnapshot. This can be because the original image had licenses attached\n(such as a Windows image).",
          },
          required: false,
        },
        storageBytesStatus: {
          name: "Storage Bytes Status",
          description:
            "[Output Only] An indicator whether storageBytes is in a stable state or it is being adjusted as a result of shared storage reallocation.",
          type: {
            type: "string",
            enum: ["UPDATING", "UP_TO_DATE"],
            description:
              "[Output Only] An indicator whether storageBytes is in a\nstable state or it is being adjusted as a result of shared storage\nreallocation. This status can either be UPDATING, meaning\nthe size of the snapshot is being updated, or UP_TO_DATE,\nmeaning the size of the snapshot is up-to-date.",
          },
          required: false,
        },
        sourceInstantSnapshotEncryptionKey: {
          name: "Source Instant Snapshot Encryption Key",
          description:
            "Customer provided encryption key when creating Snapshot from Instant Snapshot.",
          type: {
            type: "object",
            properties: {
              rsaEncryptedKey: {
                type: "string",
                description:
                  'Specifies an RFC 4648 base64 encoded, RSA-wrapped 2048-bit\ncustomer-supplied encryption key to either encrypt or decrypt this\nresource. You can provide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rsaEncryptedKey":\n"ieCx/NcW06PcT7Ep1X6LUTc/hLvUDYyzSZPPVCVPTVEohpeHASqC8uw5TzyO9U+Fka9JFH\nz0mBibXUInrC/jEk014kCK/NPjYgEMOyssZ4ZINPKxlUh2zn1bV+MCaTICrdmuSBTWlUUiFoD\nD6PYznLwh8ZNdaheCeZ8ewEXgFQ8V+sDroLaN3Xs3MDTXQEMMoNUXMCZEIpg9Vtp9x2oe=="\n\nThe key must meet the following requirements before you can provide it to \nCompute Engine: \n   \n   1. The key is wrapped using a RSA public key certificate provided by \n   Google. \n   2. After being wrapped, the key must be encoded in RFC 4648 base64 \n   encoding. \n\nGets the RSA public key certificate provided by Google at: \n\n\nhttps://cloud-certs.storage.googleapis.com/google-cloud-csek-ingress.pem',
              },
              rawKey: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied\nencryption key, encoded in RFC\n4648 base64 to either encrypt or decrypt this resource. You can\nprovide either the rawKey or thersaEncryptedKey.\nFor example:\n\n"rawKey":\n"SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              kmsKeyServiceAccount: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS\nkey. If absent, the Compute Engine default service account is used.\nFor example:\n\n"kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              sha256: {
                type: "string",
                description:
                  "[Output only] TheRFC\n4648 base64 encoded SHA-256 hash of the customer-supplied\nencryption key that protects this resource.",
              },
              kmsKeyName: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS.\nFor example:\n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n\nThe fully-qualifed key name may be returned for resource GET requests. For \nexample: \n\n"kmsKeyName": "projects/kms_project_id/locations/region/keyRings/\nkey_region/cryptoKeys/key\n/cryptoKeyVersions/1',
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        storageBytes: {
          name: "Storage Bytes",
          description:
            "[Output Only] A size of the storage used by the snapshot.",
          type: {
            type: "string",
            description:
              "[Output Only] A size of the storage used by the snapshot. As snapshots\nshare storage, this number is expected to change with snapshot\ncreation/deletion. (Format: int64)",
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
        snapshotType: {
          name: "Snapshot Type",
          description: "Indicates the type of the snapshot.",
          type: {
            type: "string",
            enum: ["ARCHIVE", "STANDARD"],
            description: "Indicates the type of the snapshot.",
          },
          required: false,
        },
        sourceDiskForRecoveryCheckpoint: {
          name: "Source Disk For Recovery Checkpoint",
          description:
            "The source disk whose recovery checkpoint will be used to create this snapshot.",
          type: {
            type: "string",
            description:
              "The source disk whose recovery checkpoint will be used to create this\nsnapshot.",
          },
          required: false,
        },
        satisfiesPzs: {
          name: "Satisfies Pzs",
          description: "[Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "[Output Only] Reserved for future use.",
          },
          required: false,
        },
        storageLocations: {
          name: "Storage Locations",
          description:
            "Cloud Storage bucket storage location of the snapshot (regional or multi-regional).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Cloud Storage bucket storage location of the snapshot (regional or\nmulti-regional).",
          },
          required: false,
        },
        sourceDisk: {
          name: "Source Disk",
          description: "The source disk used to create this snapshot.",
          type: {
            type: "string",
            description: "The source disk used to create this snapshot.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#snapshot\nfor Snapshot resources.",
          },
          required: false,
        },
        guestOsFeatures: {
          name: "Guest Os Features",
          description:
            "[Output Only] A list of features to enable on the guest operating system.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
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
                    "The ID of a supported feature. To add multiple values, use commas to\nseparate values. Set to one or more of the following values:\n   \n   - VIRTIO_SCSI_MULTIQUEUE\n   - WINDOWS\n   - MULTI_IP_SUBNET\n   - UEFI_COMPATIBLE\n   - GVNIC\n   - SEV_CAPABLE\n   - SUSPEND_RESUME_COMPATIBLE\n   - SEV_LIVE_MIGRATABLE_V2\n   - SEV_SNP_CAPABLE\n   - TDX_CAPABLE\n   - IDPF\n   - SNP_SVSM_CAPABLE\n\n\nFor more information, see\nEnabling guest operating system features.",
                },
              },
              description: "Guest OS features.",
              additionalProperties: true,
            },
            description:
              "[Output Only] A list of features to enable on the guest operating system.\nApplicable only for bootable images. Read \nEnabling guest operating system features to see a list of available\noptions.",
          },
          required: false,
        },
        enableConfidentialCompute: {
          name: "Enable Confidential Compute",
          description:
            "Whether this snapshot is created from a confidential compute mode disk.",
          type: {
            type: "boolean",
            description:
              "Whether this snapshot is created from a confidential compute mode disk.\n[Output Only]: This field is not set by user, but from source disk.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this snapshot, which is essentially a hash of the labels set used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this snapshot, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a snapshot. (Format: byte)",
          },
          required: false,
        },
        params: {
          name: "Params",
          description: "Input only.",
          type: {
            type: "object",
            properties: {
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the snapshot. Tag keys and values have\nthe same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
              },
            },
            description: "Additional snapshot params.",
            additionalProperties: true,
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
        let path = `projects/{project}/global/snapshots`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.diskSizeGb !== undefined)
          requestBody.diskSizeGb = input.event.inputConfig.diskSizeGb;
        if (input.event.inputConfig.architecture !== undefined)
          requestBody.architecture = input.event.inputConfig.architecture;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.autoCreated !== undefined)
          requestBody.autoCreated = input.event.inputConfig.autoCreated;
        if (input.event.inputConfig.snapshotEncryptionKey !== undefined)
          requestBody.snapshotEncryptionKey =
            input.event.inputConfig.snapshotEncryptionKey;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.sourceInstantSnapshotId !== undefined)
          requestBody.sourceInstantSnapshotId =
            input.event.inputConfig.sourceInstantSnapshotId;
        if (input.event.inputConfig.creationSizeBytes !== undefined)
          requestBody.creationSizeBytes =
            input.event.inputConfig.creationSizeBytes;
        if (input.event.inputConfig.licenseCodes !== undefined)
          requestBody.licenseCodes = input.event.inputConfig.licenseCodes;
        if (input.event.inputConfig.sourceDiskEncryptionKey !== undefined)
          requestBody.sourceDiskEncryptionKey =
            input.event.inputConfig.sourceDiskEncryptionKey;
        if (
          input.event.inputConfig.sourceSnapshotSchedulePolicyId !== undefined
        )
          requestBody.sourceSnapshotSchedulePolicyId =
            input.event.inputConfig.sourceSnapshotSchedulePolicyId;
        if (input.event.inputConfig.sourceDiskId !== undefined)
          requestBody.sourceDiskId = input.event.inputConfig.sourceDiskId;
        if (input.event.inputConfig.guestFlush !== undefined)
          requestBody.guestFlush = input.event.inputConfig.guestFlush;
        if (input.event.inputConfig.downloadBytes !== undefined)
          requestBody.downloadBytes = input.event.inputConfig.downloadBytes;
        if (input.event.inputConfig.sourceInstantSnapshot !== undefined)
          requestBody.sourceInstantSnapshot =
            input.event.inputConfig.sourceInstantSnapshot;
        if (input.event.inputConfig.status !== undefined)
          requestBody.status = input.event.inputConfig.status;
        if (input.event.inputConfig.locationHint !== undefined)
          requestBody.locationHint = input.event.inputConfig.locationHint;
        if (input.event.inputConfig.chainName !== undefined)
          requestBody.chainName = input.event.inputConfig.chainName;
        if (input.event.inputConfig.sourceSnapshotSchedulePolicy !== undefined)
          requestBody.sourceSnapshotSchedulePolicy =
            input.event.inputConfig.sourceSnapshotSchedulePolicy;
        if (input.event.inputConfig.licenses !== undefined)
          requestBody.licenses = input.event.inputConfig.licenses;
        if (input.event.inputConfig.storageBytesStatus !== undefined)
          requestBody.storageBytesStatus =
            input.event.inputConfig.storageBytesStatus;
        if (
          input.event.inputConfig.sourceInstantSnapshotEncryptionKey !==
          undefined
        )
          requestBody.sourceInstantSnapshotEncryptionKey =
            input.event.inputConfig.sourceInstantSnapshotEncryptionKey;
        if (input.event.inputConfig.storageBytes !== undefined)
          requestBody.storageBytes = input.event.inputConfig.storageBytes;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.snapshotType !== undefined)
          requestBody.snapshotType = input.event.inputConfig.snapshotType;
        if (
          input.event.inputConfig.sourceDiskForRecoveryCheckpoint !== undefined
        )
          requestBody.sourceDiskForRecoveryCheckpoint =
            input.event.inputConfig.sourceDiskForRecoveryCheckpoint;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.storageLocations !== undefined)
          requestBody.storageLocations =
            input.event.inputConfig.storageLocations;
        if (input.event.inputConfig.sourceDisk !== undefined)
          requestBody.sourceDisk = input.event.inputConfig.sourceDisk;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.guestOsFeatures !== undefined)
          requestBody.guestOsFeatures = input.event.inputConfig.guestOsFeatures;
        if (input.event.inputConfig.enableConfidentialCompute !== undefined)
          requestBody.enableConfidentialCompute =
            input.event.inputConfig.enableConfidentialCompute;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;

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

export default snapshotsInsert;
