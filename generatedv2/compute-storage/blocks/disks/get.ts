import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Disks - Get",
  description: `Returns the specified Zone resource.`,
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
        disk: {
          name: "Disk",
          description: "Name of the persistent disk to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.disk !== undefined)
          pathParams["disk"] = String(input.event.inputConfig.disk);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/disks/{disk}",
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
          access_mode: {
            type: "string",
            description:
              "The access mode of the disk.        - READ_WRITE_SINGLE: The default AccessMode, means the      disk can be attached to single instance in RW mode.      - READ_WRITE_MANY: The AccessMode means the disk can be      attached to multiple instances in RW mode.      - READ_ONLY_MANY: The AccessMode means the disk can be      attached to multiple instances in RO mode.   The AccessMode is only valid for Hyperdisk disk types. Check the AccessMode enum for the list of possible values.",
          },
          architecture: {
            type: "string",
            description:
              "The architecture of the disk. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
          },
          async_primary_disk: {
            type: "object",
            properties: {
              consistency_group_policy: {
                type: "string",
                description:
                  "Output only. [Output Only] URL of the DiskConsistencyGroupPolicy if replication was started on the disk as a member of a group.",
              },
              consistency_group_policy_id: {
                type: "string",
                description:
                  "Output only. [Output Only] ID of the DiskConsistencyGroupPolicy if replication was started on the disk as a member of a group.",
              },
              disk: {
                type: "string",
                description:
                  "The other disk asynchronously replicated to or from the current disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk    - projects/project/zones/zone/disks/disk    - zones/zone/disks/disk",
              },
              disk_id: {
                type: "string",
                description:
                  "Output only. [Output Only] The unique ID of the other disk asynchronously replicated to or from the current disk. This value identifies the exact disk that was used to create this replication. For example, if you started replicating the persistent disk from a disk that was later deleted and recreated under the same name, the disk ID would identify the exact version of the disk that was used.",
              },
            },
            additionalProperties: true,
            description: "Disk asynchronously replicated into this disk.",
          },
          async_secondary_disks: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Output only. [Output Only] A list of disks this disk is asynchronously replicated to.",
          },
          creation_timestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          disk_encryption_key: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
              'Encrypts the disk using a customer-supplied encryption key or a customer-managed encryption key.  Encryption keys do not protect access to metadata of the disk.  After you encrypt a disk with a customer-supplied key, you must provide the same key if you use the disk later. For example, to create a disk snapshot, to create a disk image, to create a machine image, or to attach the disk to a virtual machine.  After you encrypt a disk with a customer-managed key, thediskEncryptionKey.kmsKeyName is set to a key *version* name once the disk is created. The disk is encrypted with this version of the key. In the response, diskEncryptionKey.kmsKeyName appears in the following format:  "diskEncryptionKey.kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeysVersions/version  If you do not provide an encryption key when creating the disk, then the disk is encrypted using an automatically generated key and you don\'t need to provide a key to use the disk later.',
          },
          enable_confidential_compute: {
            type: "boolean",
            description:
              "Whether this disk is using confidential compute mode.",
          },
          guest_os_features: {
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
              "A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#disk for disks.",
          },
          label_fingerprint: {
            type: "string",
            description:
              "A fingerprint for the labels being applied to this disk, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a disk.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this disk. These can be later modified by the setLabels method.",
          },
          last_attach_timestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Last attach timestamp inRFC3339 text format.",
          },
          last_detach_timestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Last detach timestamp inRFC3339 text format.",
          },
          license_codes: {
            type: "array",
            items: {
              type: "string",
              description: "64-bit integer as string",
            },
            description:
              "Integer license codes indicating which licenses are attached to this disk.",
          },
          licenses: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of publicly visible licenses. Reserved for Google's use.",
          },
          location_hint: {
            type: "string",
            description:
              "An opaque location hint used to place the disk close to other resources. This field is for use by internal tools that use the public API.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          options: {
            type: "string",
            description: "Internal use only.",
          },
          params: {
            type: "object",
            properties: {
              resource_manager_tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the disk. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
              },
            },
            description: "Additional disk params.",
            additionalProperties: true,
          },
          physical_block_size_bytes: {
            type: "string",
            description: "64-bit integer as string",
          },
          provisioned_iops: {
            type: "string",
            description: "64-bit integer as string",
          },
          provisioned_throughput: {
            type: "string",
            description: "64-bit integer as string",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the disk resides. Only applicable for regional resources. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          replica_zones: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs of the zones where the disk should be replicated to. Only applicable for regional resources.",
          },
          resource_policies: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Resource policies applied to this disk for automatic snapshot creations.",
          },
          resource_status: {
            type: "object",
            properties: {
              async_primary_disk: {
                type: "object",
                properties: {
                  state: {
                    type: "string",
                    description:
                      "Check the State enum for the list of possible values.",
                  },
                },
                additionalProperties: true,
              },
              async_secondary_disks: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "Key: disk, value: AsyncReplicationStatus message",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] Status information for the disk resource.",
          },
          satisfies_pzi: {
            type: "boolean",
            description: "Output only. Reserved for future use.",
          },
          satisfies_pzs: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined fully-qualified URL for this resource.",
          },
          size_gb: {
            type: "string",
            description: "64-bit integer as string",
          },
          source_consistency_group_policy: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the DiskConsistencyGroupPolicy for a secondary disk that was created using a consistency group.",
          },
          source_consistency_group_policy_id: {
            type: "string",
            description:
              "Output only. [Output Only] ID of the DiskConsistencyGroupPolicy for a secondary disk that was created using a consistency group.",
          },
          source_disk: {
            type: "string",
            description:
              "The source disk used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        -        https://www.googleapis.com/compute/v1/projects/project/zones/zone/disks/disk       -        https://www.googleapis.com/compute/v1/projects/project/regions/region/disks/disk       -        projects/project/zones/zone/disks/disk       -        projects/project/regions/region/disks/disk       -        zones/zone/disks/disk       -        regions/region/disks/disk",
          },
          source_disk_id: {
            type: "string",
            description:
              "Output only. [Output Only] The unique ID of the disk used to create this disk. This value identifies the exact disk that was used to create this persistent disk. For example, if you created the persistent disk from a disk that was later deleted and recreated under the same name, the source disk ID would identify the exact version of the disk that was used.",
          },
          source_image: {
            type: "string",
            description:
              "The source image used to create this disk. If the source image is deleted, this field will not be set.  To create a disk with one of the public operating system images, specify the image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:  projects/debian-cloud/global/images/family/debian-9   Alternatively, use a specific version of a public operating system image:  projects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD   To create a disk with a custom image that you created, specify the image name in the following format:  global/images/my-custom-image   You can also specify a custom image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:  global/images/family/my-image-family",
          },
          source_image_encryption_key: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
              "Thecustomer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.",
          },
          source_image_id: {
            type: "string",
            description:
              "Output only. [Output Only] The ID value of the image used to create this disk. This value identifies the exact image that was used to create this persistent disk. For example, if you created the persistent disk from an image that was later deleted and recreated under the same name, the source image ID would identify the exact version of the image that was used.",
          },
          source_instant_snapshot: {
            type: "string",
            description:
              "The source instant snapshot used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instantSnapshots/instantSnapshot      - projects/project/zones/zone/instantSnapshots/instantSnapshot    - zones/zone/instantSnapshots/instantSnapshot",
          },
          source_instant_snapshot_id: {
            type: "string",
            description:
              "Output only. [Output Only] The unique ID of the instant snapshot used to create this disk. This value identifies the exact instant snapshot that was used to create this persistent disk. For example, if you created the persistent disk from an instant snapshot that was later deleted and recreated under the same name, the source instant snapshot ID would identify the exact version of the instant snapshot that was used.",
          },
          source_snapshot: {
            type: "string",
            description:
              "The source snapshot used to create this disk. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/global/snapshots/snapshot    - projects/project/global/snapshots/snapshot      - global/snapshots/snapshot",
          },
          source_snapshot_encryption_key: {
            type: "object",
            properties: {
              kms_key_name: {
                type: "string",
                description:
                  'The name of the encryption key that is stored in Google Cloud KMS. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key  The fully-qualifed key name may be returned for resource GET requests. For example:  "kmsKeyName": "projects/kms_project_id/locations/region/keyRings/ key_region/cryptoKeys/key /cryptoKeyVersions/1',
              },
              kms_key_service_account: {
                type: "string",
                description:
                  'The service account being used for the encryption request for the given KMS key. If absent, the Compute Engine default service account is used. For example:  "kmsKeyServiceAccount": "name@project_id.iam.gserviceaccount.com/',
              },
              raw_key: {
                type: "string",
                description:
                  'Specifies a 256-bit customer-supplied encryption key, encoded in RFC 4648 base64 to either encrypt or decrypt this resource. You can provide either the rawKey or thersaEncryptedKey. For example:  "rawKey": "SGVsbG8gZnJvbSBHb29nbGUgQ2xvdWQgUGxhdGZvcm0="',
              },
              rsa_encrypted_key: {
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
              "Thecustomer-supplied encryption key of the source snapshot. Required if the source snapshot is protected by a customer-supplied encryption key.",
          },
          source_snapshot_id: {
            type: "string",
            description:
              "Output only. [Output Only] The unique ID of the snapshot used to create this disk. This value identifies the exact snapshot that was used to create this persistent disk. For example, if you created the persistent disk from a snapshot that was later deleted and recreated under the same name, the source snapshot ID would identify the exact version of the snapshot that was used.",
          },
          source_storage_object: {
            type: "string",
            description:
              "The full Google Cloud Storage URI where the disk image is stored. This file must be a gzip-compressed tarball whose name ends in .tar.gz or virtual machine disk whose name ends in vmdk. Valid URIs may start with gs:// or https://storage.googleapis.com/. This flag is not optimized for creating multiple disks from a source storage object. To create many disks from a source storage object, use gcloud compute images import instead.",
          },
          status: {
            type: "string",
            description:
              "Output only. [Output Only] The status of disk creation.        - CREATING: Disk is provisioning.      - RESTORING: Source data is being copied into the      disk.      - FAILED: Disk creation failed.      - READY: Disk is ready for use.      - DELETING: Disk is deleting. Check the Status enum for the list of possible values.",
          },
          storage_pool: {
            type: "string",
            description:
              "The storage pool in which the new disk is created. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/storagePools/storagePool      - projects/project/zones/zone/storagePools/storagePool    - zones/zone/storagePools/storagePool",
          },
          type: {
            type: "string",
            description:
              "URL of the disk type resource describing which disk type to use to create the disk. Provide this when creating the disk. For example:projects/project/zones/zone/diskTypes/pd-ssd. See Persistent disk types.",
          },
          users: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] Links to the users of the disk (attached instances) in form:projects/project/zones/zone/instances/instance",
          },
          zone: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the zone where the disk resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        description:
          "Represents a Persistent Disk resource.  Google Compute Engine has two Disk resources:  * [Zonal](/compute/docs/reference/rest/v1/disks) * [Regional](/compute/docs/reference/rest/v1/regionDisks)  Persistent disks are required for running your VM instances. Create both boot and non-boot (data) persistent disks. For more information, read Persistent Disks. For more storage options, read Storage options.  The disks resource represents a zonal persistent disk. For more information, readZonal persistent disks.  The regionDisks resource represents a regional persistent disk.  For more information, read Regional resources.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
