import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const disksList: AppBlock = {
  name: "Disks - List",
  description: `Retrieves a list of persistent disks contained within the specified zone.`,
  category: "Disks",
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
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the\n`nextPageToken` returned by a previous list request to get\nthe next page of results.",
          type: {
            type: "string",
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
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results\nare returned in alphanumerical order based on the resource name.\n\nYou can also sort results in descending order based on the creation\ntimestamp using `orderBy="creationTimestamp desc"`. This sorts\nresults based on the `creationTimestamp` field in\nreverse chronological order (newest result first). Use this to sort\nresources like operations so that the newest operation is returned first.\n\nCurrently, only sorting by `name` or\n`creationTimestamp desc` is supported.',
          type: {
            type: "string",
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
        let path = `projects/{project}/zones/{zone}/disks`;

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
              "[Output Only] Type of resource. Always compute#diskList for\nlists of disks.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                provisionedThroughput: {
                  type: "string",
                  description:
                    "Indicates how much throughput to provision for the disk. This sets the\nnumber of throughput mb per second that the disk can handle. Values must be\ngreater than or equal to 1. (Format: int64)",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this disk, which is\nessentially a hash of the labels set used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve a disk. (Format: byte)",
                },
                lastAttachTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Last attach timestamp inRFC3339\ntext format.",
                },
                storagePool: {
                  type: "string",
                  description:
                    "The storage pool in which the new disk is created. You can provide\nthis as a partial or full URL to the resource. For example, the following\nare valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/storagePools/storagePool\n     - projects/project/zones/zone/storagePools/storagePool \n   - zones/zone/storagePools/storagePool",
                },
                sizeGb: {
                  type: "string",
                  description:
                    "Size, in GB, of the persistent disk. You can specify\nthis field when creating a persistent disk using thesourceImage, sourceSnapshot, orsourceDisk parameter, or specify it alone to create an empty\npersistent disk.\n\nIf you specify this field along with a source, the value ofsizeGb must not be less than the size of the\nsource.\nAcceptable values are greater than 0. (Format: int64)",
                },
                options: {
                  type: "string",
                  description: "Internal use only.",
                },
                asyncPrimaryDisk: {
                  type: "object",
                  properties: {
                    disk: {
                      type: "string",
                      description:
                        "The other disk asynchronously replicated to or from the current disk.\nYou can provide this as a partial or full URL to the resource.\nFor example, the following are valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk \n   - projects/project/zones/zone/disks/disk \n   - zones/zone/disks/disk",
                    },
                    consistencyGroupPolicyId: {
                      type: "string",
                      description:
                        "[Output Only] ID of the DiskConsistencyGroupPolicy if replication was\nstarted on the disk as a member of a group.",
                    },
                    diskId: {
                      type: "string",
                      description:
                        "[Output Only] The unique ID of the other disk asynchronously replicated\nto or from the current disk. This value identifies the exact disk that\nwas used to create this replication. For example, if you started\nreplicating the persistent disk from a disk that was later deleted and\nrecreated under the same name, the disk ID would identify the exact\nversion of the disk that was used.",
                    },
                    consistencyGroupPolicy: {
                      type: "string",
                      description:
                        "[Output Only] URL of the DiskConsistencyGroupPolicy if replication was\nstarted on the disk as a member of a group.",
                    },
                  },
                  additionalProperties: true,
                },
                licenses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A list of publicly visible licenses. Reserved for Google's use.",
                },
                sourceSnapshotId: {
                  type: "string",
                  description:
                    "[Output Only] The unique ID of the snapshot used to create this disk. This\nvalue identifies the exact snapshot that was used to create this persistent\ndisk. For example, if you created the persistent disk from a snapshot that\nwas later deleted and recreated under the same name, the source snapshot ID\nwould identify the exact version of the snapshot that was used.",
                },
                licenseCodes: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "Format: int64",
                  },
                  description:
                    "Integer license codes indicating which licenses are attached to this disk.",
                },
                sourceConsistencyGroupPolicy: {
                  type: "string",
                  description:
                    "[Output Only] URL of the DiskConsistencyGroupPolicy for a secondary disk\nthat was created using a consistency group.",
                },
                lastDetachTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Last detach timestamp inRFC3339\ntext format.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#disk for\ndisks.",
                },
                type: {
                  type: "string",
                  description:
                    "URL of the disk type resource describing which disk type to use to create\nthe disk. Provide this when creating the disk. For example:projects/project/zones/zone/diskTypes/pd-ssd. See Persistent disk\ntypes.",
                },
                resourceStatus: {
                  type: "object",
                  properties: {
                    asyncPrimaryDisk: {
                      type: "object",
                      properties: {
                        state: {
                          type: "string",
                          enum: [
                            "ACTIVE",
                            "CREATED",
                            "STARTING",
                            "STATE_UNSPECIFIED",
                            "STOPPED",
                            "STOPPING",
                          ],
                        },
                      },
                      additionalProperties: true,
                    },
                    asyncSecondaryDisks: {
                      type: "object",
                      additionalProperties: {
                        type: "object",
                      },
                      description:
                        "Key: disk, value: AsyncReplicationStatus message",
                    },
                  },
                  additionalProperties: true,
                },
                physicalBlockSizeBytes: {
                  type: "string",
                  description:
                    "Physical block size of the persistent disk, in bytes.\nIf not present in a request, a default value is used.\nThe currently supported size is 4096, other sizes may be added in\nthe future.\nIf an unsupported value is requested, the error message will list\nthe supported values for the caller's project. (Format: int64)",
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                diskEncryptionKey: {
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
                region: {
                  type: "string",
                  description:
                    "[Output Only] URL of the region where the disk resides. Only applicable for\nregional resources.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                replicaZones: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "URLs of the zones where the disk should be replicated to. Only applicable\nfor regional resources.",
                },
                sourceSnapshotEncryptionKey: {
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
                accessMode: {
                  type: "string",
                  enum: [
                    "READ_ONLY_MANY",
                    "READ_WRITE_MANY",
                    "READ_WRITE_SINGLE",
                  ],
                  description:
                    "The access mode of the disk.\n   \n   \n     - READ_WRITE_SINGLE: The default AccessMode, means the\n     disk can be attached to single instance in RW mode.\n     - READ_WRITE_MANY: The AccessMode means the disk can be\n     attached to multiple instances in RW mode.\n     - READ_ONLY_MANY: The AccessMode means the disk can be\n     attached to multiple instances in RO mode.\n\n\nThe AccessMode is only valid for Hyperdisk disk types.",
                },
                sourceSnapshot: {
                  type: "string",
                  description:
                    "The source snapshot used to create this disk. You can provide this as a\npartial or full URL to the resource. For example, the following are valid\nvalues:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/global/snapshots/snapshot \n   - projects/project/global/snapshots/snapshot\n     - global/snapshots/snapshot",
                },
                sourceInstantSnapshot: {
                  type: "string",
                  description:
                    "The source instant snapshot used to create this disk. You can provide\nthis as a partial or full URL to the resource. For example, the following\nare valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot\n     - projects/project/zones/zone/instantSnapshots/instantSnapshot \n   - zones/zone/instantSnapshots/instantSnapshot",
                },
                resourcePolicies: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Resource policies applied to this disk for automatic snapshot creations.",
                },
                users: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] Links to the users of the disk (attached instances)\nin form:projects/project/zones/zone/instances/instance",
                },
                enableConfidentialCompute: {
                  type: "boolean",
                  description:
                    "Whether this disk is using confidential compute mode.",
                },
                asyncSecondaryDisks: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                  },
                  description:
                    "[Output Only] A list of disks this disk is asynchronously replicated to.",
                },
                architecture: {
                  type: "string",
                  enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
                  description:
                    "The architecture of the disk. Valid values are\nARM64 or X86_64.",
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
                        "Resource manager tags to be bound to the disk. Tag keys and values\nhave the same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
                    },
                  },
                  description: "Additional disk params.",
                  additionalProperties: true,
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this disk. These can be later modified by\nthe setLabels method.",
                },
                provisionedIops: {
                  type: "string",
                  description:
                    "Indicates how many IOPS to provision for the disk. This sets the number\nof I/O operations per second that the disk can handle. Values must be\nbetween 10,000 and 120,000. For more details, see theExtreme persistent\ndisk documentation. (Format: int64)",
                },
                sourceConsistencyGroupPolicyId: {
                  type: "string",
                  description:
                    "[Output Only] ID of the DiskConsistencyGroupPolicy for a secondary disk\nthat was created using a consistency group.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?`\nwhich means the first character must be a lowercase letter, and all\nfollowing characters must be a dash, lowercase letter, or digit, except\nthe last character, which cannot be a dash.",
                },
                sourceImage: {
                  type: "string",
                  description:
                    "The source image used to create this disk. If the source image is\ndeleted, this field will not be set.\n\nTo create a disk with one of the public operating system images, specify\nthe image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:\n\nprojects/debian-cloud/global/images/family/debian-9\n\n\nAlternatively, use a specific version of a public operating system image:\n\nprojects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD\n\n\nTo create a disk with a custom image that you created, specify the\nimage name in the following format:\n\nglobal/images/my-custom-image\n\n\nYou can also specify a custom image by its image family, which returns\nthe latest version of the image in that family. Replace the image name\nwith family/family-name:\n\nglobal/images/family/my-image-family",
                },
                locationHint: {
                  type: "string",
                  description:
                    "An opaque location hint used to place the disk close to other resources.\nThis field is for use by internal tools that use the public API.",
                },
                status: {
                  type: "string",
                  enum: [
                    "CREATING",
                    "DELETING",
                    "FAILED",
                    "READY",
                    "RESTORING",
                    "UNAVAILABLE",
                  ],
                  description:
                    "[Output Only] The status of disk creation.\n   \n   \n     - CREATING: Disk is provisioning.\n     - RESTORING: Source data is being copied into the\n     disk.\n     - FAILED: Disk creation failed.\n     - READY: Disk is ready for use.\n     - DELETING: Disk is deleting.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
                },
                sourceDiskId: {
                  type: "string",
                  description:
                    "[Output Only] The unique ID of the disk used to create this disk. This\nvalue identifies the exact disk that was used to create this persistent\ndisk. For example, if you created the persistent disk from a disk that\nwas later deleted and recreated under the same name, the source disk ID\nwould identify the exact version of the disk that was used.",
                },
                zone: {
                  type: "string",
                  description:
                    "[Output Only] URL of the zone where the disk resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
                },
                sourceInstantSnapshotId: {
                  type: "string",
                  description:
                    "[Output Only] The unique ID of the instant snapshot used to create this\ndisk. This value identifies the exact instant snapshot that was used to\ncreate this persistent disk. For example, if you created the persistent\ndisk from an instant snapshot that was later deleted and recreated under\nthe same name, the source instant snapshot ID would identify the exact\nversion of the instant snapshot that was used.",
                },
                satisfiesPzi: {
                  type: "boolean",
                  description: "Output only. Reserved for future use.",
                },
                sourceStorageObject: {
                  type: "string",
                  description:
                    "The full Google Cloud Storage URI where the disk image is stored. This file\nmust be a gzip-compressed tarball whose name ends in .tar.gz or virtual\nmachine disk whose name ends in vmdk. Valid URIs may start with gs:// or\nhttps://storage.googleapis.com/. This flag is not optimized for creating\nmultiple disks from a source storage object. To create many disks from a\nsource storage object, use gcloud compute images\nimport instead.",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined fully-qualified URL for this resource.",
                },
                sourceImageId: {
                  type: "string",
                  description:
                    "[Output Only] The ID value of the image used to create this disk. This\nvalue identifies the exact image that was used to create this persistent\ndisk. For example, if you created the persistent disk from an image that\nwas later deleted and recreated under the same name, the source image ID\nwould identify the exact version of the image that was used.",
                },
                sourceImageEncryptionKey: {
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
                sourceDisk: {
                  type: "string",
                  description:
                    "The source disk used to create this disk. You can provide this as a\npartial or full URL to the resource. For example, the following are valid\nvalues:\n   \n   \n     - \n       https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk\n     \n     - \n       https://www.googleapis.com/compute/v1/projects/project/regions/region/disks/disk\n     \n     - \n       projects/project/zones/zone/disks/disk\n     \n     - \n       projects/project/regions/region/disks/disk\n     \n     - \n       zones/zone/disks/disk\n     \n     - \n       regions/region/disks/disk",
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
                    "A list of features to enable on the guest operating system. Applicable\nonly for bootable images. Read\nEnabling guest operating system features to see a list of available\noptions.",
                },
              },
              description:
                "Represents a Persistent Disk resource.\n\nGoogle Compute Engine has two Disk resources:\n\n* [Zonal](/compute/docs/reference/rest/v1/disks)\n* [Regional](/compute/docs/reference/rest/v1/regionDisks)\n\nPersistent disks are required for running your VM instances.\nCreate both boot and non-boot (data) persistent disks. For more information,\nread Persistent Disks. For more\nstorage options, read Storage options.\n\nThe disks resource represents a zonal persistent disk.\nFor more information, readZonal persistent disks.\n\nThe regionDisks resource represents a\nregional persistent disk.  For more information, read\nRegional resources.",
              additionalProperties: true,
            },
            description: "A list of Disk resources.",
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
        },
        description: "A list of Disk resources.",
        additionalProperties: true,
      },
    },
  },
};

export default disksList;
