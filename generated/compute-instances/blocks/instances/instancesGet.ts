import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const instancesGet: AppBlock = {
  name: "Instances - Get",
  description: `Returns the specified Zone resource.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
            description: "The name of the zone for this request.",
          },
          required: true,
        },
        instance: {
          name: "Instance",
          description: "Name of the instance resource to return.",
          type: {
            type: "string",
            description: "Name of the instance resource to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}",
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
              "Allows this instance to send and receive packets with non-matching destination or source IPs. This is required if you plan to use this instance to forward routes. For more information, seeEnabling IP Forwarding.",
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
          cpuPlatform: {
            type: "string",
            description:
              "Output only. [Output Only] The CPU platform used by this instance.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          deletionProtection: {
            type: "boolean",
            description:
              "Whether the resource should be protected against deletion.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
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
              "Array of disks associated with this instance. Persistent disks must be created before you can assign them.",
          },
          displayDevice: {
            type: "object",
            properties: {
              enableDisplay: {
                type: "boolean",
                description:
                  "Defines whether the instance has Display enabled.",
              },
            },
            description: "A set of Display Device options",
            additionalProperties: true,
          },
          fingerprint: {
            type: "string",
            description:
              "Specifies a fingerprint for this resource, which is essentially a hash of the instance's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update the instance. You must always provide an up-to-date fingerprint hash in order to update the instance.  To see the latest fingerprint, make get() request to the instance.",
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
              "A list of the type and count of accelerator cards attached to the instance.",
          },
          hostname: {
            type: "string",
            description:
              "Specifies the hostname of the instance. The specified hostname must be RFC1035 compliant. If hostname is not specified, the default hostname is [INSTANCE_NAME].c.[PROJECT_ID].internal when using the global DNS, and [INSTANCE_NAME].[ZONE].c.[PROJECT_ID].internal when using zonal DNS.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          instanceEncryptionKey: {
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
              "Encrypts suspended data for an instance with acustomer-managed encryption key.  If you are creating a new instance, this field will encrypt the local SSD and in-memory contents of the instance during the suspend operation.  If you do not provide an encryption key when creating the instance, then the local SSD and in-memory contents will be encrypted using an automatically generated key during the suspend operation.",
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
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#instance for instances.",
          },
          labelFingerprint: {
            type: "string",
            description:
              "A fingerprint for this request, which is essentially a hash of the label's contents and used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels.  To see the latest fingerprint, make get() request to the instance.",
          },
          labels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this instance. These can be later modified by the setLabels method.",
          },
          lastStartTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Last start timestamp inRFC3339 text format.",
          },
          lastStopTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Last stop timestamp inRFC3339 text format.",
          },
          lastSuspendedTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Last suspended timestamp inRFC3339 text format.",
          },
          machineType: {
            type: "string",
            description:
              "Full or partial URL of the machine type resource to use for this instance, in the format:zones/zone/machineTypes/machine-type. This is provided by the client when the instance is created. For example, the following is a valid partial url to a predefined machine type:  zones/us-central1-f/machineTypes/n1-standard-1   To create acustom machine type, provide a URL to a machine type in the following format, where CPUS is 1 or an even number up to 32 (2, 4, 6, ... 24, etc), and MEMORY is the total memory for this instance. Memory must be a multiple of 256 MB and must be supplied in MB (e.g. 5 GB of memory is 5120 MB):  zones/zone/machineTypes/custom-CPUS-MEMORY   For example: zones/us-central1-f/machineTypes/custom-4-5120 For a full list of restrictions, read theSpecifications for custom machine types.",
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
              'Specifies aminimum CPU platform for the VM instance. Applicable values are the friendly names of CPU platforms, such as minCpuPlatform: "Intel Haswell" or minCpuPlatform: "Intel Sandy Bridge".',
          },
          name: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating the resource. The resource name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
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
              "An array of network configurations for this instance. These specify how interfaces are configured to interact with other network services, such as connecting to the internet. Multiple interfaces are supported per instance.",
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
              "The private IPv6 google access type for the VM. If not specified, use  INHERIT_FROM_SUBNETWORK as default. Check the PrivateIpv6GoogleAccess enum for the list of possible values.",
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
          resourcePolicies: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Resource policies applied to this instance.",
          },
          resourceStatus: {
            type: "object",
            properties: {
              effectiveInstanceMetadata: {
                type: "object",
                properties: {
                  blockProjectSshKeysMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective block-project-ssh-keys value at Instance level.",
                  },
                  enableGuestAttributesMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-guest-attributes value at Instance level.",
                  },
                  enableOsInventoryMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-os-inventory value at Instance level.",
                  },
                  enableOsconfigMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-osconfig value at Instance level.",
                  },
                  enableOsloginMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-oslogin value at Instance level.",
                  },
                  serialPortEnableMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective serial-port-enable value at Instance level.",
                  },
                  serialPortLoggingEnableMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective serial-port-logging-enable value at Instance level.",
                  },
                  vmDnsSettingMetadataValue: {
                    type: "string",
                    description: "Effective VM DNS setting at Instance level.",
                  },
                },
                description:
                  "Effective values of predefined metadata keys for an instance.",
                additionalProperties: true,
              },
              physicalHost: {
                type: "string",
                description:
                  "Output only. [Output Only] The precise location of your instance within the zone's data center, including the block, sub-block, and host. The field is formatted as follows: blockId/subBlockId/hostId.",
              },
              physicalHostTopology: {
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
              reservationConsumptionInfo: {
                type: "object",
                properties: {
                  consumedReservation: {
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
                  availabilityDomain: {
                    type: "integer",
                    description:
                      "Specifies the availability domain to place the instance in. The value must be a number between 1 and the number of availability domains specified in the spread placement policy attached to the instance.",
                  },
                },
                additionalProperties: true,
              },
              upcomingMaintenance: {
                type: "object",
                properties: {
                  canReschedule: {
                    type: "boolean",
                    description:
                      "Indicates if the maintenance can be customer triggered.",
                  },
                  latestWindowStartTime: {
                    type: "string",
                    description:
                      "The latest time for the planned maintenance window to start. This timestamp value is in RFC3339 text format.",
                  },
                  maintenanceOnShutdown: {
                    type: "boolean",
                    description:
                      "Indicates whether the UpcomingMaintenance will be triggered on VM shutdown.",
                  },
                  maintenanceReasons: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
                        "UNDEFINED_MAINTENANCE_REASONS",
                        "FAILURE_DISK",
                        "FAILURE_GPU",
                        "FAILURE_GPU_MULTIPLE_FAULTY_HOSTS_CUSTOMER_REPORTED",
                        "FAILURE_GPU_NVLINK_SWITCH_CUSTOMER_REPORTED",
                        "FAILURE_GPU_TEMPERATURE",
                        "FAILURE_GPU_XID",
                        "FAILURE_INFRA",
                        "FAILURE_INTERFACE",
                        "FAILURE_MEMORY",
                        "FAILURE_NETWORK",
                        "FAILURE_NVLINK",
                        "FAILURE_REDUNDANT_HARDWARE_FAULT",
                        "FAILURE_TPU",
                        "INFRASTRUCTURE_RELOCATION",
                        "MAINTENANCE_REASON_UNKNOWN",
                        "PLANNED_NETWORK_UPDATE",
                        "PLANNED_UPDATE",
                      ],
                    },
                    description:
                      "The reasons for the maintenance. Only valid for vms. Check the MaintenanceReasons enum for the list of possible values.",
                  },
                  maintenanceStatus: {
                    type: "string",
                    enum: [
                      "UNDEFINED_MAINTENANCE_STATUS",
                      "ONGOING",
                      "PENDING",
                      "UNKNOWN",
                    ],
                    description:
                      "Check the MaintenanceStatus enum for the list of possible values.",
                  },
                  type: {
                    type: "string",
                    enum: [
                      "UNDEFINED_TYPE",
                      "MULTIPLE",
                      "SCHEDULED",
                      "UNKNOWN_TYPE",
                      "UNSCHEDULED",
                    ],
                    description:
                      "Defines the type of maintenance. Check the Type enum for the list of possible values.",
                  },
                  windowEndTime: {
                    type: "string",
                    description:
                      "The time by which the maintenance disruption will be completed. This timestamp value is in RFC3339 text format.",
                  },
                  windowStartTime: {
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
          satisfiesPzi: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
          },
          satisfiesPzs: {
            type: "boolean",
            description: "Output only. [Output Only] Reserved for future use.",
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
                enum: ["UNDEFINED_ON_HOST_MAINTENANCE", "MIGRATE", "TERMINATE"],
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
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
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
              "A list of service accounts, with their specified scopes, authorized for this instance. Only one service account per VM instance is supported.  Service accounts generate access tokens that can be accessed through the metadata server and used to authenticate applications on the instance. SeeService Accounts for more information.",
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
          shieldedInstanceIntegrityPolicy: {
            type: "object",
            properties: {
              updateAutoLearnPolicy: {
                type: "boolean",
                description:
                  "Updates the integrity policy baseline using the measurements from the VM instance's most recent boot.",
              },
            },
            description:
              "The policy describes the baseline against which Instance boot integrity is measured.",
            additionalProperties: true,
          },
          sourceMachineImage: {
            type: "string",
            description: "Source machine image",
          },
          sourceMachineImageEncryptionKey: {
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
              "Source machine image encryption key when creating an instance from a machine image.",
          },
          startRestricted: {
            type: "boolean",
            description:
              "Output only. [Output Only] Whether a VM has been restricted for start because Compute Engine has detected suspicious activity.",
          },
          status: {
            type: "string",
            enum: [
              "UNDEFINED_STATUS",
              "DEPROVISIONING",
              "PENDING",
              "PROVISIONING",
              "REPAIRING",
              "RUNNING",
              "STAGING",
              "STOPPED",
              "STOPPING",
              "SUSPENDED",
              "SUSPENDING",
              "TERMINATED",
            ],
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
          },
          statusMessage: {
            type: "string",
            description:
              "Output only. [Output Only] An optional, human-readable explanation of the status.",
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
          zone: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the zone where the instance resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        description:
          "Represents an Instance resource.  An instance is a virtual machine that is hosted on Google Cloud Platform. For more information, readVirtual Machine Instances.",
        additionalProperties: true,
      },
    },
  },
};

export default instancesGet;
