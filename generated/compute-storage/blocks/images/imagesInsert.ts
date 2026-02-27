import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const imagesInsert: AppBlock = {
  name: "Images - Insert",
  description: `Creates an image in the specified project using the data included in the request.`,
  category: "Images",
  inputs: {
    default: {
      config: {
        forceCreate: {
          name: "Force Create",
          description: "Force image creation if true.",
          type: {
            type: "boolean",
          },
          required: false,
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
        storageLocations: {
          name: "Storage Locations",
          description:
            "Cloud Storage bucket storage location of the image (regional or multi-regional).",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Cloud Storage bucket storage location of the image (regional or\nmulti-regional).",
          },
          required: false,
        },
        shieldedInstanceInitialState: {
          name: "Shielded Instance Initial State",
          description: "Set the secure boot keys of shielded instance.",
          type: {
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
          required: false,
        },
        deprecated: {
          name: "Deprecated",
          description: "The deprecation status associated with this image.",
          type: {
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
          required: false,
        },
        sourceDisk: {
          name: "Source Disk",
          description: "URL of the source disk used to create this image.",
          type: {
            type: "string",
            description:
              "URL of the source disk used to create this image.\nFor example, the following are valid values:\n   \n   - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk \n   - projects/project/zones/zone/disks/disk \n   - zones/zone/disks/disk\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
          },
          required: false,
        },
        sourceDiskEncryptionKey: {
          name: "Source Disk Encryption Key",
          description:
            "Thecustomer-supplied encryption key of the source disk.",
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
        sourceImage: {
          name: "Source Image",
          description: "URL of the source image used to create this image.",
          type: {
            type: "string",
            description:
              "URL of the source image used to create this image.\nThe following are valid formats for the URL:\n   \n   - https://www.googleapis.com/compute/v1/projects/project_id/global/\n   images/image_name\n   - projects/project_id/global/images/image_name\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
          },
          required: false,
        },
        status: {
          name: "Status",
          description: "[Output Only] The status of the image.",
          type: {
            type: "string",
            enum: ["DELETING", "FAILED", "PENDING", "READY"],
            description:
              "[Output Only] The status of the image. An image can be used to create other\nresources, such as instances, only after the image has been successfully\ncreated and the status is set to READY. Possible\nvalues are FAILED, PENDING, orREADY.",
          },
          required: false,
        },
        licenseCodes: {
          name: "License Codes",
          description:
            "Integer license codes indicating which licenses are attached to this image.",
          type: {
            type: "array",
            items: {
              type: "string",
              description: "Format: int64",
            },
            description:
              "Integer license codes indicating which licenses are attached to this image.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for the labels being applied to this image, which is essentially a hash of the labels used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this image, which is\nessentially a hash of the labels used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve an image. (Format: byte)",
          },
          required: false,
        },
        sourceSnapshot: {
          name: "Source Snapshot",
          description: "URL of the source snapshot used to create this image.",
          type: {
            type: "string",
            description:
              "URL of the source snapshot used to create this image.\nThe following are valid formats for the URL:\n   \n   - https://www.googleapis.com/compute/v1/projects/project_id/global/\n   snapshots/snapshot_name\n   - projects/project_id/global/snapshots/snapshot_name\n\n\n\nIn order to create an image, you must provide the full or partial URL of\none of the following:\n   \n   - The rawDisk.source URL \n   - The sourceDisk URL \n   - The sourceImage URL \n   - The sourceSnapshot URL",
          },
          required: false,
        },
        archiveSizeBytes: {
          name: "Archive Size Bytes",
          description: "Size of the image tar.",
          type: {
            type: "string",
            description:
              "Size of the image tar.gz archive stored in Google Cloud\nStorage (in bytes). (Format: int64)",
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
                  "Resource manager tags to be bound to the image. Tag keys and values have\nthe same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
              },
            },
            description: "Additional image params.",
            additionalProperties: true,
          },
          required: false,
        },
        enableConfidentialCompute: {
          name: "Enable Confidential Compute",
          description:
            "Whether this image is created from a confidential compute mode disk.",
          type: {
            type: "boolean",
            description:
              "Whether this image is created from a confidential compute mode disk.\n[Output Only]: This field is not set by user, but from source disk.",
          },
          required: false,
        },
        sourceType: {
          name: "Source Type",
          description: "The type of the image used to create this disk.",
          type: {
            type: "string",
            enum: ["RAW"],
            description:
              "The type of the image used to create this disk. The\ndefault and only valid value is RAW.",
          },
          required: false,
        },
        rawDisk: {
          name: "Raw Disk",
          description: "The parameters of the raw disk image.",
          type: {
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
        imageEncryptionKey: {
          name: "Image Encryption Key",
          description:
            "Encrypts the image using acustomer-supplied encryption key.",
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
        sourceImageId: {
          name: "Source Image ID",
          description:
            "[Output Only] The ID value of the image used to create this image.",
          type: {
            type: "string",
            description:
              "[Output Only]\nThe ID value of the image used to create this image. This value may be used\nto determine whether the image was taken from the current or a previous\ninstance of a given image name.",
          },
          required: false,
        },
        sourceImageEncryptionKey: {
          name: "Source Image Encryption Key",
          description:
            "The customer-supplied encryption key of the source image.",
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
        licenses: {
          name: "Licenses",
          description: "Any applicable license URI.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Any applicable license URI.",
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
        sourceSnapshotEncryptionKey: {
          name: "Source Snapshot Encryption Key",
          description:
            "The customer-supplied encryption key of the source snapshot.",
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
        diskSizeGb: {
          name: "Disk Size Gb",
          description:
            "Size of the image when restored onto a persistent disk (in GB).",
          type: {
            type: "string",
            description:
              "Size of the image when restored onto a persistent disk (in GB). (Format: int64)",
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
        labels: {
          name: "Labels",
          description: "Labels to apply to this image.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this image. These can be later modified by\nthe setLabels method.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#image for\nimages.",
          },
          required: false,
        },
        sourceDiskId: {
          name: "Source Disk ID",
          description:
            "[Output Only] The ID value of the disk used to create this image.",
          type: {
            type: "string",
            description:
              "[Output Only]\nThe ID value of the disk used to create this image. This value may be used\nto determine whether the image was taken from the current or a previous\ninstance of a given disk name.",
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
        architecture: {
          name: "Architecture",
          description: "The architecture of the image.",
          type: {
            type: "string",
            enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
            description:
              "The architecture of the image. Valid values are\nARM64 or X86_64.",
          },
          required: false,
        },
        sourceSnapshotId: {
          name: "Source Snapshot ID",
          description:
            "[Output Only] The ID value of the snapshot used to create this image.",
          type: {
            type: "string",
            description:
              "[Output Only]\nThe ID value of the snapshot used to create this image. This value may be\nused to determine whether the snapshot was taken from the current or a\nprevious instance of a given snapshot name.",
          },
          required: false,
        },
        guestOsFeatures: {
          name: "Guest Os Features",
          description:
            "A list of features to enable on the guest operating system.",
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
              "A list of features to enable on the guest operating system. Applicable\nonly for bootable images. To see a list of available options, see theguestOSfeatures[].type parameter.",
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
        let path = `projects/{project}/global/images`;

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

        if (input.event.inputConfig.storageLocations !== undefined)
          requestBody.storageLocations =
            input.event.inputConfig.storageLocations;
        if (input.event.inputConfig.shieldedInstanceInitialState !== undefined)
          requestBody.shieldedInstanceInitialState =
            input.event.inputConfig.shieldedInstanceInitialState;
        if (input.event.inputConfig.deprecated !== undefined)
          requestBody.deprecated = input.event.inputConfig.deprecated;
        if (input.event.inputConfig.sourceDisk !== undefined)
          requestBody.sourceDisk = input.event.inputConfig.sourceDisk;
        if (input.event.inputConfig.sourceDiskEncryptionKey !== undefined)
          requestBody.sourceDiskEncryptionKey =
            input.event.inputConfig.sourceDiskEncryptionKey;
        if (input.event.inputConfig.sourceImage !== undefined)
          requestBody.sourceImage = input.event.inputConfig.sourceImage;
        if (input.event.inputConfig.status !== undefined)
          requestBody.status = input.event.inputConfig.status;
        if (input.event.inputConfig.licenseCodes !== undefined)
          requestBody.licenseCodes = input.event.inputConfig.licenseCodes;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;
        if (input.event.inputConfig.sourceSnapshot !== undefined)
          requestBody.sourceSnapshot = input.event.inputConfig.sourceSnapshot;
        if (input.event.inputConfig.archiveSizeBytes !== undefined)
          requestBody.archiveSizeBytes =
            input.event.inputConfig.archiveSizeBytes;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.enableConfidentialCompute !== undefined)
          requestBody.enableConfidentialCompute =
            input.event.inputConfig.enableConfidentialCompute;
        if (input.event.inputConfig.sourceType !== undefined)
          requestBody.sourceType = input.event.inputConfig.sourceType;
        if (input.event.inputConfig.rawDisk !== undefined)
          requestBody.rawDisk = input.event.inputConfig.rawDisk;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.imageEncryptionKey !== undefined)
          requestBody.imageEncryptionKey =
            input.event.inputConfig.imageEncryptionKey;
        if (input.event.inputConfig.sourceImageId !== undefined)
          requestBody.sourceImageId = input.event.inputConfig.sourceImageId;
        if (input.event.inputConfig.sourceImageEncryptionKey !== undefined)
          requestBody.sourceImageEncryptionKey =
            input.event.inputConfig.sourceImageEncryptionKey;
        if (input.event.inputConfig.licenses !== undefined)
          requestBody.licenses = input.event.inputConfig.licenses;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.sourceSnapshotEncryptionKey !== undefined)
          requestBody.sourceSnapshotEncryptionKey =
            input.event.inputConfig.sourceSnapshotEncryptionKey;
        if (input.event.inputConfig.diskSizeGb !== undefined)
          requestBody.diskSizeGb = input.event.inputConfig.diskSizeGb;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.sourceDiskId !== undefined)
          requestBody.sourceDiskId = input.event.inputConfig.sourceDiskId;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.architecture !== undefined)
          requestBody.architecture = input.event.inputConfig.architecture;
        if (input.event.inputConfig.sourceSnapshotId !== undefined)
          requestBody.sourceSnapshotId =
            input.event.inputConfig.sourceSnapshotId;
        if (input.event.inputConfig.guestOsFeatures !== undefined)
          requestBody.guestOsFeatures = input.event.inputConfig.guestOsFeatures;

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

export default imagesInsert;
