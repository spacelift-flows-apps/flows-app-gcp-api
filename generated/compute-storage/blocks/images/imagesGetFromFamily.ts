import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const imagesGetFromFamily: AppBlock = {
  name: "Images - Get From Family",
  description: `Returns the latest image that is part of an image family and is not deprecated.`,
  category: "Images",
  inputs: {
    default: {
      config: {
        family: {
          name: "Family",
          description: "Name of the image family to search for.",
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
        let path = `projects/{project}/global/images/family/{family}`;

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
            description: "[Output Only] Server-defined URL for the resource.",
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
    },
  },
};

export default imagesGetFromFamily;
