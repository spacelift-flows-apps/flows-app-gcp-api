import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const imagesList: AppBlock = {
  name: "Images - List",
  description: `Retrieves the list of custom images available to the specified project.`,
  category: "Images",
  inputs: {
    default: {
      config: {
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned.\nIf the number of available results is larger than `maxResults`,\nCompute Engine returns a `nextPageToken` that can be used to get\nthe next page of results in subsequent list requests. Acceptable values are\n`0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
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
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case\nof failure. The default value is false.\n\nFor example, when partial success behavior is enabled, aggregatedList for a\nsingle zone scope either returns all resources in the zone or no resources,\nwith an error code.",
          type: {
            type: "boolean",
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
        let path = `projects/{project}/global/images`;

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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
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
          kind: {
            type: "string",
            description: "Type of resource.",
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
            description: "[Output Only] Informational warning message.",
            additionalProperties: true,
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                storageLocations: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Cloud Storage bucket storage location of the image (regional or\nmulti-regional).",
                },
                satisfiesPzi: {
                  type: "boolean",
                  description: "Output only. Reserved for future use.",
                },
                shieldedInstanceInitialState: {
                  type: "object",
                  properties: {
                    dbxs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          content: {
                            type: "string",
                            description:
                              "The raw content in the secure keys file. (Format: byte)",
                          },
                          fileType: {
                            type: "string",
                            enum: ["BIN", "UNDEFINED", "X509"],
                            description: "The file type of source file.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "The forbidden key database (dbx).",
                    },
                    keks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          content: {
                            type: "string",
                            description:
                              "The raw content in the secure keys file. (Format: byte)",
                          },
                          fileType: {
                            type: "string",
                            enum: ["BIN", "UNDEFINED", "X509"],
                            description: "The file type of source file.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "The Key Exchange Key (KEK).",
                    },
                    dbs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          content: {
                            type: "string",
                            description:
                              "The raw content in the secure keys file. (Format: byte)",
                          },
                          fileType: {
                            type: "string",
                            enum: ["BIN", "UNDEFINED", "X509"],
                            description: "The file type of source file.",
                          },
                        },
                        additionalProperties: true,
                      },
                      description: "The Key Database (db).",
                    },
                    pk: {
                      type: "object",
                      properties: {
                        content: {
                          type: "string",
                          description:
                            "The raw content in the secure keys file. (Format: byte)",
                        },
                        fileType: {
                          type: "string",
                          enum: ["BIN", "UNDEFINED", "X509"],
                          description: "The file type of source file.",
                        },
                      },
                      additionalProperties: true,
                    },
                  },
                  description:
                    "Initial State for shielded instance,\nthese are public keys which are safe to store in public",
                  additionalProperties: true,
                },
                deprecated: {
                  type: "object",
                  properties: {
                    state: {
                      type: "string",
                      enum: ["ACTIVE", "DELETED", "DEPRECATED", "OBSOLETE"],
                      description:
                        "The deprecation state of this resource. This can be ACTIVE,DEPRECATED, OBSOLETE, or DELETED.\nOperations which communicate the end of life date for an image, can useACTIVE. Operations which create a new resource using aDEPRECATED resource will return successfully, but with a\nwarning indicating the deprecated resource and recommending its\nreplacement. Operations which use OBSOLETE orDELETED resources will be rejected and result in an error.",
                    },
                    deprecated: {
                      type: "string",
                      description:
                        "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to DEPRECATED. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
                    },
                    replacement: {
                      type: "string",
                      description:
                        "The URL of the suggested replacement for a deprecated resource.\nThe suggested replacement resource must be the same kind of resource as the\ndeprecated resource.",
                    },
                    obsolete: {
                      type: "string",
                      description:
                        "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to OBSOLETE. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
                    },
                    deleted: {
                      type: "string",
                      description:
                        "An optional RFC3339 timestamp on or after which the state of this\nresource is intended to change to DELETED. This is only\ninformational and the status will not change unless the client explicitly\nchanges it.",
                    },
                  },
                  description: "Deprecation status for a public resource.",
                  additionalProperties: true,
                },
                sourceDisk: {
                  type: "string",
                  description:
                    "URL of the source disk used to create this image.\nFor example, the following are valid values:\n   \n   - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk \n   - projects/project/zones/zone/disks/disk \n   - zones/zone/disks/disk\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
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
                sourceImage: {
                  type: "string",
                  description:
                    "URL of the source image used to create this image.\nThe following are valid formats for the URL:\n   \n   - https://www.googleapis.com/compute/v1/projects/project_id/global/\n   images/image_name\n   - projects/project_id/global/images/image_name\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
                },
                status: {
                  type: "string",
                  enum: ["DELETING", "FAILED", "PENDING", "READY"],
                  description:
                    "[Output Only] The status of the image. An image can be used to create other\nresources, such as instances, only after the image has been successfully\ncreated and the status is set to READY. Possible\nvalues are FAILED, PENDING, orREADY.",
                },
                licenseCodes: {
                  type: "array",
                  items: {
                    type: "string",
                    description: "Format: int64",
                  },
                  description:
                    "Integer license codes indicating which licenses are attached to this image.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this image, which is\nessentially a hash of the labels used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an image. (Format: byte)",
                },
                sourceSnapshot: {
                  type: "string",
                  description:
                    "URL of the source snapshot used to create this image.\nThe following are valid formats for the URL:\n   \n   - https://www.googleapis.com/compute/v1/projects/project_id/global/\n   snapshots/snapshot_name\n   - projects/project_id/global/snapshots/snapshot_name\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
                },
                archiveSizeBytes: {
                  type: "string",
                  description:
                    "Size of the image tar.gz archive stored in Google Cloud\nStorage (in bytes). (Format: int64)",
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
                        "Resource manager tags to be bound to the image. Tag keys and values have\nthe same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
                    },
                  },
                  description: "Additional image params.",
                  additionalProperties: true,
                },
                enableConfidentialCompute: {
                  type: "boolean",
                  description:
                    "Whether this image is created from a confidential compute mode disk.\n[Output Only]: This field is not set by user, but from source disk.",
                },
                sourceType: {
                  type: "string",
                  enum: ["RAW"],
                  description:
                    "The type of the image used to create this disk. The\ndefault and only valid value is RAW.",
                },
                rawDisk: {
                  type: "object",
                  properties: {
                    containerType: {
                      type: "string",
                      enum: ["TAR"],
                      description:
                        "The format used to encode and transmit the block device, which should beTAR. This is just a container and transmission format and not\na runtime format. Provided by the client when the disk image is created.",
                    },
                    sha1Checksum: {
                      type: "string",
                      description:
                        "[Deprecated] This field is deprecated.\nAn optional SHA1 checksum of the disk image before unpackaging provided\nby the client when the disk image is created.",
                    },
                    source: {
                      type: "string",
                      description:
                        "The full Google Cloud Storage URL where the raw disk image archive is\nstored.\nThe following are valid formats for the URL:\n   \n   - https://storage.googleapis.com/bucket_name/image_archive_name\n   - https://storage.googleapis.com/bucket_name/folder_name/image_archive_name\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
                    },
                  },
                  description: "The parameters of the raw disk image.",
                  additionalProperties: true,
                },
                id: {
                  type: "string",
                  description:
                    "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this property when you\ncreate the resource.",
                },
                imageEncryptionKey: {
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
                sourceImageId: {
                  type: "string",
                  description:
                    "[Output Only]\nThe ID value of the image used to create this image. This value may be used\nto determine whether the image was taken from the current or a previous\ninstance of a given image name.",
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
                licenses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Any applicable license URI.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "[Output Only] Creation timestamp inRFC3339\ntext format.",
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
                diskSizeGb: {
                  type: "string",
                  description:
                    "Size of the image when restored onto a persistent disk (in GB). (Format: int64)",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels to apply to this image. These can be later modified by\nthe setLabels method.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Always compute#image for\nimages.",
                },
                sourceDiskId: {
                  type: "string",
                  description:
                    "[Output Only]\nThe ID value of the disk used to create this image. This value may be used\nto determine whether the image was taken from the current or a previous\ninstance of a given disk name.",
                },
                satisfiesPzs: {
                  type: "boolean",
                  description: "[Output Only] Reserved for future use.",
                },
                architecture: {
                  type: "string",
                  enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
                  description:
                    "The architecture of the image. Valid values are\nARM64 or X86_64.",
                },
                sourceSnapshotId: {
                  type: "string",
                  description:
                    "[Output Only]\nThe ID value of the snapshot used to create this image. This value may be\nused to determine whether the snapshot was taken from the current or a\nprevious instance of a given snapshot name.",
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
                    "A list of features to enable on the guest operating system. Applicable\nonly for bootable images. To see a list of available options, see theguestOSfeatures[].type parameter.",
                },
                family: {
                  type: "string",
                  description:
                    "The name of the image family to which this image belongs. The image\nfamily name can be from a publicly managed image family provided by\nCompute Engine, or from a custom image family you create. For example,centos-stream-9 is a publicly available image family.\nFor more information, see Image\nfamily best practices.\n\nWhen creating disks, you can specify an image family instead of a specific\nimage name. The image family always returns its latest image that is not\ndeprecated. The name of the image family must comply with RFC1035.",
                },
              },
              description:
                "Represents an Image resource.\n\nYou can use images to create boot disks for your VM instances.\nFor more information, read Images.",
              additionalProperties: true,
            },
            description: "A list of Image resources.",
          },
        },
        description: "Contains a list of images.",
        additionalProperties: true,
      },
    },
  },
};

export default imagesList;
