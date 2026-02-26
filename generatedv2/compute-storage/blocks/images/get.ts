import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Images - Get",
  description: `Returns the specified Zone resource.`,
  category: "Images",
  inputs: {
    default: {
      config: {
        image: {
          name: "Image",
          description: "Name of the image resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.image !== undefined)
          pathParams["image"] = String(input.event.inputConfig.image);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "/compute/v1/projects/{project}/global/images/{image}",
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
            description:
              "The architecture of the image. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          },
          archiveSizeBytes: {
            type: "string",
            description: "64-bit integer as string",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          deprecated: {
            type: "object",
            properties: {
              deleted: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DELETED. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              deprecated: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to DEPRECATED. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              obsolete: {
                type: "string",
                description:
                  "An optional RFC3339 timestamp on or after which the state of this resource is intended to change to OBSOLETE. This is only informational and the status will not change unless the client explicitly changes it.",
              },
              replacement: {
                type: "string",
                description:
                  "The URL of the suggested replacement for a deprecated resource. The suggested replacement resource must be the same kind of resource as the deprecated resource.",
              },
              state: {
                type: "string",
                description:
                  "The deprecation state of this resource. This can be ACTIVE,DEPRECATED, OBSOLETE, or DELETED. Operations which communicate the end of life date for an image, can useACTIVE. Operations which create a new resource using aDEPRECATED resource will return successfully, but with a warning indicating the deprecated resource and recommending its replacement. Operations which use OBSOLETE orDELETED resources will be rejected and result in an error. Check the State enum for the list of possible values.",
              },
            },
            description: "Deprecation status for a public resource.",
            additionalProperties: true,
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
          enableConfidentialCompute: {
            type: "boolean",
            description:
              "Output only. Whether this image is created from a confidential compute mode disk. [Output Only]: This field is not set by user, but from source disk.",
          },
          family: {
            type: "string",
            description:
              "The name of the image family to which this image belongs. The image family name can be from a publicly managed image family provided by Compute Engine, or from a custom image family you create. For example,centos-stream-9 is a publicly available image family. For more information, see Image family best practices.  When creating disks, you can specify an image family instead of a specific image name. The image family always returns its latest image that is not deprecated. The name of the image family must comply with RFC1035.",
          },
          guestOsFeatures: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description:
                    "The ID of a supported feature. To add multiple values, use commas to separate values. Set to one or more of the following values:     - VIRTIO_SCSI_MULTIQUEUE    - WINDOWS    - MULTI_IP_SUBNET    - UEFI_COMPATIBLE    - GVNIC    - SEV_CAPABLE    - SUSPEND_RESUME_COMPATIBLE    - SEV_LIVE_MIGRATABLE_V2    - SEV_SNP_CAPABLE    - TDX_CAPABLE    - IDPF    - SNP_SVSM_CAPABLE   For more information, see Enabling guest operating system features. Check the Type enum for the list of possible values.",
                },
              },
              description: "Guest OS features.",
              additionalProperties: true,
            },
            description:
              "A list of features to enable on the guest operating system. Applicable only for bootable images. To see a list of available options, see theguestOSfeatures[].type parameter.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          imageEncryptionKey: {
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
              "Encrypts the image using acustomer-supplied encryption key.  After you encrypt an image with a customer-supplied key, you must provide the same key if you use the image later (e.g. to create a disk from the image).  Customer-supplied encryption keys do not protect access to metadata of the disk.  If you do not provide an encryption key when creating the image, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the image later.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#image for images.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this image, which is essentially a hash of the labels used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an image.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this image. These can be later modified by the setLabels method.",
          },
          licenseCodes: {
            type: "array",
            items: {
              type: "string",
              description: "64-bit integer as string",
            },
            description:
              "Integer license codes indicating which licenses are attached to this image.",
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
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
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
                  "Resource manager tags to be bound to the image. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
              },
            },
            description: "Additional image params.",
            additionalProperties: true,
          },
          rawDisk: {
            type: "object",
            properties: {
              containerType: {
                type: "string",
                description:
                  "The format used to encode and transmit the block device, which should beTAR. This is just a container and transmission format and not a runtime format. Provided by the client when the disk image is created. Check the ContainerType enum for the list of possible values.",
              },
              sha1Checksum: {
                type: "string",
                description:
                  "[Deprecated] This field is deprecated. An optional SHA1 checksum of the disk image before unpackaging provided by the client when the disk image is created.",
              },
              source: {
                type: "string",
                description:
                  "The full Google Cloud Storage URL where the raw disk image archive is stored. The following are valid formats for the URL:     - https://storage.googleapis.com/bucket_name/image_archive_name    - https://storage.googleapis.com/bucket_name/folder_name/image_archive_name    In order to create an image, you must provide the full or partial URL of one of the following:     - The rawDisk.source URL    - The sourceDisk URL    - The sourceImage URL    - The sourceSnapshot URL",
              },
            },
            description: "The parameters of the raw disk image.",
            additionalProperties: true,
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
          shieldedInstanceInitialState: {
            type: "object",
            properties: {
              dbs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    content: {
                      type: "string",
                      description: "The raw content in the secure keys file.",
                    },
                    fileType: {
                      type: "string",
                      description:
                        "The file type of source file. Check the FileType enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                },
                description: "The Key Database (db).",
              },
              dbxs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    content: {
                      type: "string",
                      description: "The raw content in the secure keys file.",
                    },
                    fileType: {
                      type: "string",
                      description:
                        "The file type of source file. Check the FileType enum for the list of possible values.",
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
                      description: "The raw content in the secure keys file.",
                    },
                    fileType: {
                      type: "string",
                      description:
                        "The file type of source file. Check the FileType enum for the list of possible values.",
                    },
                  },
                  additionalProperties: true,
                },
                description: "The Key Exchange Key (KEK).",
              },
              pk: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description: "The raw content in the secure keys file.",
                  },
                  fileType: {
                    type: "string",
                    description:
                      "The file type of source file. Check the FileType enum for the list of possible values.",
                  },
                },
                additionalProperties: true,
                description: "The Platform Key (PK).",
              },
            },
            description:
              "Initial State for shielded instance, these are public keys which are safe to store in public",
            additionalProperties: true,
          },
          sourceDisk: {
            type: "string",
            description:
              "URL of the source disk used to create this image. For example, the following are valid values:     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk    - projects/project/zones/zone/disks/disk    - zones/zone/disks/disk    In order to create an image, you must provide the full or partial URL of one of the following:     - The rawDisk.source URL    - The sourceDisk URL    - The sourceImage URL    - The sourceSnapshot URL",
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
              "Thecustomer-supplied encryption key of the source disk. Required if the source disk is protected by a customer-supplied encryption key.",
          },
          sourceDiskId: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the disk used to create this image. This value may be used to determine whether the image was taken from the current or a previous instance of a given disk name.",
          },
          sourceImage: {
            type: "string",
            description:
              "URL of the source image used to create this image. The following are valid formats for the URL:     - https://www.googleapis.com/compute/v1/projects/project_id/global/    images/image_name    - projects/project_id/global/images/image_name    In order to create an image, you must provide the full or partial URL of one of the following:     - The rawDisk.source URL    - The sourceDisk URL    - The sourceImage URL    - The sourceSnapshot URL",
          },
          sourceImageEncryptionKey: {
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
              "The customer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.",
          },
          sourceImageId: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the image used to create this image. This value may be used to determine whether the image was taken from the current or a previous instance of a given image name.",
          },
          sourceSnapshot: {
            type: "string",
            description:
              "URL of the source snapshot used to create this image. The following are valid formats for the URL:     - https://www.googleapis.com/compute/v1/projects/project_id/global/    snapshots/snapshot_name    - projects/project_id/global/snapshots/snapshot_name    In order to create an image, you must provide the full or partial URL of one of the following:     - The rawDisk.source URL    - The sourceDisk URL    - The sourceImage URL    - The sourceSnapshot URL",
          },
          sourceSnapshotEncryptionKey: {
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
              "The customer-supplied encryption key of the source snapshot. Required if the source snapshot is protected by a customer-supplied encryption key.",
          },
          sourceSnapshotId: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the snapshot used to create this image. This value may be used to determine whether the snapshot was taken from the current or a previous instance of a given snapshot name.",
          },
          sourceType: {
            type: "string",
            description:
              "The type of the image used to create this disk. The default and only valid value is RAW. Check the SourceType enum for the list of possible values.",
          },
          status: {
            type: "string",
            description:
              "Output only. [Output Only] The status of the image. An image can be used to create other resources, such as instances, only after the image has been successfully created and the status is set to READY. Possible values are FAILED, PENDING, orREADY. Check the Status enum for the list of possible values.",
          },
          storageLocations: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Cloud Storage bucket storage location of the image (regional or multi-regional).",
          },
        },
        description:
          "Represents an Image resource.  You can use images to create boot disks for your VM instances. For more information, read Images.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
