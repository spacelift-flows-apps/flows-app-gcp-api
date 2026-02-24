import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const snapshotsList: AppBlock = {
  name: "Snapshots - List",
  description: `Retrieves the list of Snapshot resources contained within the specified project.`,
  category: "Snapshots",
  inputs: {
    default: {
      config: {
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
        let path = `projects/{project}/global/snapshots`;

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
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this snapshot. These can be later modified by\nthe setLabels method.\nLabel values may be empty.",
                },
                diskSizeGb: {
                  type: "string",
                  description:
                    "[Output Only] Size of the source disk, specified in GB. (Format: int64)",
                },
                architecture: {
                  type: "string",
                  enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
                  description:
                    "[Output Only] The architecture of the snapshot. Valid values are\nARM64 or X86_64.",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                autoCreated: {
                  type: "boolean",
                  description:
                    "[Output Only] Set to true if snapshots are automatically created by\napplying resource policy on the target disk.",
                },
                snapshotEncryptionKey: {
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
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                sourceInstantSnapshotId: {
                  type: "string",
                  description:
                    "[Output Only] The unique ID of the instant snapshot used to create this\nsnapshot. This value identifies the exact instant snapshot that was used to\ncreate this snapshot. For example, if you created the snapshot from an\ninstant snapshot that was later deleted and recreated under the same name,\nthe source instant snapshot ID would identify the exact instant snapshot\nthat was used.",
                },
                creationSizeBytes: {
                  type: "string",
                  description:
                    "[Output Only] Size in bytes of the snapshot at creation time. (Format: int64)",
                },
                licenseCodes: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "Format: int64",
                  },
                  description:
                    "[Output Only] Integer license codes indicating which licenses are attached\nto this snapshot.",
                },
                sourceDiskEncryptionKey: {
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
                sourceSnapshotSchedulePolicyId: {
                  type: "string",
                  description:
                    "[Output Only] ID of the resource policy which created this\nscheduled snapshot.",
                },
                sourceDiskId: {
                  type: "string",
                  description:
                    "[Output Only] The ID value of the disk used to create this snapshot. This\nvalue may be used to determine whether the snapshot was taken from the\ncurrent or a previous instance of a given disk name.",
                },
                guestFlush: {
                  type: "boolean",
                  description:
                    "[Input Only] Whether to attempt an application consistent snapshot by\ninforming the OS to prepare for the snapshot process.",
                },
                downloadBytes: {
                  type: "string",
                  description:
                    "[Output Only] Number of bytes downloaded to restore a snapshot to a disk. (Format: int64)",
                },
                sourceInstantSnapshot: {
                  type: "string",
                  description:
                    "The source instant snapshot used to create this snapshot. You can provide\nthis as a partial or full URL to the resource. For example, the following\nare valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot\n     - projects/project/zones/zone/instantSnapshots/instantSnapshot \n   - zones/zone/instantSnapshots/instantSnapshot",
                },
                status: {
                  type: "string",
                  enum: [
                    "CREATING",
                    "DELETING",
                    "FAILED",
                    "READY",
                    "UPLOADING",
                  ],
                  description:
                    "[Output Only] The status of the snapshot. This can beCREATING, DELETING, FAILED,READY, or UPLOADING.",
                },
                locationHint: {
                  type: "string",
                  description:
                    "An opaque location hint used to place the snapshot close to other\nresources.\nThis field is for use by internal tools that use the public API.",
                },
                chainName: {
                  type: "string",
                  description:
                    "Creates the new snapshot in the snapshot chain labeled with the\nspecified name. The chain name must be 1-63 characters long and comply\nwith RFC1035. This is an uncommon option only for advanced service\nowners who needs to create separate snapshot chains, for example,\nfor chargeback tracking. When you describe your snapshot resource, this\nfield is visible only if it has a non-empty value.",
                },
                sourceSnapshotSchedulePolicy: {
                  type: "string",
                  description:
                    "[Output Only] URL of the resource policy which created this\nscheduled snapshot.",
                },
                licenses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] A list of public visible licenses that apply to this\nsnapshot. This can be because the original image had licenses attached\n(such as a Windows image).",
                },
                storageBytesStatus: {
                  type: "string",
                  enum: ["UPDATING", "UP_TO_DATE"],
                  description:
                    "[Output Only] An indicator whether storageBytes is in a\nstable state or it is being adjusted as a result of shared storage\nreallocation. This status can either be UPDATING, meaning\nthe size of the snapshot is being updated, or UP_TO_DATE,\nmeaning the size of the snapshot is up-to-date.",
                },
                sourceInstantSnapshotEncryptionKey: {
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
                storageBytes: {
                  type: "string",
                  description:
                    "[Output Only] A size of the storage used by the snapshot. As snapshots\nshare storage, this number is expected to change with snapshot\ncreation/deletion. (Format: int64)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                snapshotType: {
                  type: "string",
                  enum: ["ARCHIVE", "STANDARD"],
                  description: "Indicates the type of the snapshot.",
                },
                sourceDiskForRecoveryCheckpoint: {
                  type: "string",
                  description:
                    "The source disk whose recovery checkpoint will be used to create this\nsnapshot.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                storageLocations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Cloud Storage bucket storage location of the snapshot (regional or\nmulti-regional).",
                },
                sourceDisk: {
                  type: "string",
                  description: "The source disk used to create this snapshot.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#snapshot\nfor Snapshot resources.",
                },
                satisfiesPzi: {
                  type: "boolean",
                  description: "Output only. Reserved for future use.",
                },
                guestOsFeatures: {
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
                enableConfidentialCompute: {
                  type: "boolean",
                  description:
                    "Whether this snapshot is created from a confidential compute mode disk.\n[Output Only]: This field is not set by user, but from source disk.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this snapshot, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a snapshot. (Format: byte)",
                },
                params: {
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
              },
              description:
                "Represents a Persistent Disk Snapshot resource.\n\nYou can use snapshots to back up data on a regular interval. For more\ninformation, read  Creating\npersistent disk snapshots.",
              additionalProperties: true,
            },
            description: "A list of Snapshot resources.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for\nlist requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for\nthe query parameter pageToken in the next list request.\nSubsequent list requests will have their own nextPageToken to\ncontinue paging through the results.",
          },
          warning: {
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          kind: {
            type: "string",
            description: "Type of resource.",
          },
        },
        description: "Contains a list of Snapshot resources.",
        additionalProperties: true,
      },
    },
  },
};

export default snapshotsList;
