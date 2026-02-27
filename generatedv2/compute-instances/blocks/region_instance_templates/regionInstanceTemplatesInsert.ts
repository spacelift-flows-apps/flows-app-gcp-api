import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const regionInstanceTemplatesInsert: AppBlock = {
  name: "Region Instance Templates - Insert",
  description: `Creates a wire group in the specified project in the given scope using the parameters that are included in the request.`,
  category: "Region Instance Templates",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description:
            "Output only. [Output Only] URL of the region where the instance template resides. Only applicable for regional resources.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the instance template resides. Only applicable for regional resources.",
          },
          required: false,
        },
        creationTimestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] The creation timestamp for this instance template inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The creation timestamp for this instance template inRFC3339 text format.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description:
            "An optional description of this resource. Provide this property when you create the resource.",
          type: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] A unique identifier for this instance template. The server defines this identifier.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] The resource type, which is alwayscompute#instanceTemplate for instance templates.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The resource type, which is alwayscompute#instanceTemplate for instance templates.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        properties: {
          name: "Properties",
          description: "The instance properties for this instance template.",
          type: {
            type: "object",
            properties: {
              advancedMachineFeatures: {
                type: "object",
                properties: {
                  enableNestedVirtualization: {
                    type: "boolean",
                    description:
                      "Whether to enable nested virtualization or not (default is false).",
                  },
                  enableUefiNetworking: {
                    type: "boolean",
                    description:
                      "Whether to enable UEFI networking for instance creation.",
                  },
                  performanceMonitoringUnit: {
                    type: "string",
                    enum: [
                      "UNDEFINED_PERFORMANCE_MONITORING_UNIT",
                      "ARCHITECTURAL",
                      "ENHANCED",
                      "PERFORMANCE_MONITORING_UNIT_UNSPECIFIED",
                      "STANDARD",
                    ],
                    description:
                      "Type of Performance Monitoring Unit requested on instance. Check the PerformanceMonitoringUnit enum for the list of possible values.",
                  },
                  threadsPerCore: {
                    type: "integer",
                    description:
                      "The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed.",
                  },
                  turboMode: {
                    type: "string",
                    description:
                      "Turbo frequency mode to use for the instance. Supported modes include: * ALL_CORE_MAX  Using empty string or not setting this field will use the platform-specific default turbo mode.",
                  },
                  visibleCoreCount: {
                    type: "integer",
                    description:
                      "The number of physical cores to expose to an instance. Multiply by the number of threads per core to compute the total number of virtual CPUs to expose to the instance. If unset, the number of cores is inferred from the instance's nominal CPU count and the underlying platform's SMT width.",
                  },
                },
                description:
                  "Specifies options for controlling advanced machine features. Options that would traditionally be configured in a BIOS belong here. Features that require operating system support may have corresponding entries in the GuestOsFeatures of anImage (e.g., whether or not the OS in theImage supports nested virtualization being enabled or disabled).",
                additionalProperties: true,
              },
              canIpForward: {
                type: "boolean",
                description:
                  "Enables instances created based on these properties to send packets with source IP addresses other than their own and receive packets with destination IP addresses other than their own. If these instances will be used as an IP gateway or it will be set as the next-hop in a Route resource, specify true. If unsure, leave this set tofalse. See theEnable IP forwarding documentation for more information.",
              },
              confidentialInstanceConfig: {
                type: "object",
                properties: {
                  confidentialInstanceType: {
                    type: "string",
                    enum: [
                      "UNDEFINED_CONFIDENTIAL_INSTANCE_TYPE",
                      "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
                      "SEV",
                      "SEV_SNP",
                      "TDX",
                    ],
                    description:
                      "Defines the type of technology used by the confidential instance. Check the ConfidentialInstanceType enum for the list of possible values.",
                  },
                  enableConfidentialCompute: {
                    type: "boolean",
                    description:
                      "Defines whether the instance should have confidential compute enabled.",
                  },
                },
                description: "A set of Confidential Instance options.",
                additionalProperties: true,
              },
              description: {
                type: "string",
                description:
                  "An optional text description for the instances that are created from these properties.",
              },
              disks: {
                type: "array",
                items: {
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
                        "Output only. [Output Only] The architecture of the attached disk. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
                    },
                    autoDelete: {
                      type: "boolean",
                      description:
                        "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
                    },
                    boot: {
                      type: "boolean",
                      description:
                        "Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.",
                    },
                    deviceName: {
                      type: "string",
                      description:
                        "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system running within the instance. This name can be used to reference the device for mounting, resizing, and so on, from within the instance.  If not specified, the server chooses a default device name to apply to this disk, in the form persistent-disk-x, where x is a number assigned by Google Compute Engine. This field is only applicable for persistent disks.",
                    },
                    diskEncryptionKey: {
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
                        "Encrypts or decrypts a disk using acustomer-supplied encryption key.  If you are creating a new disk, this field encrypts the new disk using an encryption key that you provide. If you are attaching an existing disk that is already encrypted, this field decrypts the disk using the customer-supplied encryption key.  If you encrypt a disk using a customer-supplied key, you must provide the same key again when you attempt to use this resource at a later time. For example, you must provide the key when you create a snapshot or an image from the disk or when you attach the disk to a virtual machine instance.  If you do not provide an encryption key, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later.  Note:  Instance templates do not storecustomer-supplied encryption keys, so you cannot use your own keys to encrypt disks in amanaged instance group.  You cannot create VMs that have disks with customer-supplied keys using the bulk insert method.",
                    },
                    diskSizeGb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    forceAttach: {
                      type: "boolean",
                      description:
                        "[Input Only] Whether to force attach the regional disk even if it's currently attached to another instance. If you try to force attach a zonal disk to an instance, you will receive an error.",
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
                        "A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
                    },
                    index: {
                      type: "integer",
                      description:
                        "Output only. [Output Only] A zero-based index to this disk, where 0 is reserved for the boot disk. If you have many disks attached to an instance, each disk would have a unique index number.",
                    },
                    initializeParams: {
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
                            "The architecture of the attached disk. Valid values are arm64 or x86_64. Check the Architecture enum for the list of possible values.",
                        },
                        description: {
                          type: "string",
                          description:
                            "An optional description. Provide this property when creating the disk.",
                        },
                        diskName: {
                          type: "string",
                          description:
                            "Specifies the disk name. If not specified, the default is to use the name of the instance. If a disk with the same name already exists in the given region, the existing disk is attached to the new instance and the new disk is not created.",
                        },
                        diskSizeGb: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        diskType: {
                          type: "string",
                          description:
                            "Specifies the disk type to use to create the instance. If not specified, the default is pd-standard, specified using the full URL. For example:  https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/pd-standard   For a full list of acceptable values, seePersistent disk types. If you specify this field when creating a VM, you can provide either the full or partial URL. For example, the following values are valid:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/diskType    - projects/project/zones/zone/diskTypes/diskType    - zones/zone/diskTypes/diskType   If you specify this field when creating or updating an instance template or all-instances configuration, specify the type of the disk, not the URL. For example: pd-standard.",
                        },
                        enableConfidentialCompute: {
                          type: "boolean",
                          description:
                            "Whether this disk is using confidential compute mode.",
                        },
                        labels: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Labels to apply to this disk. These can be later modified by thedisks.setLabels method. This field is only applicable for persistent disks.",
                        },
                        licenses: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "A list of publicly visible licenses. Reserved for Google's use.",
                        },
                        onUpdateAction: {
                          type: "string",
                          enum: [
                            "UNDEFINED_ON_UPDATE_ACTION",
                            "RECREATE_DISK",
                            "RECREATE_DISK_IF_SOURCE_CHANGED",
                            "USE_EXISTING_DISK",
                          ],
                          description:
                            "Specifies which action to take on instance update with this disk. Default is to use the existing disk. Check the OnUpdateAction enum for the list of possible values.",
                        },
                        provisionedIops: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        provisionedThroughput: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        replicaZones: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Required for each regional disk associated with the instance. Specify the URLs of the zones where the disk should be replicated to. You must provide exactly two replica zones, and one zone must be the same as the instance zone.",
                        },
                        resourceManagerTags: {
                          type: "object",
                          additionalProperties: {
                            type: "string",
                          },
                          description:
                            "Resource manager tags to be bound to the disk. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
                        },
                        resourcePolicies: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Resource policies applied to this disk for automatic snapshot creations. Specified using the full or partial URL. For instance template, specify only the resource policy name.",
                        },
                        sourceImage: {
                          type: "string",
                          description:
                            "The source image to create this disk. When creating a new instance boot disk, one of initializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required.  To create a disk with one of the public operating system images, specify the image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:  projects/debian-cloud/global/images/family/debian-9   Alternatively, use a specific version of a public operating system image:  projects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD   To create a disk with a custom image that you created, specify the image name in the following format:  global/images/my-custom-image   You can also specify a custom image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:  global/images/family/my-image-family   If the source image is deleted later, this field will not be set.",
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
                            "Thecustomer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.  InstanceTemplate and InstancePropertiesPatch do not storecustomer-supplied encryption keys, so you cannot create disks for instances in a managed instance group if the source images are encrypted with your own keys.",
                        },
                        sourceSnapshot: {
                          type: "string",
                          description:
                            "The source snapshot to create this disk. When creating a new instance boot disk, one of initializeParams.sourceSnapshot orinitializeParams.sourceImage or disks.source is required.  To create a disk with a snapshot that you created, specify the snapshot name in the following format:  global/snapshots/my-backup   If the source snapshot is deleted later, this field will not be set.  Note: You cannot create VMs in bulk using a snapshot as the source. Use an image instead when you create VMs using the bulk insert method.",
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
                            "Thecustomer-supplied encryption key of the source snapshot.",
                        },
                        storagePool: {
                          type: "string",
                          description:
                            "The storage pool in which the new disk is created. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/storagePools/storagePool      - projects/project/zones/zone/storagePools/storagePool    - zones/zone/storagePools/storagePool",
                        },
                      },
                      description:
                        "[Input Only] Specifies the parameters for a new disk that will be created alongside the new instance. Use initialization parameters to create boot disks or local SSDs attached to the new instance.  This field is persisted and returned for instanceTemplate and not returned in the context of instance.  This property is mutually exclusive with the source property; you can only define one or the other, but not both.",
                      additionalProperties: true,
                    },
                    interface: {
                      type: "string",
                      enum: ["UNDEFINED_INTERFACE", "NVME", "SCSI"],
                      description:
                        "Specifies the disk interface to use for attaching this disk, which is either SCSI or NVME. For most machine types, the default is SCSI. Local SSDs can use either NVME or SCSI. In certain configurations, persistent disks can use NVMe. For more information, seeAbout persistent disks. Check the Interface enum for the list of possible values.",
                    },
                    kind: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Type of the resource. Alwayscompute#attachedDisk for attached disks.",
                    },
                    licenses: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Output only. [Output Only] Any valid publicly visible licenses.",
                    },
                    mode: {
                      type: "string",
                      enum: ["UNDEFINED_MODE", "READ_ONLY", "READ_WRITE"],
                      description:
                        "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk in READ_WRITE mode. Check the Mode enum for the list of possible values.",
                    },
                    savedState: {
                      type: "string",
                      enum: [
                        "UNDEFINED_SAVED_STATE",
                        "DISK_SAVED_STATE_UNSPECIFIED",
                        "PRESERVED",
                      ],
                      description:
                        "Output only. For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this field is set to PRESERVED if the LocalSSD data has been saved to a persistent location by customer request.  (see the discard_local_ssd option on Stop/Suspend). Read-only in the api. Check the SavedState enum for the list of possible values.",
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
                                description:
                                  "The raw content in the secure keys file.",
                              },
                              fileType: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_FILE_TYPE",
                                  "BIN",
                                  "UNDEFINED",
                                  "X509",
                                ],
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
                                description:
                                  "The raw content in the secure keys file.",
                              },
                              fileType: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_FILE_TYPE",
                                  "BIN",
                                  "UNDEFINED",
                                  "X509",
                                ],
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
                                description:
                                  "The raw content in the secure keys file.",
                              },
                              fileType: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_FILE_TYPE",
                                  "BIN",
                                  "UNDEFINED",
                                  "X509",
                                ],
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
                              description:
                                "The raw content in the secure keys file.",
                            },
                            fileType: {
                              type: "string",
                              enum: [
                                "UNDEFINED_FILE_TYPE",
                                "BIN",
                                "UNDEFINED",
                                "X509",
                              ],
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
                    source: {
                      type: "string",
                      description:
                        "Specifies a valid partial or full URL to an existing Persistent Disk resource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required.  If desired, you can also attach existing non-root persistent disks using this property. This field is only applicable for persistent disks.  Note that for InstanceTemplate, specify the disk name for zonal disk, and the URL for regional disk.",
                    },
                    type: {
                      type: "string",
                      enum: ["UNDEFINED_TYPE", "PERSISTENT", "SCRATCH"],
                      description:
                        "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT. Check the Type enum for the list of possible values.",
                    },
                  },
                  description: "An instance-attached disk resource.",
                  additionalProperties: true,
                },
                description:
                  "An array of disks that are associated with the instances that are created from these properties.",
              },
              guestAccelerators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    acceleratorCount: {
                      type: "integer",
                      description:
                        "The number of the guest accelerator cards exposed to this instance.",
                    },
                    acceleratorType: {
                      type: "string",
                      description:
                        "Full or partial URL of the accelerator type resource to attach to this instance. For example:projects/my-project/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p100 If you are creating an instance template, specify only the accelerator name. See GPUs on Compute Engine for a full list of accelerator types.",
                    },
                  },
                  description:
                    "A specification of the type and number of accelerator cards attached to the instance.",
                  additionalProperties: true,
                },
                description:
                  "A list of guest accelerator cards' type and count to use for instances created from these properties.",
              },
              keyRevocationActionType: {
                type: "string",
                enum: [
                  "UNDEFINED_KEY_REVOCATION_ACTION_TYPE",
                  "KEY_REVOCATION_ACTION_TYPE_UNSPECIFIED",
                  "NONE",
                  "STOP",
                ],
                description:
                  'KeyRevocationActionType of the instance. Supported options are "STOP" and "NONE". The default value is "NONE" if it is not specified. Check the KeyRevocationActionType enum for the list of possible values.',
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels to apply to instances that are created from these properties.",
              },
              machineType: {
                type: "string",
                description:
                  "The machine type to use for instances that are created from these properties. This field only accepts a machine type name, for example `n2-standard-4`. If you use the machine type full or partial URL, for example `projects/my-l7ilb-project/zones/us-central1-a/machineTypes/n2-standard-4`, the request will result in an `INTERNAL_ERROR`.",
              },
              metadata: {
                type: "object",
                properties: {
                  fingerprint: {
                    type: "string",
                    description:
                      "Specifies a fingerprint for this request, which is essentially a hash of the metadata's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update metadata. You must always provide an up-to-date fingerprint hash in order to update or change metadata, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve the resource.",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        key: {
                          type: "string",
                          description:
                            "Key for the metadata entry. Keys must conform to the following regexp: [a-zA-Z0-9-_]+, and be less than 128 bytes in length. This is reflected as part of a URL in the metadata server. Additionally, to avoid ambiguity, keys must not conflict with any other metadata keys for the project.",
                        },
                        value: {
                          type: "string",
                          description:
                            "Value for the metadata entry. These are free-form strings, and only have meaning as interpreted by the image running in the instance. The only restriction placed on values is that their size must be less than or equal to 262144 bytes (256 KiB).",
                        },
                      },
                      description: "Metadata",
                      additionalProperties: true,
                    },
                    description:
                      "Array of key/value pairs. The total size of all keys and values must be less than 512 KB.",
                  },
                  kind: {
                    type: "string",
                    description:
                      "Output only. [Output Only] Type of the resource. Always compute#metadata for metadata.",
                  },
                },
                description: "A metadata key/value entry.",
                additionalProperties: true,
              },
              minCpuPlatform: {
                type: "string",
                description:
                  'Minimum cpu/platform to be used by instances. The instance may be scheduled on the specified or newer cpu/platform. Applicable values are the friendly names of CPU platforms, such asminCpuPlatform: "Intel Haswell" orminCpuPlatform: "Intel Sandy Bridge". For more information, read Specifying a Minimum CPU Platform.',
              },
              networkInterfaces: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    accessConfigs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          externalIpv6: {
                            type: "string",
                            description:
                              "Applies to ipv6AccessConfigs only. The first IPv6 address of the external IPv6 range associated with this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To use a static external IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an external IPv6 address from the instance's subnetwork.",
                          },
                          externalIpv6PrefixLength: {
                            type: "integer",
                            description:
                              "Applies to ipv6AccessConfigs only. The prefix length of the external IPv6 range.",
                          },
                          kind: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Type of the resource. Alwayscompute#accessConfig for access configs.",
                          },
                          name: {
                            type: "string",
                            description:
                              "The name of this access configuration. In accessConfigs (IPv4), the default and recommended name is External NAT, but you can use any arbitrary string, such as My external IP orNetwork Access. In ipv6AccessConfigs, the recommend name is External IPv6.",
                          },
                          natIP: {
                            type: "string",
                            description:
                              "Applies to accessConfigs (IPv4) only. Anexternal IP address associated with this instance. Specify an unused static external IP address available to the project or leave this field undefined to use an IP from a shared ephemeral IP address pool. If you specify a static external IP address, it must live in the same region as the zone of the instance.",
                          },
                          networkTier: {
                            type: "string",
                            enum: [
                              "UNDEFINED_NETWORK_TIER",
                              "FIXED_STANDARD",
                              "PREMIUM",
                              "STANDARD",
                              "STANDARD_OVERRIDES_FIXED_STANDARD",
                            ],
                            description:
                              "This signifies the networking tier used for configuring this access configuration and can only take the following values: PREMIUM,STANDARD.  If an AccessConfig is specified without a valid external IP address, an ephemeral IP will be created with this networkTier.  If an AccessConfig with a valid external IP address is specified, it must match that of the networkTier associated with the Address resource owning that IP. Check the NetworkTier enum for the list of possible values.",
                          },
                          publicPtrDomainName: {
                            type: "string",
                            description:
                              "The DNS domain name for the public PTR record.  You can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for first IP in associated external IPv6 range.",
                          },
                          securityPolicy: {
                            type: "string",
                            description:
                              "The resource URL for the security policy associated with this access config.",
                          },
                          setPublicPtr: {
                            type: "boolean",
                            description:
                              "Specifies whether a public DNS 'PTR' record should be created to map the external IP address of the instance to a DNS domain name.  This field is not used in ipv6AccessConfig. A default PTR record will be created if the VM has external IPv6 range associated.",
                          },
                          type: {
                            type: "string",
                            enum: [
                              "UNDEFINED_TYPE",
                              "DIRECT_IPV6",
                              "ONE_TO_ONE_NAT",
                            ],
                            description:
                              "The type of configuration. In accessConfigs (IPv4), the default and only option is ONE_TO_ONE_NAT. Inipv6AccessConfigs, the default and only option isDIRECT_IPV6. Check the Type enum for the list of possible values.",
                          },
                        },
                        description:
                          "An access configuration attached to an instance's network interface. Only one access config per instance is supported.",
                        additionalProperties: true,
                      },
                      description:
                        "An array of configurations for this interface. Currently, only one access config, ONE_TO_ONE_NAT, is supported. If there are noaccessConfigs specified, then this instance will have no external internet access.",
                    },
                    aliasIpRanges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          ipCidrRange: {
                            type: "string",
                            description:
                              "The IP alias ranges to allocate for this interface. This IP CIDR range must belong to the specified subnetwork and cannot contain IP addresses reserved by system or used by other network interfaces. This range may be a single IP address (such as 10.2.3.4), a netmask (such as/24) or a CIDR-formatted string (such as10.1.2.0/24).",
                          },
                          subnetworkRangeName: {
                            type: "string",
                            description:
                              "The name of a subnetwork secondary IP range from which to allocate an IP alias range. If not specified, the primary range of the subnetwork is used.",
                          },
                        },
                        description:
                          "An alias IP range attached to an instance's network interface.",
                        additionalProperties: true,
                      },
                      description:
                        "An array of alias IP ranges for this network interface. You can only specify this field for network interfaces in VPC networks.",
                    },
                    fingerprint: {
                      type: "string",
                      description:
                        "Fingerprint hash of contents stored in this network interface. This field will be ignored when inserting an Instance or adding a NetworkInterface. An up-to-date fingerprint must be provided in order to update theNetworkInterface. The request will fail with error400 Bad Request if the fingerprint is not provided, or412 Precondition Failed if the fingerprint is out of date.",
                    },
                    igmpQuery: {
                      type: "string",
                      enum: [
                        "UNDEFINED_IGMP_QUERY",
                        "IGMP_QUERY_DISABLED",
                        "IGMP_QUERY_V2",
                      ],
                      description:
                        "Indicate whether igmp query is enabled on the network interface or not. If enabled, also indicates the version of IGMP supported. Check the IgmpQuery enum for the list of possible values.",
                    },
                    internalIpv6PrefixLength: {
                      type: "integer",
                      description:
                        "The prefix length of the primary internal IPv6 range.",
                    },
                    ipv6AccessConfigs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          externalIpv6: {
                            type: "string",
                            description:
                              "Applies to ipv6AccessConfigs only. The first IPv6 address of the external IPv6 range associated with this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To use a static external IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an external IPv6 address from the instance's subnetwork.",
                          },
                          externalIpv6PrefixLength: {
                            type: "integer",
                            description:
                              "Applies to ipv6AccessConfigs only. The prefix length of the external IPv6 range.",
                          },
                          kind: {
                            type: "string",
                            description:
                              "Output only. [Output Only] Type of the resource. Alwayscompute#accessConfig for access configs.",
                          },
                          name: {
                            type: "string",
                            description:
                              "The name of this access configuration. In accessConfigs (IPv4), the default and recommended name is External NAT, but you can use any arbitrary string, such as My external IP orNetwork Access. In ipv6AccessConfigs, the recommend name is External IPv6.",
                          },
                          natIP: {
                            type: "string",
                            description:
                              "Applies to accessConfigs (IPv4) only. Anexternal IP address associated with this instance. Specify an unused static external IP address available to the project or leave this field undefined to use an IP from a shared ephemeral IP address pool. If you specify a static external IP address, it must live in the same region as the zone of the instance.",
                          },
                          networkTier: {
                            type: "string",
                            enum: [
                              "UNDEFINED_NETWORK_TIER",
                              "FIXED_STANDARD",
                              "PREMIUM",
                              "STANDARD",
                              "STANDARD_OVERRIDES_FIXED_STANDARD",
                            ],
                            description:
                              "This signifies the networking tier used for configuring this access configuration and can only take the following values: PREMIUM,STANDARD.  If an AccessConfig is specified without a valid external IP address, an ephemeral IP will be created with this networkTier.  If an AccessConfig with a valid external IP address is specified, it must match that of the networkTier associated with the Address resource owning that IP. Check the NetworkTier enum for the list of possible values.",
                          },
                          publicPtrDomainName: {
                            type: "string",
                            description:
                              "The DNS domain name for the public PTR record.  You can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for first IP in associated external IPv6 range.",
                          },
                          securityPolicy: {
                            type: "string",
                            description:
                              "The resource URL for the security policy associated with this access config.",
                          },
                          setPublicPtr: {
                            type: "boolean",
                            description:
                              "Specifies whether a public DNS 'PTR' record should be created to map the external IP address of the instance to a DNS domain name.  This field is not used in ipv6AccessConfig. A default PTR record will be created if the VM has external IPv6 range associated.",
                          },
                          type: {
                            type: "string",
                            enum: [
                              "UNDEFINED_TYPE",
                              "DIRECT_IPV6",
                              "ONE_TO_ONE_NAT",
                            ],
                            description:
                              "The type of configuration. In accessConfigs (IPv4), the default and only option is ONE_TO_ONE_NAT. Inipv6AccessConfigs, the default and only option isDIRECT_IPV6. Check the Type enum for the list of possible values.",
                          },
                        },
                        description:
                          "An access configuration attached to an instance's network interface. Only one access config per instance is supported.",
                        additionalProperties: true,
                      },
                      description:
                        "An array of IPv6 access configurations for this interface. Currently, only one IPv6 access config, DIRECT_IPV6, is supported. If there is no ipv6AccessConfig specified, then this instance will have no external IPv6 Internet access.",
                    },
                    ipv6AccessType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_IPV6_ACCESS_TYPE",
                        "EXTERNAL",
                        "INTERNAL",
                        "UNSPECIFIED_IPV6_ACCESS_TYPE",
                      ],
                      description:
                        "Output only. [Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be accessed from the Internet. This field is always inherited from its subnetwork.  Valid only if stackType is IPV4_IPV6. Check the Ipv6AccessType enum for the list of possible values.",
                    },
                    ipv6Address: {
                      type: "string",
                      description:
                        "An IPv6 internal network address for this network interface. To use a static internal IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an internal IPv6 address from the instance's subnetwork.",
                    },
                    kind: {
                      type: "string",
                      description:
                        "Output only. [Output Only] Type of the resource. Alwayscompute#networkInterface for network interfaces.",
                    },
                    name: {
                      type: "string",
                      description:
                        "[Output Only] The name of the network interface, which is generated by the server. For a VM, the network interface uses the nicN naming format. Where N is a value between 0 and7. The default interface value is nic0.",
                    },
                    network: {
                      type: "string",
                      description:
                        "URL of the VPC network resource for this instance. When creating an instance, if neither the network nor the subnetwork is specified, the default network global/networks/default is used. If the selected project doesn't have the default network, you must specify a network or subnet. If the network is not specified but the subnetwork is specified, the network is inferred.  If you specify this property, you can specify the network as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/global/networks/network       - projects/project/global/networks/network       - global/networks/default",
                    },
                    networkAttachment: {
                      type: "string",
                      description:
                        "The URL of the network attachment that this interface should connect to in the following format: projects/{project_number}/regions/{region_name}/networkAttachments/{network_attachment_name}.",
                    },
                    networkIP: {
                      type: "string",
                      description:
                        "An IPv4 internal IP address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.",
                    },
                    nicType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_NIC_TYPE",
                        "GVNIC",
                        "IDPF",
                        "IRDMA",
                        "MRDMA",
                        "UNSPECIFIED_NIC_TYPE",
                        "VIRTIO_NET",
                      ],
                      description:
                        "The type of vNIC to be used on this interface. This may be gVNIC or VirtioNet. Check the NicType enum for the list of possible values.",
                    },
                    parentNicName: {
                      type: "string",
                      description:
                        "Name of the parent network interface of a dynamic network interface.",
                    },
                    queueCount: {
                      type: "integer",
                      description:
                        "The networking queue count that's specified by users for the network interface. Both Rx and Tx queues will be set to this number. It'll be empty if not specified by the users.",
                    },
                    stackType: {
                      type: "string",
                      enum: [
                        "UNDEFINED_STACK_TYPE",
                        "IPV4_IPV6",
                        "IPV4_ONLY",
                        "IPV6_ONLY",
                        "UNSPECIFIED_STACK_TYPE",
                      ],
                      description:
                        "The stack type for this network interface. To assign only IPv4 addresses, use IPV4_ONLY. To assign both IPv4 and IPv6 addresses, useIPV4_IPV6. If not specified, IPV4_ONLY is used.  This field can be both set at instance creation and update network interface operations. Check the StackType enum for the list of possible values.",
                    },
                    subnetwork: {
                      type: "string",
                      description:
                        "The URL of the Subnetwork resource for this instance. If the network resource is inlegacy mode, do not specify this field. If the network is in auto subnet mode, specifying the subnetwork is optional. If the network is in custom subnet mode, specifying the subnetwork is required. If you specify this field, you can specify the subnetwork as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/subnetworks/subnetwork    - regions/region/subnetworks/subnetwork",
                    },
                    vlan: {
                      type: "integer",
                      description:
                        "VLAN tag of a dynamic network interface, must be  an integer in the range from 2 to 255 inclusively.",
                    },
                  },
                  description:
                    "A network interface resource attached to an instance.",
                  additionalProperties: true,
                },
                description:
                  "An array of network access configurations for this interface.",
              },
              networkPerformanceConfig: {
                type: "object",
                properties: {
                  totalEgressBandwidthTier: {
                    type: "string",
                    enum: [
                      "UNDEFINED_TOTAL_EGRESS_BANDWIDTH_TIER",
                      "DEFAULT",
                      "TIER_1",
                    ],
                    description:
                      "Check the TotalEgressBandwidthTier enum for the list of possible values.",
                  },
                },
                additionalProperties: true,
                description:
                  "Note that for MachineImage, this is not supported yet.",
              },
              privateIpv6GoogleAccess: {
                type: "string",
                enum: [
                  "UNDEFINED_PRIVATE_IPV6_GOOGLE_ACCESS",
                  "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
                  "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
                  "INHERIT_FROM_SUBNETWORK",
                ],
                description:
                  "The private IPv6 google access type for VMs. If not specified, use  INHERIT_FROM_SUBNETWORK as default. Note that for MachineImage, this is not supported yet. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
              },
              reservationAffinity: {
                type: "object",
                properties: {
                  consumeReservationType: {
                    type: "string",
                    enum: [
                      "UNDEFINED_CONSUME_RESERVATION_TYPE",
                      "ANY_RESERVATION",
                      "NO_RESERVATION",
                      "SPECIFIC_RESERVATION",
                      "UNSPECIFIED",
                    ],
                    description:
                      "Specifies the type of reservation from which this instance can consume resources: ANY_RESERVATION (default),SPECIFIC_RESERVATION, or NO_RESERVATION. See Consuming reserved instances for examples. Check the ConsumeReservationType enum for the list of possible values.",
                  },
                  key: {
                    type: "string",
                    description:
                      "Corresponds to the label key of a reservation resource. To target aSPECIFIC_RESERVATION by name, specifygoogleapis.com/reservation-name as the key and specify the name of your reservation as its value.",
                  },
                  values: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      'Corresponds to the label values of a reservation resource. This can be either a name to a reservation in the same project or "projects/different-project/reservations/some-reservation-name" to target a shared reservation in the same zone but in a different project.',
                  },
                },
                description:
                  "Specifies the reservations that this instance can consume from.",
                additionalProperties: true,
              },
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the instance. Tag keys and values have the same definition as resource manager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and values are in the format `tagValues/456`. The field is ignored (both PUT & PATCH) when empty.",
              },
              resourcePolicies: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Resource policies (names, not URLs) applied to instances created from these properties. Note that for MachineImage, this is not supported yet.",
              },
              scheduling: {
                type: "object",
                properties: {
                  automaticRestart: {
                    type: "boolean",
                    description:
                      "Specifies whether the instance should be automatically restarted if it is terminated by Compute Engine (not terminated by a user). You can only set the automatic restart option for standard instances.Preemptible instances cannot be automatically restarted.  By default, this is set to true so an instance is automatically restarted if it is terminated by Compute Engine.",
                  },
                  availabilityDomain: {
                    type: "integer",
                    description:
                      "Specifies the availability domain to place the instance in. The value must be a number between 1 and the number of availability domains specified in the spread placement policy attached to the instance.",
                  },
                  hostErrorTimeoutSeconds: {
                    type: "integer",
                    description:
                      "Specify the time in seconds for host error detection, the value must be within the range of [90, 330] with the increment of 30, if unset, the default behavior of host error recovery will be used.",
                  },
                  instanceTerminationAction: {
                    type: "string",
                    enum: [
                      "UNDEFINED_INSTANCE_TERMINATION_ACTION",
                      "DELETE",
                      "INSTANCE_TERMINATION_ACTION_UNSPECIFIED",
                      "STOP",
                    ],
                    description:
                      "Specifies the termination action for the instance. Check the InstanceTerminationAction enum for the list of possible values.",
                  },
                  localSsdRecoveryTimeout: {
                    type: "object",
                    properties: {
                      nanos: {
                        type: "integer",
                        description:
                          "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                      },
                      seconds: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    description:
                      'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                    additionalProperties: true,
                  },
                  locationHint: {
                    type: "string",
                    description:
                      "An opaque location hint used to place the instance close to other resources. This field is for use by internal tools that use the public API.",
                  },
                  maxRunDuration: {
                    type: "object",
                    properties: {
                      nanos: {
                        type: "integer",
                        description:
                          "Span of time that's a fraction of a second at nanosecond resolution. Durations less than one second are represented with a 0 `seconds` field and a positive `nanos` field. Must be from 0 to 999,999,999 inclusive.",
                      },
                      seconds: {
                        type: "string",
                        description: "64-bit integer as string",
                      },
                    },
                    description:
                      'A Duration represents a fixed-length span of time represented as a count of seconds and fractions of seconds at nanosecond resolution. It is independent of any calendar and concepts like "day" or "month". Range is approximately 10,000 years.',
                    additionalProperties: true,
                  },
                  minNodeCpus: {
                    type: "integer",
                    description:
                      "The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node.",
                  },
                  nodeAffinities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        key: {
                          type: "string",
                          description:
                            "Corresponds to the label key of Node resource.",
                        },
                        operator: {
                          type: "string",
                          enum: [
                            "UNDEFINED_OPERATOR",
                            "IN",
                            "NOT_IN",
                            "OPERATOR_UNSPECIFIED",
                          ],
                          description:
                            "Defines the operation of node selection. Valid operators areIN for affinity and NOT_IN for anti-affinity. Check the Operator enum for the list of possible values.",
                        },
                        values: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                          description:
                            "Corresponds to the label values of Node resource.",
                        },
                      },
                      description:
                        "Node Affinity: the configuration of desired nodes onto which this Instance  could be scheduled.",
                      additionalProperties: true,
                    },
                    description:
                      "A set of node affinity and anti-affinity configurations. Refer toConfiguring node affinity for more information. Overrides reservationAffinity.",
                  },
                  onHostMaintenance: {
                    type: "string",
                    enum: [
                      "UNDEFINED_ON_HOST_MAINTENANCE",
                      "MIGRATE",
                      "TERMINATE",
                    ],
                    description:
                      "Defines the maintenance behavior for this instance. For standard instances, the default behavior is MIGRATE. Forpreemptible instances, the default and only possible behavior is TERMINATE. For more information, see  Set  VM host maintenance policy. Check the OnHostMaintenance enum for the list of possible values.",
                  },
                  onInstanceStopAction: {
                    type: "object",
                    properties: {
                      discardLocalSsd: {
                        type: "boolean",
                        description:
                          "If true, the contents of any attached Local SSD disks will be discarded else, the Local SSD data will be preserved when the instance is stopped at the end of the run duration/termination time.",
                      },
                    },
                    description:
                      "Defines the behaviour for instances with the instance_termination_actionSTOP.",
                    additionalProperties: true,
                  },
                  preemptible: {
                    type: "boolean",
                    description:
                      "Defines whether the instance is preemptible. This can only be set during instance creation or while the instance isstopped and therefore, in a `TERMINATED` state. SeeInstance Life Cycle for more information on the possible instance states.",
                  },
                  provisioningModel: {
                    type: "string",
                    enum: [
                      "UNDEFINED_PROVISIONING_MODEL",
                      "FLEX_START",
                      "RESERVATION_BOUND",
                      "SPOT",
                      "STANDARD",
                    ],
                    description:
                      "Specifies the provisioning model of the instance. Check the ProvisioningModel enum for the list of possible values.",
                  },
                  skipGuestOsShutdown: {
                    type: "boolean",
                    description:
                      "Default is false and there will be 120 seconds between GCE ACPI G2 Soft Off and ACPI G3 Mechanical Off for Standard VMs and 30 seconds for Spot VMs.",
                  },
                  terminationTime: {
                    type: "string",
                    description:
                      "Specifies the timestamp, when the instance will be terminated, inRFC3339 text format. If specified, the instance termination action will be performed at the termination time.",
                  },
                },
                description: "Sets the scheduling options for an Instance.",
                additionalProperties: true,
              },
              serviceAccounts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      description: "Email address of the service account.",
                    },
                    scopes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "The list of scopes to be made available for this service account.",
                    },
                  },
                  description: "A service account.",
                  additionalProperties: true,
                },
                description:
                  "A list of service accounts with specified scopes. Access tokens for these service accounts are available to the instances that are created from these properties. Use metadata queries to obtain the access tokens for these instances.",
              },
              shieldedInstanceConfig: {
                type: "object",
                properties: {
                  enableIntegrityMonitoring: {
                    type: "boolean",
                    description:
                      "Defines whether the instance has integrity monitoring enabled.Enabled by default.",
                  },
                  enableSecureBoot: {
                    type: "boolean",
                    description:
                      "Defines whether the instance has Secure Boot enabled.Disabled by default.",
                  },
                  enableVtpm: {
                    type: "boolean",
                    description:
                      "Defines whether the instance has the vTPM enabled.Enabled by default.",
                  },
                },
                description: "A set of Shielded Instance options.",
                additionalProperties: true,
              },
              tags: {
                type: "object",
                properties: {
                  fingerprint: {
                    type: "string",
                    description:
                      "Specifies a fingerprint for this request, which is essentially a hash of the tags' contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update tags. You must always provide an up-to-date fingerprint hash in order to update or change tags.  To see the latest fingerprint, make get() request to the instance.",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "An array of tags. Each tag must be 1-63 characters long, and comply with RFC1035.",
                  },
                },
                description: "A set of instance tags.",
                additionalProperties: true,
              },
            },
            additionalProperties: true,
            description: "The instance properties for this instance template.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description:
            "Output only. [Output Only] The URL for this instance template. The server defines this URL.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The URL for this instance template. The server defines this URL.",
          },
          required: false,
        },
        sourceInstance: {
          name: "Source Instance",
          description:
            "The source instance used to create the template. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance    - projects/project/zones/zone/instances/instance",
          type: {
            type: "string",
            description:
              "The source instance used to create the template. You can provide this as a partial or full URL to the resource. For example, the following are valid values:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance    - projects/project/zones/zone/instances/instance",
          },
          required: false,
        },
        sourceInstanceParams: {
          name: "Source Instance Params",
          description:
            "The source instance params to use to create this instance template.",
          type: {
            type: "object",
            properties: {
              diskConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    autoDelete: {
                      type: "boolean",
                      description:
                        "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
                    },
                    customImage: {
                      type: "string",
                      description:
                        "The custom source image to be used to restore this disk when instantiating this instance template.",
                    },
                    deviceName: {
                      type: "string",
                      description:
                        "Specifies the device name of the disk to which the configurations apply to.",
                    },
                    instantiateFrom: {
                      type: "string",
                      enum: [
                        "UNDEFINED_INSTANTIATE_FROM",
                        "ATTACH_READ_ONLY",
                        "BLANK",
                        "CUSTOM_IMAGE",
                        "DEFAULT",
                        "DO_NOT_INCLUDE",
                        "SOURCE_IMAGE",
                        "SOURCE_IMAGE_FAMILY",
                      ],
                      description:
                        "Specifies whether to include the disk and what image to use. Possible values are:        - source-image: to use the same image that was used to      create the source instance's corresponding disk. Applicable to the boot      disk and additional read-write disks.      - source-image-family: to use the same image family that      was used to create the source instance's corresponding disk. Applicable      to the boot disk and additional read-write disks.      - custom-image: to use a user-provided image url for disk      creation. Applicable to the boot disk and additional read-write      disks.    - attach-read-only: to attach a read-only      disk. Applicable to read-only disks.      - do-not-include: to exclude a disk from the template.      Applicable to additional read-write disks, local SSDs, and read-only      disks. Check the InstantiateFrom enum for the list of possible values.",
                    },
                  },
                  description:
                    "A specification of the desired way to instantiate a disk in the instance template when its created from a source instance.",
                  additionalProperties: true,
                },
                description:
                  "Attached disks configuration. If not provided, defaults are applied: For boot disk and any other R/W disks, the source images for each disk will be used. For read-only disks, they will be attached in read-only mode. Local SSD disks will be created as blank volumes.",
              },
            },
            description:
              "A specification of the parameters to use when creating the instance template from a source instance.",
            additionalProperties: true,
          },
          required: false,
        },
        requestId: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
            description:
              "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.creationTimestamp !== undefined)
          body.creationTimestamp = input.event.inputConfig.creationTimestamp;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.properties !== undefined)
          body.properties = input.event.inputConfig.properties;
        if (input.event.inputConfig.region !== undefined)
          body.region = input.event.inputConfig.region;
        if (input.event.inputConfig.selfLink !== undefined)
          body.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.sourceInstance !== undefined)
          body.sourceInstance = input.event.inputConfig.sourceInstance;
        if (input.event.inputConfig.sourceInstanceParams !== undefined)
          body.sourceInstanceParams =
            input.event.inputConfig.sourceInstanceParams;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/instanceTemplates",
          pathParams,
          queryParams,
          body: Object.keys(body).length > 0 ? body : undefined,
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
          clientOperationId: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creationTimestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          endTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was completed. This value is inRFC3339 text format.",
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
                    errorDetails: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          errorInfo: {
                            type: "object",
                            properties: {
                              domain: {
                                type: "string",
                                description:
                                  'The logical grouping to which the "reason" belongs. The error domain is typically the registered service name of the tool or product that generates the error. Example: "pubsub.googleapis.com". If the error is generated by some common infrastructure, the error domain must be a globally unique value that identifies the infrastructure. For Google API infrastructure, the error domain is "googleapis.com".',
                              },
                              metadatas: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  'Additional structured details about this error.  Keys must match a regular expression of `a-z+` but should ideally be lowerCamelCase. Also, they must be limited to 64 characters in length. When identifying the current value of an exceeded limit, the units should be contained in the key, not the value.  For example, rather than `{"instanceLimit": "100/request"}`, should be returned as, `{"instanceLimitPerRequest": "100"}`, if the client exceeds the number of instances that can be created in a single (batch) request.',
                              },
                              reason: {
                                type: "string",
                                description:
                                  "The reason of the error. This is a constant value that identifies the proximate cause of the error. Error reasons are unique within a particular domain of errors. This should be at most 63 characters and match a regular expression of `A-Z+[A-Z0-9]`, which represents UPPER_SNAKE_CASE.",
                              },
                            },
                            description:
                              'Describes the cause of the error with structured details.  Example of an error when contacting the "pubsub.googleapis.com" API when it is not enabled:      { "reason": "API_DISABLED"       "domain": "googleapis.com"       "metadata": {         "resource": "projects/123",         "service": "pubsub.googleapis.com"       }     }  This response indicates that the pubsub.googleapis.com API is not enabled.  Example of an error that is returned when attempting to create a Spanner instance in a region that is out of stock:      { "reason": "STOCKOUT"       "domain": "spanner.googleapis.com",       "metadata": {         "availableRegions": "us-central1,us-east2"       }     }',
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
                                    description: {
                                      type: "string",
                                      description:
                                        "Describes what the link offers.",
                                    },
                                    url: {
                                      type: "string",
                                      description: "The URL of the link.",
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
                              "Provides links to documentation or for performing an out of band action.  For example, if a quota check failed with an error indicating the calling project hasn't enabled the accessed service, this can contain a URL pointing directly to the right place in the developer console to flip the bit.",
                            additionalProperties: true,
                          },
                          localizedMessage: {
                            type: "object",
                            properties: {
                              locale: {
                                type: "string",
                                description:
                                  'The locale used following the specification defined at https://www.rfc-editor.org/rfc/bcp/bcp47.txt. Examples are: "en-US", "fr-CH", "es-MX"',
                              },
                              message: {
                                type: "string",
                                description:
                                  "The localized error message in the above locale.",
                              },
                            },
                            description:
                              "Provides a localized error message that is safe to return to the user which can be attached to an RPC error.",
                            additionalProperties: true,
                          },
                          quotaInfo: {
                            type: "object",
                            properties: {
                              dimensions: {
                                type: "object",
                                additionalProperties: {
                                  type: "string",
                                },
                                description:
                                  "The map holding related quota dimensions.",
                              },
                              futureLimit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limitName: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metricName: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rolloutStatus: {
                                type: "string",
                                enum: [
                                  "UNDEFINED_ROLLOUT_STATUS",
                                  "IN_PROGRESS",
                                  "ROLLOUT_STATUS_UNSPECIFIED",
                                ],
                                description:
                                  "Rollout status of the future quota limit. Check the RolloutStatus enum for the list of possible values.",
                              },
                            },
                            description:
                              "Additional details for quota exceeded error for resource quota.",
                            additionalProperties: true,
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "[Output Only] An optional list of messages that contain the error details. There is a set of defined message types to use for providing details.The syntax depends on the error code. For example, QuotaExceededInfo will have details when the error code is QUOTA_EXCEEDED.",
                    },
                    location: {
                      type: "string",
                      description:
                        "[Output Only] Indicates the field in the request that caused the error. This property is optional.",
                    },
                    message: {
                      type: "string",
                      description:
                        "[Output Only] An optional, human-readable error message.",
                    },
                  },
                  additionalProperties: true,
                },
                description:
                  "[Output Only] The array of errors encountered while processing this operation.",
              },
            },
            description:
              "Output only. Errors that prevented the ResizeRequest to be fulfilled.",
            additionalProperties: true,
          },
          httpErrorMessage: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          httpErrorStatusCode: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insertTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instancesBulkInsertOperationMetadata: {
            type: "object",
            properties: {
              perLocationStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always `compute#operation` for Operation resources.",
          },
          name: {
            type: "string",
            description: "[Output Only] Name of the operation.",
          },
          operationGroupId: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operationType: {
            type: "string",
            description:
              "[Output Only] The type of operation, such as `insert`, `update`, or `delete`, and so on.",
          },
          progress: {
            type: "integer",
            description:
              "[Output Only] An optional progress indicator that ranges from 0 to 100. There is no requirement that this be linear or support any granularity of operations. This should not be used to guess when the operation will be complete. This number should monotonically increase as the operation progresses.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] The URL of the region where the operation resides. Only applicable when performing regional operations.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          setCommonInstanceMetadataOperationMetadata: {
            type: "object",
            properties: {
              clientOperationId: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              perLocationOperations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output Only] Status information per location (location name is key). Example key: zones/us-central1-a",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] If the operation is for projects.setCommonInstanceMetadata, this field will contain information on all underlying zonal actions and their state.",
          },
          startTime: {
            type: "string",
            description:
              "[Output Only] The time that this operation was started by the server. This value is inRFC3339 text format.",
          },
          status: {
            type: "string",
            enum: ["UNDEFINED_STATUS", "DONE", "PENDING", "RUNNING"],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          targetId: {
            type: "string",
            description: "64-bit integer as string",
          },
          targetLink: {
            type: "string",
            description:
              "[Output Only] The URL of the resource that the operation modifies. For operations related to creating a snapshot, this points to the disk that the snapshot was created from.",
          },
          user: {
            type: "string",
            description:
              "[Output Only] User who requested the operation, for example: `user@example.com` or `alice_smith_identifier (global/workforcePools/example-com-us-employees)`.",
          },
          warnings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CODE",
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
                    "[Output Only] A warning code, if applicable. For example, Compute Engine returns NO_RESULTS_ON_PAGE if there are no results in the response. Check the Code enum for the list of possible values.",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "[Output Only] A key that provides more detail on the warning being returned. For example, for warnings where there are no results in a list request for a particular zone, this key might be scope and the key value might be the zone name. Other examples might be a key indicating a deprecated resource and a suggested replacement, or a warning about invalid network settings (for example, if an instance attempts to perform IP forwarding but is not enabled for IP forwarding).",
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
                    '[Output Only] Metadata about this warning in key: value format. For example:  "data": [   {    "key": "scope",    "value": "zones/us-east1-d"   }',
                },
                message: {
                  type: "string",
                  description:
                    "[Output Only] A human-readable description of the warning code.",
                },
              },
              additionalProperties: true,
            },
            description:
              "[Output Only] If warning messages are generated during processing of the operation, this field will be populated.",
          },
          zone: {
            type: "string",
            description:
              "[Output Only] The URL of the zone where the operation resides. Only applicable when performing per-zone operations.",
          },
        },
        description:
          "Represents an Operation resource.  Google Compute Engine has three Operation resources:  * [Global](/compute/docs/reference/rest/v1/globalOperations) * [Regional](/compute/docs/reference/rest/v1/regionOperations) * [Zonal](/compute/docs/reference/rest/v1/zoneOperations)  You can use an operation resource to manage asynchronous API requests. For more information, readHandling API responses.  Operations can be global, regional or zonal.     - For global operations, use the `globalOperations`    resource.    - For regional operations, use the    `regionOperations` resource.    - For zonal operations, use    the `zoneOperations` resource.    For more information, read Global, Regional, and Zonal Resources.  Note that completed Operation resources have a limited retention period.",
        additionalProperties: true,
      },
    },
  },
};

export default regionInstanceTemplatesInsert;
