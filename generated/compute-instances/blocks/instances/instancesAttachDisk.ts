import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesAttachDisk: AppBlock = {
  name: "Instances - Attach Disk",
  description: `Attaches an existing Disk resource to an instance.`,
  category: "Instances",
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
        instance: {
          name: "Instance",
          description: "The instance name for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        forceAttach: {
          name: "Force Attach",
          description:
            "[Input Only] Whether to force attach the regional disk even if it's currently attached to another instance.",
          type: {
            type: "boolean",
            description:
              "[Input Only] Whether to force attach the regional disk even if it's\ncurrently attached to another instance. If you try to force attach a zonal\ndisk to an instance, you will receive an error.",
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
        savedState: {
          name: "Saved State",
          description:
            "For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this field is set to PRESERVED if the LocalSSD data has been saved to a persistent location by customer request.",
          type: {
            type: "string",
            enum: ["DISK_SAVED_STATE_UNSPECIFIED", "PRESERVED"],
            description:
              "For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this\nfield is set to PRESERVED if the LocalSSD data has been saved\nto a persistent location by customer request.  (see the\ndiscard_local_ssd option on Stop/Suspend).\nRead-only in the api.",
          },
          required: false,
        },
        diskSizeGb: {
          name: "Disk Size Gb",
          description: "The size of the disk in GB.",
          type: {
            type: "string",
            description: "The size of the disk in GB. (Format: int64)",
          },
          required: false,
        },
        architecture: {
          name: "Architecture",
          description: "[Output Only] The architecture of the attached disk.",
          type: {
            type: "string",
            enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
            description:
              "[Output Only] The architecture of the attached disk. Valid values are ARM64\nor X86_64.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#attachedDisk for attached disks.",
          },
          required: false,
        },
        source: {
          name: "Source",
          description:
            "Specifies a valid partial or full URL to an existing Persistent Disk resource.",
          type: {
            type: "string",
            description:
              "Specifies a valid partial or full URL to an existing Persistent Disk\nresource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source\nis required.\n\nIf desired, you can also attach existing non-root persistent disks using\nthis property. This field is only applicable for persistent disks.\n\nNote that for InstanceTemplate, specify the disk name for zonal disk,\nand the URL for regional disk.",
          },
          required: false,
        },
        licenses: {
          name: "Licenses",
          description: "[Output Only] Any valid publicly visible licenses.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "[Output Only] Any valid publicly visible licenses.",
          },
          required: false,
        },
        initializeParams: {
          name: "Initialize Params",
          description:
            "[Input Only] Specifies the parameters for a new disk that will be created alongside the new instance.",
          type: {
            type: "object",
            properties: {
              architecture: {
                type: "string",
                enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
                description:
                  "The architecture of the attached disk. Valid values are\narm64 or x86_64.",
              },
              onUpdateAction: {
                type: "string",
                enum: [
                  "RECREATE_DISK",
                  "RECREATE_DISK_IF_SOURCE_CHANGED",
                  "USE_EXISTING_DISK",
                ],
                description:
                  "Specifies which action to take on instance update with this disk. Default\nis to use the existing disk.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels to apply to this disk. These can be later modified by thedisks.setLabels method. This field is only applicable for\npersistent disks.",
              },
              replicaZones: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Required for each regional disk associated with the instance. Specify\nthe URLs of the zones where the disk should be replicated to.\nYou must provide exactly two replica zones, and one zone must be the same\nas the instance zone.",
              },
              diskName: {
                type: "string",
                description:
                  "Specifies the disk name. If not specified, the default is to use the name\nof the instance. If a disk with the same name already exists in the given\nregion, the existing disk is attached to the new instance and the\nnew disk is not created.",
              },
              resourcePolicies: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Resource policies applied to this disk for automatic snapshot creations.\nSpecified using the full or partial URL. For instance template, specify\nonly the resource policy name.",
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
              provisionedThroughput: {
                type: "string",
                description:
                  "Indicates how much throughput to provision for the disk. This sets the\nnumber of throughput mb per second that the disk can handle. Values must\ngreater than or equal to 1. (Format: int64)",
              },
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the disk. Tag keys and values\nhave the same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT\n& PATCH) when empty.",
              },
              licenses: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "A list of publicly visible licenses. Reserved for Google's use.",
              },
              diskSizeGb: {
                type: "string",
                description:
                  "Specifies the size of the disk in base-2 GB. The size must be at least\n10 GB. If you specify a sourceImage, which is required for\nboot disks, the default size is the size of the sourceImage.\nIf you do not specify a sourceImage, the default disk size\nis 500 GB. (Format: int64)",
              },
              sourceSnapshot: {
                type: "string",
                description:
                  "The source snapshot to create this disk. When creating a new instance\nboot disk, one of initializeParams.sourceSnapshot orinitializeParams.sourceImage or disks.source\nis required.\n\nTo create a disk with a snapshot that you created, specify the\nsnapshot name in the following format:\n\nglobal/snapshots/my-backup\n\n\nIf the source snapshot is deleted later, this field will not be set.\n\nNote: You cannot create VMs in bulk using a snapshot as the source. Use\nan image instead when you create VMs using\nthe bulk\ninsert method.",
              },
              storagePool: {
                type: "string",
                description:
                  "The storage pool in which the new disk is created. You can provide\nthis as a partial or full URL to the resource. For example, the following\nare valid values:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/storagePools/storagePool\n     - projects/project/zones/zone/storagePools/storagePool \n   - zones/zone/storagePools/storagePool",
              },
              enableConfidentialCompute: {
                type: "boolean",
                description:
                  "Whether this disk is using confidential compute mode.",
              },
              diskType: {
                type: "string",
                description:
                  "Specifies the disk type to use to create the instance. If not specified,\nthe default is pd-standard, specified using the full URL.\nFor example:\n\nhttps://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/pd-standard\n\n\nFor a full list of acceptable values, seePersistent disk\ntypes. If you specify this field when creating a VM, you can provide\neither the full or partial URL. For example, the following values are\nvalid:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/diskType \n   - projects/project/zones/zone/diskTypes/diskType \n   - zones/zone/diskTypes/diskType\n\n\nIf you specify this field when creating or updating an instance template\nor all-instances configuration, specify the type of the disk, not the\nURL. For example: pd-standard.",
              },
              description: {
                type: "string",
                description:
                  "An optional description. Provide this property when creating the disk.",
              },
              provisionedIops: {
                type: "string",
                description:
                  "Indicates how many IOPS to provision for the disk. This sets the number\nof I/O operations per second that the disk can handle. Values must be\nbetween 10,000 and 120,000. For more details, see theExtreme persistent\ndisk documentation. (Format: int64)",
              },
              sourceImage: {
                type: "string",
                description:
                  "The source image to create this disk. When creating a new instance boot\ndisk, one of initializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source\nis required.\n\nTo create a disk with one of the public operating system\nimages, specify the image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:\n\nprojects/debian-cloud/global/images/family/debian-9\n\n\nAlternatively, use a specific version of a public operating system image:\n\nprojects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD\n\n\nTo create a disk with a custom image that you created, specify the\nimage name in the following format:\n\nglobal/images/my-custom-image\n\n\nYou can also specify a custom image by its image family, which returns\nthe latest version of the image in that family. Replace the image name\nwith family/family-name:\n\nglobal/images/family/my-image-family\n\n\nIf the source image is deleted later, this field will not be set.",
              },
            },
            description:
              "[Input Only] Specifies the parameters for a new disk that will be created\nalongside the new instance. Use initialization parameters to create boot\ndisks or local SSDs attached to the new instance.\n\nThis field is persisted and returned for instanceTemplate and not returned\nin the context of instance.\n\nThis property is mutually exclusive with the source property;\nyou can only define one or the other, but not both.",
            additionalProperties: true,
          },
          required: false,
        },
        autoDelete: {
          name: "Auto Delete",
          description:
            "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
          type: {
            type: "boolean",
            description:
              "Specifies whether the disk will be auto-deleted when the instance is\ndeleted (but not when the disk is detached from the instance).",
          },
          required: false,
        },
        type: {
          name: "Type",
          description:
            "Specifies the type of the disk, either SCRATCH orPERSISTENT.",
          type: {
            type: "string",
            enum: ["PERSISTENT", "SCRATCH"],
            description:
              "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT.",
          },
          required: false,
        },
        shieldedInstanceInitialState: {
          name: "Shielded Instance Initial State",
          description: "[Output Only] shielded vm initial state stored on disk",
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
        diskEncryptionKey: {
          name: "Disk Encryption Key",
          description:
            "Encrypts or decrypts a disk using acustomer-supplied encryption key.",
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
              "A list of features to enable on the guest operating system. Applicable\nonly for bootable images. Read\nEnabling guest operating system features to see a list of available\noptions.",
          },
          required: false,
        },
        index: {
          name: "Index",
          description:
            "[Output Only] A zero-based index to this disk, where 0 is reserved for the boot disk.",
          type: {
            type: "integer",
            description:
              "[Output Only] A zero-based index to this disk, where 0 is reserved for the\nboot disk. If you have many disks attached to an instance, each\ndisk would have a unique index number. (Format: int32)",
          },
          required: false,
        },
        interface: {
          name: "Interface",
          description:
            "Specifies the disk interface to use for attaching this disk, which is either SCSI or NVME.",
          type: {
            type: "string",
            enum: ["NVME", "SCSI"],
            description:
              "Specifies the disk interface to use for attaching this disk, which is\neither SCSI or NVME. For most machine types, the\ndefault is SCSI. Local SSDs can use either NVME or SCSI.\nIn certain configurations, persistent disks can use NVMe. For more\ninformation, seeAbout\npersistent disks.",
          },
          required: false,
        },
        boot: {
          name: "Boot",
          description: "Indicates that this is a boot disk.",
          type: {
            type: "boolean",
            description:
              "Indicates that this is a boot disk. The virtual machine will use the first\npartition of the disk for its root filesystem.",
          },
          required: false,
        },
        deviceName: {
          name: "Device Name",
          description:
            "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system running within the instance.",
          type: {
            type: "string",
            description:
              "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system\nrunning within the instance. This name can be used to reference the device\nfor mounting, resizing, and so on, from within the instance.\n\nIf not specified, the server chooses a default device name to apply to this\ndisk, in the form persistent-disk-x, where x is a number\nassigned by Google Compute Engine. This field is only applicable for\npersistent disks.",
          },
          required: false,
        },
        mode: {
          name: "Mode",
          description:
            "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY.",
          type: {
            type: "string",
            enum: ["READ_ONLY", "READ_WRITE"],
            description:
              "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk\nin READ_WRITE mode.",
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
        let path = `projects/{project}/zones/{zone}/instances/{instance}/attachDisk`;

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

        if (input.event.inputConfig.savedState !== undefined)
          requestBody.savedState = input.event.inputConfig.savedState;
        if (input.event.inputConfig.diskSizeGb !== undefined)
          requestBody.diskSizeGb = input.event.inputConfig.diskSizeGb;
        if (input.event.inputConfig.architecture !== undefined)
          requestBody.architecture = input.event.inputConfig.architecture;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.source !== undefined)
          requestBody.source = input.event.inputConfig.source;
        if (input.event.inputConfig.licenses !== undefined)
          requestBody.licenses = input.event.inputConfig.licenses;
        if (input.event.inputConfig.initializeParams !== undefined)
          requestBody.initializeParams =
            input.event.inputConfig.initializeParams;
        if (input.event.inputConfig.autoDelete !== undefined)
          requestBody.autoDelete = input.event.inputConfig.autoDelete;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;
        if (input.event.inputConfig.shieldedInstanceInitialState !== undefined)
          requestBody.shieldedInstanceInitialState =
            input.event.inputConfig.shieldedInstanceInitialState;
        if (input.event.inputConfig.diskEncryptionKey !== undefined)
          requestBody.diskEncryptionKey =
            input.event.inputConfig.diskEncryptionKey;
        if (input.event.inputConfig.guestOsFeatures !== undefined)
          requestBody.guestOsFeatures = input.event.inputConfig.guestOsFeatures;
        if (input.event.inputConfig.index !== undefined)
          requestBody.index = input.event.inputConfig.index;
        if (input.event.inputConfig.interface !== undefined)
          requestBody.interface = input.event.inputConfig.interface;
        if (input.event.inputConfig.boot !== undefined)
          requestBody.boot = input.event.inputConfig.boot;
        if (input.event.inputConfig.deviceName !== undefined)
          requestBody.deviceName = input.event.inputConfig.deviceName;
        if (input.event.inputConfig.mode !== undefined)
          requestBody.mode = input.event.inputConfig.mode;
        if (input.event.inputConfig.forceAttach !== undefined)
          requestBody.forceAttach = input.event.inputConfig.forceAttach;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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

export default instancesAttachDisk;
