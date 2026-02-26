import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const update: AppBlock = {
  name: "Instances - Update",
  description: `Updates the specified UrlMap resource with the data included in the request.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "Output only. [Output Only] URL of the zone where the instance resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the zone where the instance resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          required: false,
        },
        instance: {
          name: "Instance",
          description: "Name of the instance resource to update.",
          type: {
            type: "string",
          },
          required: true,
        },
        advanced_machine_features: {
          name: "Advanced Machine Features",
          description:
            "Controls for advanced machine-related behavior features.",
          type: {
            type: "object",
            properties: {
              enable_nested_virtualization: {
                type: "boolean",
                description:
                  "Whether to enable nested virtualization or not (default is false).",
              },
              enable_uefi_networking: {
                type: "boolean",
                description:
                  "Whether to enable UEFI networking for instance creation.",
              },
              performance_monitoring_unit: {
                type: "string",
                description:
                  "Type of Performance Monitoring Unit requested on instance. Check the PerformanceMonitoringUnit enum for the list of possible values.",
              },
              threads_per_core: {
                type: "integer",
                description:
                  "The number of threads per physical core. To disable simultaneous multithreading (SMT) set this to 1. If unset, the maximum number of threads supported per core by the underlying processor is assumed.",
              },
              turbo_mode: {
                type: "string",
                description:
                  "Turbo frequency mode to use for the instance. Supported modes include: * ALL_CORE_MAX  Using empty string or not setting this field will use the platform-specific default turbo mode.",
              },
              visible_core_count: {
                type: "integer",
                description:
                  "The number of physical cores to expose to an instance. Multiply by the number of threads per core to compute the total number of virtual CPUs to expose to the instance. If unset, the number of cores is inferred from the instance's nominal CPU count and the underlying platform's SMT width.",
              },
            },
            description:
              "Specifies options for controlling advanced machine features. Options that would traditionally be configured in a BIOS belong here. Features that require operating system support may have corresponding entries in the GuestOsFeatures of anImage (e.g., whether or not the OS in theImage supports nested virtualization being enabled or disabled).",
            additionalProperties: true,
          },
          required: false,
        },
        can_ip_forward: {
          name: "Can Ip Forward",
          description:
            "Allows this instance to send and receive packets with non-matching destination or source IPs. This is required if you plan to use this instance to forward routes. For more information, seeEnabling IP Forwarding.",
          type: {
            type: "boolean",
            description:
              "Allows this instance to send and receive packets with non-matching destination or source IPs. This is required if you plan to use this instance to forward routes. For more information, seeEnabling IP Forwarding.",
          },
          required: false,
        },
        confidential_instance_config: {
          name: "Confidential Instance Config",
          description: "Confidential Instance Config field",
          type: {
            type: "object",
            properties: {
              confidential_instance_type: {
                type: "string",
                description:
                  "Defines the type of technology used by the confidential instance. Check the ConfidentialInstanceType enum for the list of possible values.",
              },
              enable_confidential_compute: {
                type: "boolean",
                description:
                  "Defines whether the instance should have confidential compute enabled.",
              },
            },
            description: "A set of Confidential Instance options.",
            additionalProperties: true,
          },
          required: false,
        },
        cpu_platform: {
          name: "Cpu Platform",
          description:
            "Output only. [Output Only] The CPU platform used by this instance.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The CPU platform used by this instance.",
          },
          required: false,
        },
        creation_timestamp: {
          name: "Creation Timestamp",
          description:
            "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          required: false,
        },
        deletion_protection: {
          name: "Deletion Protection",
          description:
            "Whether the resource should be protected against deletion.",
          type: {
            type: "boolean",
            description:
              "Whether the resource should be protected against deletion.",
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
        disks: {
          name: "Disks",
          description:
            "Array of disks associated with this instance. Persistent disks must be created before you can assign them.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                architecture: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The architecture of the attached disk. Valid values are ARM64 or X86_64. Check the Architecture enum for the list of possible values.",
                },
                auto_delete: {
                  type: "boolean",
                  description:
                    "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
                },
                boot: {
                  type: "boolean",
                  description:
                    "Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.",
                },
                device_name: {
                  type: "string",
                  description:
                    "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system running within the instance. This name can be used to reference the device for mounting, resizing, and so on, from within the instance.  If not specified, the server chooses a default device name to apply to this disk, in the form persistent-disk-x, where x is a number assigned by Google Compute Engine. This field is only applicable for persistent disks.",
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
                    "Encrypts or decrypts a disk using acustomer-supplied encryption key.  If you are creating a new disk, this field encrypts the new disk using an encryption key that you provide. If you are attaching an existing disk that is already encrypted, this field decrypts the disk using the customer-supplied encryption key.  If you encrypt a disk using a customer-supplied key, you must provide the same key again when you attempt to use this resource at a later time. For example, you must provide the key when you create a snapshot or an image from the disk or when you attach the disk to a virtual machine instance.  If you do not provide an encryption key, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later.  Note:  Instance templates do not storecustomer-supplied encryption keys, so you cannot use your own keys to encrypt disks in amanaged instance group.  You cannot create VMs that have disks with customer-supplied keys using the bulk insert method.",
                },
                disk_size_gb: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                force_attach: {
                  type: "boolean",
                  description:
                    "[Input Only] Whether to force attach the regional disk even if it's currently attached to another instance. If you try to force attach a zonal disk to an instance, you will receive an error.",
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
                index: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] A zero-based index to this disk, where 0 is reserved for the boot disk. If you have many disks attached to an instance, each disk would have a unique index number.",
                },
                initialize_params: {
                  type: "object",
                  properties: {
                    architecture: {
                      type: "string",
                      description:
                        "The architecture of the attached disk. Valid values are arm64 or x86_64. Check the Architecture enum for the list of possible values.",
                    },
                    description: {
                      type: "string",
                      description:
                        "An optional description. Provide this property when creating the disk.",
                    },
                    disk_name: {
                      type: "string",
                      description:
                        "Specifies the disk name. If not specified, the default is to use the name of the instance. If a disk with the same name already exists in the given region, the existing disk is attached to the new instance and the new disk is not created.",
                    },
                    disk_size_gb: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    disk_type: {
                      type: "string",
                      description:
                        "Specifies the disk type to use to create the instance. If not specified, the default is pd-standard, specified using the full URL. For example:  https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/pd-standard   For a full list of acceptable values, seePersistent disk types. If you specify this field when creating a VM, you can provide either the full or partial URL. For example, the following values are valid:        - https://www.googleapis.com/compute/v1/projects/project/zones/zone/diskTypes/diskType    - projects/project/zones/zone/diskTypes/diskType    - zones/zone/diskTypes/diskType   If you specify this field when creating or updating an instance template or all-instances configuration, specify the type of the disk, not the URL. For example: pd-standard.",
                    },
                    enable_confidential_compute: {
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
                    on_update_action: {
                      type: "string",
                      description:
                        "Specifies which action to take on instance update with this disk. Default is to use the existing disk. Check the OnUpdateAction enum for the list of possible values.",
                    },
                    provisioned_iops: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    provisioned_throughput: {
                      type: "string",
                      description: "64-bit integer as string",
                    },
                    replica_zones: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Required for each regional disk associated with the instance. Specify the URLs of the zones where the disk should be replicated to. You must provide exactly two replica zones, and one zone must be the same as the instance zone.",
                    },
                    resource_manager_tags: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Resource manager tags to be bound to the disk. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
                    },
                    resource_policies: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Resource policies applied to this disk for automatic snapshot creations. Specified using the full or partial URL. For instance template, specify only the resource policy name.",
                    },
                    source_image: {
                      type: "string",
                      description:
                        "The source image to create this disk. When creating a new instance boot disk, one of initializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required.  To create a disk with one of the public operating system images, specify the image by its family name. For example, specifyfamily/debian-9 to use the latest Debian 9 image:  projects/debian-cloud/global/images/family/debian-9   Alternatively, use a specific version of a public operating system image:  projects/debian-cloud/global/images/debian-9-stretch-vYYYYMMDD   To create a disk with a custom image that you created, specify the image name in the following format:  global/images/my-custom-image   You can also specify a custom image by its image family, which returns the latest version of the image in that family. Replace the image name with family/family-name:  global/images/family/my-image-family   If the source image is deleted later, this field will not be set.",
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
                        "Thecustomer-supplied encryption key of the source image. Required if the source image is protected by a customer-supplied encryption key.  InstanceTemplate and InstancePropertiesPatch do not storecustomer-supplied encryption keys, so you cannot create disks for instances in a managed instance group if the source images are encrypted with your own keys.",
                    },
                    source_snapshot: {
                      type: "string",
                      description:
                        "The source snapshot to create this disk. When creating a new instance boot disk, one of initializeParams.sourceSnapshot orinitializeParams.sourceImage or disks.source is required.  To create a disk with a snapshot that you created, specify the snapshot name in the following format:  global/snapshots/my-backup   If the source snapshot is deleted later, this field will not be set.  Note: You cannot create VMs in bulk using a snapshot as the source. Use an image instead when you create VMs using the bulk insert method.",
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
                        "Thecustomer-supplied encryption key of the source snapshot.",
                    },
                    storage_pool: {
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
                  description:
                    "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk in READ_WRITE mode. Check the Mode enum for the list of possible values.",
                },
                saved_state: {
                  type: "string",
                  description:
                    "Output only. For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this field is set to PRESERVED if the LocalSSD data has been saved to a persistent location by customer request.  (see the discard_local_ssd option on Stop/Suspend). Read-only in the api. Check the SavedState enum for the list of possible values.",
                },
                shielded_instance_initial_state: {
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
                          file_type: {
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
                            description:
                              "The raw content in the secure keys file.",
                          },
                          file_type: {
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
                            description:
                              "The raw content in the secure keys file.",
                          },
                          file_type: {
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
                          description:
                            "The raw content in the secure keys file.",
                        },
                        file_type: {
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
                source: {
                  type: "string",
                  description:
                    "Specifies a valid partial or full URL to an existing Persistent Disk resource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required.  If desired, you can also attach existing non-root persistent disks using this property. This field is only applicable for persistent disks.  Note that for InstanceTemplate, specify the disk name for zonal disk, and the URL for regional disk.",
                },
                type: {
                  type: "string",
                  description:
                    "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT. Check the Type enum for the list of possible values.",
                },
              },
              description: "An instance-attached disk resource.",
              additionalProperties: true,
            },
            description:
              "Array of disks associated with this instance. Persistent disks must be created before you can assign them.",
          },
          required: false,
        },
        display_device: {
          name: "Display Device",
          description: "Enables display device for the instance.",
          type: {
            type: "object",
            properties: {
              enable_display: {
                type: "boolean",
                description:
                  "Defines whether the instance has Display enabled.",
              },
            },
            description: "A set of Display Device options",
            additionalProperties: true,
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Specifies a fingerprint for this resource, which is essentially a hash of the instance's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update the instance. You must always provide an up-to-date fingerprint hash in order to update the instance.  To see the latest fingerprint, make get() request to the instance.",
          type: {
            type: "string",
            description:
              "Specifies a fingerprint for this resource, which is essentially a hash of the instance's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update the instance. You must always provide an up-to-date fingerprint hash in order to update the instance.  To see the latest fingerprint, make get() request to the instance.",
          },
          required: false,
        },
        guest_accelerators: {
          name: "Guest Accelerators",
          description:
            "A list of the type and count of accelerator cards attached to the instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                accelerator_count: {
                  type: "integer",
                  description:
                    "The number of the guest accelerator cards exposed to this instance.",
                },
                accelerator_type: {
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
              "A list of the type and count of accelerator cards attached to the instance.",
          },
          required: false,
        },
        hostname: {
          name: "Hostname",
          description:
            "Specifies the hostname of the instance. The specified hostname must be RFC1035 compliant. If hostname is not specified, the default hostname is [INSTANCE_NAME].c.[PROJECT_ID].internal when using the global DNS, and [INSTANCE_NAME].[ZONE].c.[PROJECT_ID].internal when using zonal DNS.",
          type: {
            type: "string",
            description:
              "Specifies the hostname of the instance. The specified hostname must be RFC1035 compliant. If hostname is not specified, the default hostname is [INSTANCE_NAME].c.[PROJECT_ID].internal when using the global DNS, and [INSTANCE_NAME].[ZONE].c.[PROJECT_ID].internal when using zonal DNS.",
          },
          required: false,
        },
        id: {
          name: "Id",
          description:
            "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
          type: {
            type: "string",
            description: "64-bit integer as string",
          },
          required: false,
        },
        instance_encryption_key: {
          name: "Instance Encryption Key",
          description:
            "Encrypts suspended data for an instance with acustomer-managed encryption key.  If you are creating a new instance, this field will encrypt the local SSD and in-memory contents of the instance during the suspend operation.  If you do not provide an encryption key when creating the instance, then the local SSD and in-memory contents will be encrypted using an automatically generated key during the suspend operation.",
          type: {
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
              "Encrypts suspended data for an instance with acustomer-managed encryption key.  If you are creating a new instance, this field will encrypt the local SSD and in-memory contents of the instance during the suspend operation.  If you do not provide an encryption key when creating the instance, then the local SSD and in-memory contents will be encrypted using an automatically generated key during the suspend operation.",
          },
          required: false,
        },
        key_revocation_action_type: {
          name: "Key Revocation Action Type",
          description:
            'KeyRevocationActionType of the instance. Supported options are "STOP" and "NONE". The default value is "NONE" if it is not specified. Check the KeyRevocationActionType enum for the list of possible values.',
          type: {
            type: "string",
            description:
              'KeyRevocationActionType of the instance. Supported options are "STOP" and "NONE". The default value is "NONE" if it is not specified. Check the KeyRevocationActionType enum for the list of possible values.',
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Always compute#instance for instances.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#instance for instances.",
          },
          required: false,
        },
        label_fingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for this request, which is essentially a hash of the label's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.  To see the latest fingerprint, make get() request to the instance.",
          type: {
            type: "string",
            description:
              "A fingerprint for this request, which is essentially a hash of the label's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.  To see the latest fingerprint, make get() request to the instance.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description:
            "Labels to apply to this instance. These can be later modified by the setLabels method.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this instance. These can be later modified by the setLabels method.",
          },
          required: false,
        },
        last_start_timestamp: {
          name: "Last Start Timestamp",
          description:
            "Output only. [Output Only] Last start timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Last start timestamp inRFC3339 text format.",
          },
          required: false,
        },
        last_stop_timestamp: {
          name: "Last Stop Timestamp",
          description:
            "Output only. [Output Only] Last stop timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Last stop timestamp inRFC3339 text format.",
          },
          required: false,
        },
        last_suspended_timestamp: {
          name: "Last Suspended Timestamp",
          description:
            "Output only. [Output Only] Last suspended timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Last suspended timestamp inRFC3339 text format.",
          },
          required: false,
        },
        machine_type: {
          name: "Machine Type",
          description:
            "Full or partial URL of the machine type resource to use for this instance, in the format:zones/zone/machineTypes/machine-type. This is provided by the client when the instance is created. For example, the following is a valid partial url to a predefined machine type:  zones/us-central1-f/machineTypes/n1-standard-1   To create acustom machine type, provide a URL to a machine type in the following format, where CPUS is 1 or an even number up to 32 (2, 4, 6, ... 24, etc), and MEMORY is the total memory for this instance. Memory must be a multiple of 256 MB and must be supplied in MB (e.g. 5 GB of memory is 5120 MB):  zones/zone/machineTypes/custom-CPUS-MEMORY   For example: zones/us-central1-f/machineTypes/custom-4-5120 For a full list of restrictions, read theSpecifications for custom machine types.",
          type: {
            type: "string",
            description:
              "Full or partial URL of the machine type resource to use for this instance, in the format:zones/zone/machineTypes/machine-type. This is provided by the client when the instance is created. For example, the following is a valid partial url to a predefined machine type:  zones/us-central1-f/machineTypes/n1-standard-1   To create acustom machine type, provide a URL to a machine type in the following format, where CPUS is 1 or an even number up to 32 (2, 4, 6, ... 24, etc), and MEMORY is the total memory for this instance. Memory must be a multiple of 256 MB and must be supplied in MB (e.g. 5 GB of memory is 5120 MB):  zones/zone/machineTypes/custom-CPUS-MEMORY   For example: zones/us-central1-f/machineTypes/custom-4-5120 For a full list of restrictions, read theSpecifications for custom machine types.",
          },
          required: false,
        },
        metadata: {
          name: "Metadata",
          description:
            "The metadata key/value pairs assigned to this instance. This includes metadata keys that were explicitly defined for the instance.",
          type: {
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
          required: false,
        },
        min_cpu_platform: {
          name: "Min Cpu Platform",
          description:
            'Specifies aminimum CPU platform for the VM instance. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: "Intel Haswell" or minCpuPlatform: "Intel Sandy Bridge".',
          type: {
            type: "string",
            description:
              'Specifies aminimum CPU platform for the VM instance. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: "Intel Haswell" or minCpuPlatform: "Intel Sandy Bridge".',
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          type: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          required: false,
        },
        network_interfaces: {
          name: "Network Interfaces",
          description:
            "An array of network configurations for this instance. These specify how interfaces are configured to interact with other network services, such as connecting to the internet. Multiple interfaces are supported per instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                access_configs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      external_ipv6: {
                        type: "string",
                        description:
                          "Applies to ipv6AccessConfigs only. The first IPv6 address of the external IPv6 range associated with this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To use a static external IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an external IPv6 address from the instance's subnetwork.",
                      },
                      external_ipv6_prefix_length: {
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
                      nat_i_p: {
                        type: "string",
                        description:
                          "Applies to accessConfigs (IPv4) only. Anexternal IP address associated with this instance. Specify an unused static external IP address available to the project or leave this field undefined to use an IP from a shared ephemeral IP address pool. If you specify a static external IP address, it must live in the same region as the zone of the instance.",
                      },
                      network_tier: {
                        type: "string",
                        description:
                          "This signifies the networking tier used for configuring this access configuration and can only take the following values: PREMIUM,STANDARD.  If an AccessConfig is specified without a valid external IP address, an ephemeral IP will be created with this networkTier.  If an AccessConfig with a valid external IP address is specified, it must match that of the networkTier associated with the Address resource owning that IP. Check the NetworkTier enum for the list of possible values.",
                      },
                      public_ptr_domain_name: {
                        type: "string",
                        description:
                          "The DNS domain name for the public PTR record.  You can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for first IP in associated external IPv6 range.",
                      },
                      security_policy: {
                        type: "string",
                        description:
                          "The resource URL for the security policy associated with this access config.",
                      },
                      set_public_ptr: {
                        type: "boolean",
                        description:
                          "Specifies whether a public DNS 'PTR' record should be created to map the external IP address of the instance to a DNS domain name.  This field is not used in ipv6AccessConfig. A default PTR record will be created if the VM has external IPv6 range associated.",
                      },
                      type: {
                        type: "string",
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
                alias_ip_ranges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ip_cidr_range: {
                        type: "string",
                        description:
                          "The IP alias ranges to allocate for this interface. This IP CIDR range must belong to the specified subnetwork and cannot contain IP addresses reserved by system or used by other network interfaces. This range may be a single IP address (such as 10.2.3.4), a netmask (such as/24) or a CIDR-formatted string (such as10.1.2.0/24).",
                      },
                      subnetwork_range_name: {
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
                igmp_query: {
                  type: "string",
                  description:
                    "Indicate whether igmp query is enabled on the network interface or not. If enabled, also indicates the version of IGMP supported. Check the IgmpQuery enum for the list of possible values.",
                },
                internal_ipv6_prefix_length: {
                  type: "integer",
                  description:
                    "The prefix length of the primary internal IPv6 range.",
                },
                ipv6_access_configs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      external_ipv6: {
                        type: "string",
                        description:
                          "Applies to ipv6AccessConfigs only. The first IPv6 address of the external IPv6 range associated with this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To use a static external IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an external IPv6 address from the instance's subnetwork.",
                      },
                      external_ipv6_prefix_length: {
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
                      nat_i_p: {
                        type: "string",
                        description:
                          "Applies to accessConfigs (IPv4) only. Anexternal IP address associated with this instance. Specify an unused static external IP address available to the project or leave this field undefined to use an IP from a shared ephemeral IP address pool. If you specify a static external IP address, it must live in the same region as the zone of the instance.",
                      },
                      network_tier: {
                        type: "string",
                        description:
                          "This signifies the networking tier used for configuring this access configuration and can only take the following values: PREMIUM,STANDARD.  If an AccessConfig is specified without a valid external IP address, an ephemeral IP will be created with this networkTier.  If an AccessConfig with a valid external IP address is specified, it must match that of the networkTier associated with the Address resource owning that IP. Check the NetworkTier enum for the list of possible values.",
                      },
                      public_ptr_domain_name: {
                        type: "string",
                        description:
                          "The DNS domain name for the public PTR record.  You can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for first IP in associated external IPv6 range.",
                      },
                      security_policy: {
                        type: "string",
                        description:
                          "The resource URL for the security policy associated with this access config.",
                      },
                      set_public_ptr: {
                        type: "boolean",
                        description:
                          "Specifies whether a public DNS 'PTR' record should be created to map the external IP address of the instance to a DNS domain name.  This field is not used in ipv6AccessConfig. A default PTR record will be created if the VM has external IPv6 range associated.",
                      },
                      type: {
                        type: "string",
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
                ipv6_access_type: {
                  type: "string",
                  description:
                    "Output only. [Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be accessed from the Internet. This field is always inherited from its subnetwork.  Valid only if stackType is IPV4_IPV6. Check the Ipv6AccessType enum for the list of possible values.",
                },
                ipv6_address: {
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
                network_attachment: {
                  type: "string",
                  description:
                    "The URL of the network attachment that this interface should connect to in the following format: projects/{project_number}/regions/{region_name}/networkAttachments/{network_attachment_name}.",
                },
                network_i_p: {
                  type: "string",
                  description:
                    "An IPv4 internal IP address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.",
                },
                nic_type: {
                  type: "string",
                  description:
                    "The type of vNIC to be used on this interface. This may be gVNIC or VirtioNet. Check the NicType enum for the list of possible values.",
                },
                parent_nic_name: {
                  type: "string",
                  description:
                    "Name of the parent network interface of a dynamic network interface.",
                },
                queue_count: {
                  type: "integer",
                  description:
                    "The networking queue count that's specified by users for the network interface. Both Rx and Tx queues will be set to this number. It'll be empty if not specified by the users.",
                },
                stack_type: {
                  type: "string",
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
              "An array of network configurations for this instance. These specify how interfaces are configured to interact with other network services, such as connecting to the internet. Multiple interfaces are supported per instance.",
          },
          required: false,
        },
        network_performance_config: {
          name: "Network Performance Config",
          description: "Network Performance Config field",
          type: {
            type: "object",
            properties: {
              total_egress_bandwidth_tier: {
                type: "string",
                description:
                  "Check the TotalEgressBandwidthTier enum for the list of possible values.",
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Input only. [Input Only] Additional params passed with the request, but not persisted as part of resource payload.",
          type: {
            type: "object",
            properties: {
              request_valid_for_duration: {
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
              resource_manager_tags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the instance. Tag keys and values have the same definition as resource manager tags. Keys and values can be either in numeric format, such as `tagKeys/{tag_key_id}` and `tagValues/456` or in namespaced format such as `{org_id|project_id}/{tag_key_short_name}` and `{tag_value_short_name}`. The field is ignored (both PUT & PATCH) when empty.",
              },
            },
            description: "Additional instance params.",
            additionalProperties: true,
          },
          required: false,
        },
        private_ipv6_google_access: {
          name: "Private Ipv6 Google Access",
          description:
            "The private IPv6 google access type for the VM. If not specified, use  INHERIT_FROM_SUBNETWORK as default. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The private IPv6 google access type for the VM. If not specified, use  INHERIT_FROM_SUBNETWORK as default. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
          },
          required: false,
        },
        reservation_affinity: {
          name: "Reservation Affinity",
          description:
            "Specifies the reservations that this instance can consume from.",
          type: {
            type: "object",
            properties: {
              consume_reservation_type: {
                type: "string",
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
          required: false,
        },
        resource_policies: {
          name: "Resource Policies",
          description: "Resource policies applied to this instance.",
          type: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Resource policies applied to this instance.",
          },
          required: false,
        },
        resource_status: {
          name: "Resource Status",
          description:
            "Output only. [Output Only] Specifies values set for instance attributes as compared to the values requested by user in the corresponding input only field.",
          type: {
            type: "object",
            properties: {
              effective_instance_metadata: {
                type: "object",
                properties: {
                  block_project_ssh_keys_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective block-project-ssh-keys value at Instance level.",
                  },
                  enable_guest_attributes_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective enable-guest-attributes value at Instance level.",
                  },
                  enable_os_inventory_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective enable-os-inventory value at Instance level.",
                  },
                  enable_osconfig_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective enable-osconfig value at Instance level.",
                  },
                  enable_oslogin_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective enable-oslogin value at Instance level.",
                  },
                  serial_port_enable_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective serial-port-enable value at Instance level.",
                  },
                  serial_port_logging_enable_metadata_value: {
                    type: "boolean",
                    description:
                      "Effective serial-port-logging-enable value at Instance level.",
                  },
                  vm_dns_setting_metadata_value: {
                    type: "string",
                    description: "Effective VM DNS setting at Instance level.",
                  },
                },
                description:
                  "Effective values of predefined metadata keys for an instance.",
                additionalProperties: true,
              },
              physical_host: {
                type: "string",
                description:
                  "Output only. [Output Only] The precise location of your instance within the zone's data center, including the block, sub-block, and host. The field is formatted as follows: blockId/subBlockId/hostId.",
              },
              physical_host_topology: {
                type: "object",
                properties: {
                  block: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the block in which the running instance is located. Instances within the same block experience low network latency.",
                  },
                  cluster: {
                    type: "string",
                    description:
                      "[Output Only] The global name of the Compute Engine cluster where the running instance is located.",
                  },
                  host: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the host on which the running instance is located. Instances on the same host experience the lowest possible network latency.",
                  },
                  subblock: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the sub-block in which the running instance is located. Instances in the same sub-block experience lower network latency than instances in the same block.",
                  },
                },
                description:
                  "Represents the physical host topology of the host on which the VM is running.",
                additionalProperties: true,
              },
              reservation_consumption_info: {
                type: "object",
                properties: {
                  consumed_reservation: {
                    type: "string",
                    description:
                      "Output only. [Output Only] The full resource name of the reservation that this instance is consuming from.",
                  },
                },
                description:
                  "Reservation consumption information that the instance is consuming from.",
                additionalProperties: true,
              },
              scheduling: {
                type: "object",
                properties: {
                  availability_domain: {
                    type: "integer",
                    description:
                      "Specifies the availability domain to place the instance in. The value must be a number between 1 and the number of availability domains specified in the spread placement policy attached to the instance.",
                  },
                },
                additionalProperties: true,
              },
              upcoming_maintenance: {
                type: "object",
                properties: {
                  can_reschedule: {
                    type: "boolean",
                    description:
                      "Indicates if the maintenance can be customer triggered.",
                  },
                  latest_window_start_time: {
                    type: "string",
                    description:
                      "The latest time for the planned maintenance window to start. This timestamp value is in RFC3339 text format.",
                  },
                  maintenance_on_shutdown: {
                    type: "boolean",
                    description:
                      "Indicates whether the UpcomingMaintenance will be triggered on VM shutdown.",
                  },
                  maintenance_reasons: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "The reasons for the maintenance. Only valid for vms. Check the MaintenanceReasons enum for the list of possible values.",
                  },
                  maintenance_status: {
                    type: "string",
                    description:
                      "Check the MaintenanceStatus enum for the list of possible values.",
                  },
                  type: {
                    type: "string",
                    description:
                      "Defines the type of maintenance. Check the Type enum for the list of possible values.",
                  },
                  window_end_time: {
                    type: "string",
                    description:
                      "The time by which the maintenance disruption will be completed. This timestamp value is in RFC3339 text format.",
                  },
                  window_start_time: {
                    type: "string",
                    description:
                      "The current start time of the maintenance window. This timestamp value is in RFC3339 text format.",
                  },
                },
                description: "Upcoming Maintenance notification information.",
                additionalProperties: true,
              },
            },
            description:
              "Contains output only fields. Use this sub-message for actual values set on Instance attributes as compared to the value requested by the user (intent) in their instance CRUD calls.",
            additionalProperties: true,
          },
          required: false,
        },
        satisfies_pzi: {
          name: "Satisfies Pzi",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        satisfies_pzs: {
          name: "Satisfies Pzs",
          description: "Output only. [Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          required: false,
        },
        scheduling: {
          name: "Scheduling",
          description: "Sets the scheduling options for this instance.",
          type: {
            type: "object",
            properties: {
              automatic_restart: {
                type: "boolean",
                description:
                  "Specifies whether the instance should be automatically restarted if it is terminated by Compute Engine (not terminated by a user). You can only set the automatic restart option for standard instances.Preemptible instances cannot be automatically restarted.  By default, this is set to true so an instance is automatically restarted if it is terminated by Compute Engine.",
              },
              availability_domain: {
                type: "integer",
                description:
                  "Specifies the availability domain to place the instance in. The value must be a number between 1 and the number of availability domains specified in the spread placement policy attached to the instance.",
              },
              host_error_timeout_seconds: {
                type: "integer",
                description:
                  "Specify the time in seconds for host error detection, the value must be within the range of [90, 330] with the increment of 30, if unset, the default behavior of host error recovery will be used.",
              },
              instance_termination_action: {
                type: "string",
                description:
                  "Specifies the termination action for the instance. Check the InstanceTerminationAction enum for the list of possible values.",
              },
              local_ssd_recovery_timeout: {
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
              location_hint: {
                type: "string",
                description:
                  "An opaque location hint used to place the instance close to other resources. This field is for use by internal tools that use the public API.",
              },
              max_run_duration: {
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
              min_node_cpus: {
                type: "integer",
                description:
                  "The minimum number of virtual CPUs this instance will consume when running on a sole-tenant node.",
              },
              node_affinities: {
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
              on_host_maintenance: {
                type: "string",
                description:
                  "Defines the maintenance behavior for this instance. For standard instances, the default behavior is MIGRATE. Forpreemptible instances, the default and only possible behavior is TERMINATE. For more information, see  Set  VM host maintenance policy. Check the OnHostMaintenance enum for the list of possible values.",
              },
              on_instance_stop_action: {
                type: "object",
                properties: {
                  discard_local_ssd: {
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
              provisioning_model: {
                type: "string",
                description:
                  "Specifies the provisioning model of the instance. Check the ProvisioningModel enum for the list of possible values.",
              },
              skip_guest_os_shutdown: {
                type: "boolean",
                description:
                  "Default is false and there will be 120 seconds between GCE ACPI G2 Soft Off and ACPI G3 Mechanical Off for Standard VMs and 30 seconds for Spot VMs.",
              },
              termination_time: {
                type: "string",
                description:
                  "Specifies the timestamp, when the instance will be terminated, inRFC3339 text format. If specified, the instance termination action will be performed at the termination time.",
              },
            },
            description: "Sets the scheduling options for an Instance.",
            additionalProperties: true,
          },
          required: false,
        },
        self_link: {
          name: "Self Link",
          description:
            "Output only. [Output Only] Server-defined URL for this resource.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          required: false,
        },
        service_accounts: {
          name: "Service Accounts",
          description:
            "A list of service accounts, with their specified scopes, authorized for this instance. Only one service account per VM instance is supported.  Service accounts generate access tokens that can be accessed through the metadata server and used to authenticate applications on the instance. SeeService Accounts for more information.",
          type: {
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
              "A list of service accounts, with their specified scopes, authorized for this instance. Only one service account per VM instance is supported.  Service accounts generate access tokens that can be accessed through the metadata server and used to authenticate applications on the instance. SeeService Accounts for more information.",
          },
          required: false,
        },
        shielded_instance_config: {
          name: "Shielded Instance Config",
          description: "Shielded Instance Config field",
          type: {
            type: "object",
            properties: {
              enable_integrity_monitoring: {
                type: "boolean",
                description:
                  "Defines whether the instance has integrity monitoring enabled.Enabled by default.",
              },
              enable_secure_boot: {
                type: "boolean",
                description:
                  "Defines whether the instance has Secure Boot enabled.Disabled by default.",
              },
              enable_vtpm: {
                type: "boolean",
                description:
                  "Defines whether the instance has the vTPM enabled.Enabled by default.",
              },
            },
            description: "A set of Shielded Instance options.",
            additionalProperties: true,
          },
          required: false,
        },
        shielded_instance_integrity_policy: {
          name: "Shielded Instance Integrity Policy",
          description: "Shielded Instance Integrity Policy field",
          type: {
            type: "object",
            properties: {
              update_auto_learn_policy: {
                type: "boolean",
                description:
                  "Updates the integrity policy baseline using the measurements from the VM instance's most recent boot.",
              },
            },
            description:
              "The policy describes the baseline against which Instance boot integrity is measured.",
            additionalProperties: true,
          },
          required: false,
        },
        source_machine_image: {
          name: "Source Machine Image",
          description: "Source machine image",
          type: {
            type: "string",
            description: "Source machine image",
          },
          required: false,
        },
        source_machine_image_encryption_key: {
          name: "Source Machine Image Encryption Key",
          description:
            "Source machine image encryption key when creating an instance from a machine image.",
          type: {
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
              "Source machine image encryption key when creating an instance from a machine image.",
          },
          required: false,
        },
        start_restricted: {
          name: "Start Restricted",
          description:
            "Output only. [Output Only] Whether a VM has been restricted for start because Compute Engine has detected suspicious activity.",
          type: {
            type: "boolean",
            description:
              "Output only. [Output Only] Whether a VM has been restricted for start because Compute Engine has detected suspicious activity.",
          },
          required: false,
        },
        status: {
          name: "Status",
          description:
            "Output only. [Output Only] The status of the instance. One of the following values: PROVISIONING, STAGING,RUNNING, STOPPING, SUSPENDING,SUSPENDED, REPAIRING, andTERMINATED. For more information about the status of the instance, see Instance life cycle. Check the Status enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] The status of the instance. One of the following values: PROVISIONING, STAGING,RUNNING, STOPPING, SUSPENDING,SUSPENDED, REPAIRING, andTERMINATED. For more information about the status of the instance, see Instance life cycle. Check the Status enum for the list of possible values.",
          },
          required: false,
        },
        status_message: {
          name: "Status Message",
          description:
            "Output only. [Output Only] An optional, human-readable explanation of the status.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] An optional, human-readable explanation of the status.",
          },
          required: false,
        },
        tags: {
          name: "Tags",
          description:
            "Tags to apply to this instance. Tags are used to identify valid sources or targets for network firewalls and are specified by the client during instance creation. The tags can be later modified by the setTags method. Each tag within the list must comply withRFC1035. Multiple tags can be specified via the 'tags.items' field.",
          type: {
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
          required: false,
        },
        minimal_action: {
          name: "Minimal Action",
          description:
            "Specifies the action to take when updating an instance even if the updated properties do not require it. If not specified, then Compute Engine acts based on the minimum action that the updated properties require. Check the MinimalAction enum for the list of possible values.",
          type: {
            type: "string",
          },
          required: false,
        },
        most_disruptive_allowed_action: {
          name: "Most Disruptive Allowed Action",
          description:
            "Specifies the most disruptive action that can be taken on the instance as part of the update. Compute Engine returns an error if the instance properties require a more disruptive action as part of the instance update. Valid options from lowest to highest are NO_EFFECT, REFRESH, and RESTART. Check the MostDisruptiveAllowedAction enum for the list of possible values.",
          type: {
            type: "string",
          },
          required: false,
        },
        request_id: {
          name: "Request Id",
          description:
            "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed.  For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments.  The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.minimal_action !== undefined)
          queryParams["minimalAction"] = String(
            input.event.inputConfig.minimal_action,
          );
        if (
          input.event.inputConfig.most_disruptive_allowed_action !== undefined
        )
          queryParams["mostDisruptiveAllowedAction"] = String(
            input.event.inputConfig.most_disruptive_allowed_action,
          );
        if (input.event.inputConfig.request_id !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.request_id);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.advanced_machine_features !== undefined)
          body.advanced_machine_features =
            input.event.inputConfig.advanced_machine_features;
        if (input.event.inputConfig.can_ip_forward !== undefined)
          body.can_ip_forward = input.event.inputConfig.can_ip_forward;
        if (input.event.inputConfig.confidential_instance_config !== undefined)
          body.confidential_instance_config =
            input.event.inputConfig.confidential_instance_config;
        if (input.event.inputConfig.cpu_platform !== undefined)
          body.cpu_platform = input.event.inputConfig.cpu_platform;
        if (input.event.inputConfig.creation_timestamp !== undefined)
          body.creation_timestamp = input.event.inputConfig.creation_timestamp;
        if (input.event.inputConfig.deletion_protection !== undefined)
          body.deletion_protection =
            input.event.inputConfig.deletion_protection;
        if (input.event.inputConfig.description !== undefined)
          body.description = input.event.inputConfig.description;
        if (input.event.inputConfig.disks !== undefined)
          body.disks = input.event.inputConfig.disks;
        if (input.event.inputConfig.display_device !== undefined)
          body.display_device = input.event.inputConfig.display_device;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.guest_accelerators !== undefined)
          body.guest_accelerators = input.event.inputConfig.guest_accelerators;
        if (input.event.inputConfig.hostname !== undefined)
          body.hostname = input.event.inputConfig.hostname;
        if (input.event.inputConfig.id !== undefined)
          body.id = input.event.inputConfig.id;
        if (input.event.inputConfig.instance_encryption_key !== undefined)
          body.instance_encryption_key =
            input.event.inputConfig.instance_encryption_key;
        if (input.event.inputConfig.key_revocation_action_type !== undefined)
          body.key_revocation_action_type =
            input.event.inputConfig.key_revocation_action_type;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.label_fingerprint !== undefined)
          body.label_fingerprint = input.event.inputConfig.label_fingerprint;
        if (input.event.inputConfig.labels !== undefined)
          body.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.last_start_timestamp !== undefined)
          body.last_start_timestamp =
            input.event.inputConfig.last_start_timestamp;
        if (input.event.inputConfig.last_stop_timestamp !== undefined)
          body.last_stop_timestamp =
            input.event.inputConfig.last_stop_timestamp;
        if (input.event.inputConfig.last_suspended_timestamp !== undefined)
          body.last_suspended_timestamp =
            input.event.inputConfig.last_suspended_timestamp;
        if (input.event.inputConfig.machine_type !== undefined)
          body.machine_type = input.event.inputConfig.machine_type;
        if (input.event.inputConfig.metadata !== undefined)
          body.metadata = input.event.inputConfig.metadata;
        if (input.event.inputConfig.min_cpu_platform !== undefined)
          body.min_cpu_platform = input.event.inputConfig.min_cpu_platform;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network_interfaces !== undefined)
          body.network_interfaces = input.event.inputConfig.network_interfaces;
        if (input.event.inputConfig.network_performance_config !== undefined)
          body.network_performance_config =
            input.event.inputConfig.network_performance_config;
        if (input.event.inputConfig.params !== undefined)
          body.params = input.event.inputConfig.params;
        if (input.event.inputConfig.private_ipv6_google_access !== undefined)
          body.private_ipv6_google_access =
            input.event.inputConfig.private_ipv6_google_access;
        if (input.event.inputConfig.reservation_affinity !== undefined)
          body.reservation_affinity =
            input.event.inputConfig.reservation_affinity;
        if (input.event.inputConfig.resource_policies !== undefined)
          body.resource_policies = input.event.inputConfig.resource_policies;
        if (input.event.inputConfig.resource_status !== undefined)
          body.resource_status = input.event.inputConfig.resource_status;
        if (input.event.inputConfig.satisfies_pzi !== undefined)
          body.satisfies_pzi = input.event.inputConfig.satisfies_pzi;
        if (input.event.inputConfig.satisfies_pzs !== undefined)
          body.satisfies_pzs = input.event.inputConfig.satisfies_pzs;
        if (input.event.inputConfig.scheduling !== undefined)
          body.scheduling = input.event.inputConfig.scheduling;
        if (input.event.inputConfig.self_link !== undefined)
          body.self_link = input.event.inputConfig.self_link;
        if (input.event.inputConfig.service_accounts !== undefined)
          body.service_accounts = input.event.inputConfig.service_accounts;
        if (input.event.inputConfig.shielded_instance_config !== undefined)
          body.shielded_instance_config =
            input.event.inputConfig.shielded_instance_config;
        if (
          input.event.inputConfig.shielded_instance_integrity_policy !==
          undefined
        )
          body.shielded_instance_integrity_policy =
            input.event.inputConfig.shielded_instance_integrity_policy;
        if (input.event.inputConfig.source_machine_image !== undefined)
          body.source_machine_image =
            input.event.inputConfig.source_machine_image;
        if (
          input.event.inputConfig.source_machine_image_encryption_key !==
          undefined
        )
          body.source_machine_image_encryption_key =
            input.event.inputConfig.source_machine_image_encryption_key;
        if (input.event.inputConfig.start_restricted !== undefined)
          body.start_restricted = input.event.inputConfig.start_restricted;
        if (input.event.inputConfig.status !== undefined)
          body.status = input.event.inputConfig.status;
        if (input.event.inputConfig.status_message !== undefined)
          body.status_message = input.event.inputConfig.status_message;
        if (input.event.inputConfig.tags !== undefined)
          body.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.zone !== undefined)
          body.zone = input.event.inputConfig.zone;

        const result = await computeFetch({
          config: input.app.config,
          method: "PUT",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}",
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
          client_operation_id: {
            type: "string",
            description:
              "[Output Only] The value of `requestId` if you provided it in the request. Not present otherwise.",
          },
          creation_timestamp: {
            type: "string",
            description: "[Deprecated] This field is deprecated.",
          },
          description: {
            type: "string",
            description:
              "[Output Only] A textual description of the operation, which is set when the operation is created.",
          },
          end_time: {
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
                    error_details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          error_info: {
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
                          localized_message: {
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
                          quota_info: {
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
                              future_limit: {
                                type: "number",
                                description:
                                  "Future quota limit being rolled out. The limit's unit depends on the quota  type or metric.",
                              },
                              limit: {
                                type: "number",
                                description:
                                  "Current effective quota limit. The limit's unit depends on the quota type or metric.",
                              },
                              limit_name: {
                                type: "string",
                                description: "The name of the quota limit.",
                              },
                              metric_name: {
                                type: "string",
                                description:
                                  "The Compute Engine quota metric name.",
                              },
                              rollout_status: {
                                type: "string",
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
          http_error_message: {
            type: "string",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error message that was returned, such as `NOT FOUND`.",
          },
          http_error_status_code: {
            type: "integer",
            description:
              "[Output Only] If the operation fails, this field contains the HTTP error status code that was returned. For example, a `404` means the resource was not found.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          insert_time: {
            type: "string",
            description:
              "[Output Only] The time that this operation was requested. This value is inRFC3339 text format.",
          },
          instances_bulk_insert_operation_metadata: {
            type: "object",
            properties: {
              per_location_status: {
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
          operation_group_id: {
            type: "string",
            description:
              "Output only. [Output Only] An ID that represents a group of operations, such as when a group of operations results from a `bulkInsert` API request.",
          },
          operation_type: {
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
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          set_common_instance_metadata_operation_metadata: {
            type: "object",
            properties: {
              client_operation_id: {
                type: "string",
                description: "[Output Only] The client operation id.",
              },
              per_location_operations: {
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
          start_time: {
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
          status_message: {
            type: "string",
            description:
              "[Output Only] An optional textual description of the current status of the operation.",
          },
          target_id: {
            type: "string",
            description: "64-bit integer as string",
          },
          target_link: {
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

export default update;
