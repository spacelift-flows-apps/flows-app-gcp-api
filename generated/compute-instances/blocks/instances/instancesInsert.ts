import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instancesInsert: AppBlock = {
  name: "Instances - Insert",
  description: `Creates an instance resource in the specified project using the data included in the request.`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "[Output Only] URL of the zone where the instance resides.",
          type: {
            type: "string",
            description:
              "[Output Only] URL of the zone where the instance resides.\nYou must specify this field as part of the HTTP request URL. It is\nnot settable as a field in the request body.",
          },
          required: false,
        },
        sourceMachineImage: {
          name: "Source Machine Image",
          description: "Source machine image",
          type: {
            type: "string",
            description: "Source machine image",
          },
          required: false,
        },
        sourceInstanceTemplate: {
          name: "Source Instance Template",
          description:
            "Specifies instance template to create the instance.\n\nThis field is optional. It can be a full or partial URL. For example, the\nfollowing are all valid URLs to an instance template:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/global/instanceTemplates/instanceTemplate\n      - projects/project/global/instanceTemplates/instanceTemplate\n      - global/instanceTemplates/instanceTemplate",
          type: {
            type: "string",
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
        displayDevice: {
          name: "Display Device",
          description: "Enables display device for the instance.",
          type: {
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
          required: false,
        },
        satisfiesPzi: {
          name: "Satisfies Pzi",
          description: "[Output Only] Reserved for future use.",
          type: {
            type: "boolean",
            description: "[Output Only] Reserved for future use.",
          },
          required: false,
        },
        hostname: {
          name: "Hostname",
          description: "Specifies the hostname of the instance.",
          type: {
            type: "string",
            description:
              "Specifies the hostname of the instance. The specified hostname must be\nRFC1035 compliant. If hostname is not specified, the default hostname is\n[INSTANCE_NAME].c.[PROJECT_ID].internal when using the global DNS, and\n[INSTANCE_NAME].[ZONE].c.[PROJECT_ID].internal when using zonal DNS.",
          },
          required: false,
        },
        lastStopTimestamp: {
          name: "Last Stop Timestamp",
          description:
            "[Output Only] Last stop timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Last stop timestamp inRFC3339 text format.",
          },
          required: false,
        },
        labels: {
          name: "Labels",
          description: "Labels to apply to this instance.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels to apply to this instance. These can be later modified by\nthe setLabels method.",
          },
          required: false,
        },
        confidentialInstanceConfig: {
          name: "Confidential Instance Config",
          description: "Request body field: confidentialInstanceConfig",
          type: {
            type: "object",
            properties: {
              enableConfidentialCompute: {
                type: "boolean",
                description:
                  "Defines whether the instance should have confidential compute enabled.",
              },
              confidentialInstanceType: {
                type: "string",
                enum: [
                  "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
                  "SEV",
                  "SEV_SNP",
                  "TDX",
                ],
                description:
                  "Defines the type of technology used by the confidential instance.",
              },
            },
            description: "A set of Confidential Instance options.",
            additionalProperties: true,
          },
          required: false,
        },
        sourceMachineImageEncryptionKey: {
          name: "Source Machine Image Encryption Key",
          description:
            "Source machine image encryption key when creating an instance from a machine image.",
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
        selfLink: {
          name: "Self Link",
          description: "[Output Only] Server-defined URL for this resource.",
          type: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
          },
          required: false,
        },
        scheduling: {
          name: "Scheduling",
          description: "Sets the scheduling options for this instance.",
          type: {
            type: "object",
            properties: {
              terminationTime: {
                type: "string",
                description:
                  "Specifies the timestamp, when the instance will be terminated, inRFC3339 text format. If specified, the instance\ntermination action will be performed at the termination time.",
              },
              locationHint: {
                type: "string",
                description:
                  "An opaque location hint used to place the instance close to other\nresources.\nThis field is for use by internal tools that use the public API.",
              },
              onHostMaintenance: {
                type: "string",
                enum: ["MIGRATE", "TERMINATE"],
                description:
                  "Defines the maintenance behavior for this instance. For standard instances,\nthe default behavior is MIGRATE. Forpreemptible instances,\nthe default and only possible behavior is TERMINATE. For more\ninformation, see\n Set\n VM host maintenance policy.",
              },
              maxRunDuration: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              hostErrorTimeoutSeconds: {
                type: "integer",
                description:
                  "Specify the time in seconds for host error detection, the value must be\nwithin the range of [90, 330] with the increment of 30, if unset, the\ndefault behavior of host error recovery will be used. (Format: int32)",
              },
              instanceTerminationAction: {
                type: "string",
                enum: [
                  "DELETE",
                  "INSTANCE_TERMINATION_ACTION_UNSPECIFIED",
                  "STOP",
                ],
                description:
                  "Specifies the termination action for the instance.",
              },
              onInstanceStopAction: {
                type: "object",
                properties: {
                  discardLocalSsd: {
                    type: "boolean",
                    description:
                      "If true, the contents of any attached Local SSD disks will be discarded\nelse, the Local SSD data will be preserved when the instance is stopped\nat the end of the run duration/termination time.",
                  },
                },
                description:
                  "Defines the behaviour for instances with the instance_termination_actionSTOP.",
                additionalProperties: true,
              },
              provisioningModel: {
                type: "string",
                enum: ["FLEX_START", "RESERVATION_BOUND", "SPOT", "STANDARD"],
                description:
                  "Specifies the provisioning model of the instance.",
              },
              skipGuestOsShutdown: {
                type: "boolean",
                description:
                  "Default is false and there will be 120 seconds between GCE ACPI G2 Soft\nOff and ACPI G3 Mechanical\nOff for Standard VMs and 30 seconds for Spot VMs.",
              },
              preemptible: {
                type: "boolean",
                description:
                  "Defines whether the instance is preemptible. This can only be set during\ninstance creation or while the instance isstopped and\ntherefore, in a `TERMINATED` state. SeeInstance Life\nCycle for more information on the possible instance states.",
              },
              availabilityDomain: {
                type: "integer",
                description:
                  "Specifies the availability domain to place the instance in. The value\nmust be a number between 1 and the number of availability domains\nspecified in the spread placement policy attached to the instance. (Format: int32)",
              },
              localSsdRecoveryTimeout: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
              minNodeCpus: {
                type: "integer",
                description:
                  "The minimum number of virtual CPUs this instance will consume when running\non a sole-tenant node. (Format: int32)",
              },
              nodeAffinities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Corresponds to the label values of Node resource.",
                    },
                    operator: {
                      type: "string",
                      enum: ["IN", "NOT_IN", "OPERATOR_UNSPECIFIED"],
                      description:
                        "Defines the operation of node selection. Valid operators areIN for affinity and NOT_IN for anti-affinity.",
                    },
                    key: {
                      type: "string",
                      description:
                        "Corresponds to the label key of Node resource.",
                    },
                  },
                  description:
                    "Node Affinity: the configuration of desired nodes onto which this Instance\n could be scheduled.",
                  additionalProperties: true,
                },
                description:
                  "A set of node affinity and anti-affinity configurations. Refer toConfiguring node\naffinity for more information.\nOverrides reservationAffinity.",
              },
              automaticRestart: {
                type: "boolean",
                description:
                  "Specifies whether the instance should be automatically restarted if it is\nterminated by Compute Engine (not terminated by a user). You can only set\nthe automatic restart option for standard instances.Preemptible instances\ncannot be automatically restarted.\n\nBy default, this is set to true so an instance is\nautomatically restarted if it is terminated by Compute Engine.",
              },
            },
            description: "Sets the scheduling options for an Instance.",
            additionalProperties: true,
          },
          required: false,
        },
        lastStartTimestamp: {
          name: "Last Start Timestamp",
          description:
            "[Output Only] Last start timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Last start timestamp inRFC3339 text format.",
          },
          required: false,
        },
        instanceEncryptionKey: {
          name: "Instance Encryption Key",
          description:
            "Encrypts suspended data for an instance with acustomer-managed encryption key.",
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
                  "Resource manager tags to be bound to the instance. Tag keys and values\nhave the same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
              },
              requestValidForDuration: {
                type: "object",
                properties: {
                  nanos: {
                    type: "integer",
                    description:
                      "Span of time that's a fraction of a second at nanosecond resolution.\nDurations less than one second are represented with a 0\n`seconds` field and a positive `nanos` field. Must be from 0\nto 999,999,999 inclusive. (Format: int32)",
                  },
                  seconds: {
                    type: "string",
                    description:
                      "Span of time at a resolution of a second. Must be from 0\nto 315,576,000,000 inclusive. Note: these bounds are computed from:\n60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years (Format: int64)",
                  },
                },
                description:
                  'A Duration represents a fixed-length span of time represented\nas a count of seconds and fractions of seconds at nanosecond\nresolution. It is independent of any calendar and concepts like "day"\nor "month". Range is approximately 10,000 years.',
                additionalProperties: true,
              },
            },
            description: "Additional instance params.",
            additionalProperties: true,
          },
          required: false,
        },
        status: {
          name: "Status",
          description: "[Output Only] The status of the instance.",
          type: {
            type: "string",
            enum: [
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
              "[Output Only] The status of the instance. One of the\nfollowing values: PROVISIONING, STAGING,RUNNING, STOPPING, SUSPENDING,SUSPENDED, REPAIRING, andTERMINATED. For more information about the status of the\ninstance, see \nInstance life cycle.",
          },
          required: false,
        },
        metadata: {
          name: "Metadata",
          description:
            "The metadata key/value pairs assigned to this instance.",
          type: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    key: {
                      type: "string",
                      description:
                        "Key for the metadata entry. Keys must conform to the following\nregexp: [a-zA-Z0-9-_]+, and be less than 128 bytes in length.\nThis is reflected as part of a URL in the metadata server. Additionally, to\navoid ambiguity, keys must not conflict with any other metadata keys\nfor the project.",
                    },
                    value: {
                      type: "string",
                      description:
                        "Value for the metadata entry. These are free-form strings, and only\nhave meaning as interpreted by the image running in the instance. The\nonly restriction placed on values is that their size must be less than\nor equal to 262144 bytes (256 KiB).",
                    },
                  },
                  description: "Metadata",
                  additionalProperties: true,
                },
                description:
                  "Array of key/value pairs. The total size of all keys and values must be\nless than 512 KB.",
              },
              fingerprint: {
                type: "string",
                description:
                  "Specifies a fingerprint for this request, which is essentially a hash of\nthe metadata's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update metadata. You must always provide an\nup-to-date fingerprint hash in order to update or change metadata,\notherwise the request will fail with error412 conditionNotMet.\n\nTo see the latest fingerprint, make a get() request to\nretrieve the resource. (Format: byte)",
              },
              kind: {
                type: "string",
                description:
                  "[Output Only] Type of the resource. Always compute#metadata\nfor metadata.",
              },
            },
            description: "A metadata key/value entry.",
            additionalProperties: true,
          },
          required: false,
        },
        networkPerformanceConfig: {
          name: "Network Performance Config",
          description: "Request body field: networkPerformanceConfig",
          type: {
            type: "object",
            properties: {
              totalEgressBandwidthTier: {
                type: "string",
                enum: ["DEFAULT", "TIER_1"],
              },
            },
            additionalProperties: true,
          },
          required: false,
        },
        startRestricted: {
          name: "Start Restricted",
          description:
            "[Output Only] Whether a VM has been restricted for start because Compute Engine has detected suspicious activity.",
          type: {
            type: "boolean",
            description:
              "[Output Only] Whether a VM has been restricted for start because Compute\nEngine has detected suspicious activity.",
          },
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Specifies a fingerprint for this resource, which is essentially a hash of the instance's contents and used for optimistic locking.",
          type: {
            type: "string",
            description:
              "Specifies a fingerprint for this resource, which is essentially a hash of\nthe instance's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update the instance. You must always provide an\nup-to-date fingerprint hash in order to update the instance.\n\nTo see the latest fingerprint, make get() request to the\ninstance. (Format: byte)",
          },
          required: false,
        },
        privateIpv6GoogleAccess: {
          name: "Private Ipv6 Google Access",
          description: "The private IPv6 google access type for the VM.",
          type: {
            type: "string",
            enum: [
              "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
              "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
              "INHERIT_FROM_SUBNETWORK",
            ],
            description:
              "The private IPv6 google access type for the VM.\nIf not specified, use  INHERIT_FROM_SUBNETWORK as default.",
          },
          required: false,
        },
        disks: {
          name: "Disks",
          description: "Array of disks associated with this instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                savedState: {
                  type: "string",
                  enum: ["DISK_SAVED_STATE_UNSPECIFIED", "PRESERVED"],
                  description:
                    "For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this\nfield is set to PRESERVED if the LocalSSD data has been saved\nto a persistent location by customer request.  (see the\ndiscard_local_ssd option on Stop/Suspend).\nRead-only in the api.",
                },
                diskSizeGb: {
                  type: "string",
                  description: "The size of the disk in GB. (Format: int64)",
                },
                architecture: {
                  type: "string",
                  enum: ["ARCHITECTURE_UNSPECIFIED", "ARM64", "X86_64"],
                  description:
                    "[Output Only] The architecture of the attached disk. Valid values are ARM64\nor X86_64.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#attachedDisk for attached disks.",
                },
                source: {
                  type: "string",
                  description:
                    "Specifies a valid partial or full URL to an existing Persistent Disk\nresource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source\nis required.\n\nIf desired, you can also attach existing non-root persistent disks using\nthis property. This field is only applicable for persistent disks.\n\nNote that for InstanceTemplate, specify the disk name for zonal disk,\nand the URL for regional disk.",
                },
                licenses: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] Any valid publicly visible licenses.",
                },
                initializeParams: {
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
                autoDelete: {
                  type: "boolean",
                  description:
                    "Specifies whether the disk will be auto-deleted when the instance is\ndeleted (but not when the disk is detached from the instance).",
                },
                type: {
                  type: "string",
                  enum: ["PERSISTENT", "SCRATCH"],
                  description:
                    "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT.",
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
                index: {
                  type: "integer",
                  description:
                    "[Output Only] A zero-based index to this disk, where 0 is reserved for the\nboot disk. If you have many disks attached to an instance, each\ndisk would have a unique index number. (Format: int32)",
                },
                interface: {
                  type: "string",
                  enum: ["NVME", "SCSI"],
                  description:
                    "Specifies the disk interface to use for attaching this disk, which is\neither SCSI or NVME. For most machine types, the\ndefault is SCSI. Local SSDs can use either NVME or SCSI.\nIn certain configurations, persistent disks can use NVMe. For more\ninformation, seeAbout\npersistent disks.",
                },
                boot: {
                  type: "boolean",
                  description:
                    "Indicates that this is a boot disk. The virtual machine will use the first\npartition of the disk for its root filesystem.",
                },
                deviceName: {
                  type: "string",
                  description:
                    "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system\nrunning within the instance. This name can be used to reference the device\nfor mounting, resizing, and so on, from within the instance.\n\nIf not specified, the server chooses a default device name to apply to this\ndisk, in the form persistent-disk-x, where x is a number\nassigned by Google Compute Engine. This field is only applicable for\npersistent disks.",
                },
                mode: {
                  type: "string",
                  enum: ["READ_ONLY", "READ_WRITE"],
                  description:
                    "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk\nin READ_WRITE mode.",
                },
                forceAttach: {
                  type: "boolean",
                  description:
                    "[Input Only] Whether to force attach the regional disk even if it's\ncurrently attached to another instance. If you try to force attach a zonal\ndisk to an instance, you will receive an error.",
                },
              },
              description: "An instance-attached disk resource.",
              additionalProperties: true,
            },
            description:
              "Array of disks associated with this instance. Persistent disks must be\ncreated before you can assign them.",
          },
          required: false,
        },
        keyRevocationActionType: {
          name: "Key Revocation Action Type",
          description: "KeyRevocationActionType of the instance.",
          type: {
            type: "string",
            enum: ["KEY_REVOCATION_ACTION_TYPE_UNSPECIFIED", "NONE", "STOP"],
            description:
              'KeyRevocationActionType of the instance. Supported options are "STOP" and\n"NONE". The default value is "NONE" if it is not specified.',
          },
          required: false,
        },
        minCpuPlatform: {
          name: "Min Cpu Platform",
          description: "Specifies aminimum CPU platform for the VM instance.",
          type: {
            type: "string",
            description:
              'Specifies aminimum CPU\nplatform for the VM instance. Applicable values are the friendly names\nof CPU platforms, such as minCpuPlatform: "Intel\nHaswell" or minCpuPlatform: "Intel Sandy\nBridge".',
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "[Output Only] Type of the resource.",
          type: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Always compute#instance\nfor instances.",
          },
          required: false,
        },
        statusMessage: {
          name: "Status Message",
          description:
            "[Output Only] An optional, human-readable explanation of the status.",
          type: {
            type: "string",
            description:
              "[Output Only] An optional, human-readable explanation of the status.",
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
              "[Output Only] Creation timestamp inRFC3339 text format.",
          },
          required: false,
        },
        shieldedInstanceIntegrityPolicy: {
          name: "Shielded Instance Integrity Policy",
          description: "Request body field: shieldedInstanceIntegrityPolicy",
          type: {
            type: "object",
            properties: {
              updateAutoLearnPolicy: {
                type: "boolean",
                description:
                  "Updates the integrity policy baseline using the\nmeasurements from the VM instance's most recent boot.",
              },
            },
            description:
              "The policy describes the baseline against which\nInstance boot integrity is measured.",
            additionalProperties: true,
          },
          required: false,
        },
        lastSuspendedTimestamp: {
          name: "Last Suspended Timestamp",
          description:
            "[Output Only] Last suspended timestamp inRFC3339 text format.",
          type: {
            type: "string",
            description:
              "[Output Only] Last suspended timestamp inRFC3339 text format.",
          },
          required: false,
        },
        deletionProtection: {
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
        machineType: {
          name: "Machine Type",
          description:
            "Full or partial URL of the machine type resource to use for this instance, in the format:zones/zone/machineTypes/machine-type.",
          type: {
            type: "string",
            description:
              "Full or partial URL of the machine type resource to use for this instance,\nin the format:zones/zone/machineTypes/machine-type. This is provided by the client\nwhen the instance is created. For example, the following is a valid partial\nurl to a predefined\nmachine type:\n\nzones/us-central1-f/machineTypes/n1-standard-1\n\n\nTo create acustom\nmachine type, provide a URL to a machine type in the following format,\nwhere CPUS is 1 or an even number up to 32 (2,\n4, 6, ... 24, etc), and MEMORY is the total\nmemory for this instance. Memory must be a multiple of 256 MB and must\nbe supplied in MB (e.g. 5 GB of memory is 5120 MB):\n\nzones/zone/machineTypes/custom-CPUS-MEMORY\n\n\nFor example: zones/us-central1-f/machineTypes/custom-4-5120\nFor a full list of restrictions, read theSpecifications\nfor custom machine types.",
          },
          required: false,
        },
        canIpForward: {
          name: "Can IP Forward",
          description:
            "Allows this instance to send and receive packets with non-matching destination or source IPs.",
          type: {
            type: "boolean",
            description:
              "Allows this instance to send and receive packets with non-matching\ndestination or source IPs. This is required if you plan to use this\ninstance to forward routes. For more information, seeEnabling IP Forwarding.",
          },
          required: false,
        },
        cpuPlatform: {
          name: "Cpu Platform",
          description: "[Output Only] The CPU platform used by this instance.",
          type: {
            type: "string",
            description:
              "[Output Only] The CPU platform used by this instance.",
          },
          required: false,
        },
        reservationAffinity: {
          name: "Reservation Affinity",
          description:
            "Specifies the reservations that this instance can consume from.",
          type: {
            type: "object",
            properties: {
              consumeReservationType: {
                type: "string",
                enum: [
                  "ANY_RESERVATION",
                  "NO_RESERVATION",
                  "SPECIFIC_RESERVATION",
                  "UNSPECIFIED",
                ],
                description:
                  "Specifies the type of reservation from which this instance can consume\nresources: ANY_RESERVATION (default),SPECIFIC_RESERVATION, or NO_RESERVATION. See\nConsuming reserved instances for examples.",
              },
              values: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  'Corresponds to the label values of a reservation resource. This can be\neither a name to a reservation in the same project or\n"projects/different-project/reservations/some-reservation-name" to target a\nshared reservation in the same zone but in a different project.',
              },
              key: {
                type: "string",
                description:
                  "Corresponds to the label key of a reservation resource. To target aSPECIFIC_RESERVATION by name, specifygoogleapis.com/reservation-name as the key and specify\nthe name of your reservation as its value.",
              },
            },
            description:
              "Specifies the reservations that this instance can consume from.",
            additionalProperties: true,
          },
          required: false,
        },
        serviceAccounts: {
          name: "Service Accounts",
          description:
            "A list of service accounts, with their specified scopes, authorized for this instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                scopes: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "The list of scopes to be made available for this service account.",
                },
                email: {
                  type: "string",
                  description: "Email address of the service account.",
                },
              },
              description: "A service account.",
              additionalProperties: true,
            },
            description:
              "A list of service accounts, with their specified scopes, authorized for\nthis instance. Only one service account per VM instance is supported.\n\nService accounts generate access tokens that can be accessed\nthrough the metadata server and used to authenticate applications on the\ninstance. SeeService Accounts\nfor more information.",
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
        resourcePolicies: {
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
        name: {
          name: "Name",
          description:
            "The name of the resource, provided by the client when initially creating the resource.",
          type: {
            type: "string",
            description:
              "The name of the resource, provided by the client when initially creating\nthe resource. The resource name must be 1-63 characters long, and comply\nwithRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
          },
          required: false,
        },
        guestAccelerators: {
          name: "Guest Accelerators",
          description:
            "A list of the type and count of accelerator cards attached to the instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                acceleratorCount: {
                  type: "integer",
                  description:
                    "The number of the guest accelerator cards exposed to this instance. (Format: int32)",
                },
                acceleratorType: {
                  type: "string",
                  description:
                    "Full or partial URL of the accelerator type resource to attach to this\ninstance. For example:projects/my-project/zones/us-central1-c/acceleratorTypes/nvidia-tesla-p100\nIf you are creating an instance template, specify only the\naccelerator name.\nSee GPUs on Compute Engine\nfor a full list of accelerator types.",
                },
              },
              description:
                "A specification of the type and number of accelerator cards attached to the\ninstance.",
              additionalProperties: true,
            },
            description:
              "A list of the type and count of accelerator cards attached to the instance.",
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
        tags: {
          name: "Tags",
          description: "Tags to apply to this instance.",
          type: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "An array of tags. Each tag must be 1-63 characters long, and comply\nwith RFC1035.",
              },
              fingerprint: {
                type: "string",
                description:
                  "Specifies a fingerprint for this request, which is essentially a hash of\nthe tags' contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update tags. You must always provide an\nup-to-date fingerprint hash in order to update or change tags.\n\nTo see the latest fingerprint, make get() request to the\ninstance. (Format: byte)",
              },
            },
            description: "A set of instance tags.",
            additionalProperties: true,
          },
          required: false,
        },
        resourceStatus: {
          name: "Resource Status",
          description:
            "[Output Only] Specifies values set for instance attributes as compared to the values requested by user in the corresponding input only field.",
          type: {
            type: "object",
            properties: {
              physicalHost: {
                type: "string",
                description:
                  "[Output Only] The precise location of your instance within the zone's data\ncenter, including the block, sub-block, and host. The field is formatted as\nfollows: blockId/subBlockId/hostId.",
              },
              physicalHostTopology: {
                type: "object",
                properties: {
                  host: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the host on which the running instance is located.\nInstances on the same host experience the lowest possible network\nlatency.",
                  },
                  cluster: {
                    type: "string",
                    description:
                      "[Output Only] The global name of the Compute Engine cluster where the\nrunning instance is located.",
                  },
                  subblock: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the sub-block in which the running instance is\nlocated. Instances in the same sub-block experience lower network latency\nthan instances in the same block.",
                  },
                  block: {
                    type: "string",
                    description:
                      "[Output Only] The ID of the block in which the running instance is\nlocated. Instances within the same block experience low network latency.",
                  },
                },
                description:
                  "Represents the physical host topology of the host on which the VM is\nrunning.",
                additionalProperties: true,
              },
              scheduling: {
                type: "object",
                properties: {
                  availabilityDomain: {
                    type: "integer",
                    description:
                      "Specifies the availability domain to place the instance in. The value\nmust be a number between 1 and the number of availability domains\nspecified in the spread placement policy attached to the instance. (Format: int32)",
                  },
                },
                additionalProperties: true,
              },
              upcomingMaintenance: {
                type: "object",
                properties: {
                  latestWindowStartTime: {
                    type: "string",
                    description:
                      "The latest time for the planned maintenance window to start.\nThis timestamp value is in RFC3339 text format.",
                  },
                  maintenanceReasons: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: [
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
                      "The reasons for the maintenance. Only valid for vms.",
                  },
                  windowEndTime: {
                    type: "string",
                    description:
                      "The time by which the maintenance disruption will be completed.\nThis timestamp value is in RFC3339 text format.",
                  },
                  maintenanceOnShutdown: {
                    type: "boolean",
                    description:
                      "Indicates whether the UpcomingMaintenance will be triggered on VM shutdown.",
                  },
                  canReschedule: {
                    type: "boolean",
                    description:
                      "Indicates if the maintenance can be customer triggered.",
                  },
                  type: {
                    type: "string",
                    enum: [
                      "MULTIPLE",
                      "SCHEDULED",
                      "UNKNOWN_TYPE",
                      "UNSCHEDULED",
                    ],
                    description: "Defines the type of maintenance.",
                  },
                  windowStartTime: {
                    type: "string",
                    description:
                      "The current start time of the maintenance window.\nThis timestamp value is in RFC3339 text format.",
                  },
                  maintenanceStatus: {
                    type: "string",
                    enum: ["ONGOING", "PENDING", "UNKNOWN"],
                  },
                },
                description: "Upcoming Maintenance notification information.",
                additionalProperties: true,
              },
              effectiveInstanceMetadata: {
                type: "object",
                properties: {
                  enableGuestAttributesMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-guest-attributes value at Instance level.",
                  },
                  blockProjectSshKeysMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective block-project-ssh-keys value at Instance level.",
                  },
                  enableOsloginMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective enable-oslogin value at Instance level.",
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
                  serialPortEnableMetadataValue: {
                    type: "boolean",
                    description:
                      "Effective serial-port-enable value at Instance level.",
                  },
                },
                description:
                  "Effective values of predefined metadata keys for an instance.",
                additionalProperties: true,
              },
              reservationConsumptionInfo: {
                type: "object",
                properties: {
                  consumedReservation: {
                    type: "string",
                    description:
                      "[Output Only] The full resource name of the reservation that this\ninstance is consuming from.",
                  },
                },
                description:
                  "Reservation consumption information that the instance is consuming from.",
                additionalProperties: true,
              },
            },
            description:
              "Contains output only fields.\nUse this sub-message for actual values set on Instance attributes as compared\nto the value requested by the user (intent) in their instance CRUD calls.",
            additionalProperties: true,
          },
          required: false,
        },
        shieldedInstanceConfig: {
          name: "Shielded Instance Config",
          description: "Request body field: shieldedInstanceConfig",
          type: {
            type: "object",
            properties: {
              enableSecureBoot: {
                type: "boolean",
                description:
                  "Defines whether the instance has Secure Boot enabled.Disabled by\ndefault.",
              },
              enableIntegrityMonitoring: {
                type: "boolean",
                description:
                  "Defines whether the instance has integrity monitoring enabled.Enabled by\ndefault.",
              },
              enableVtpm: {
                type: "boolean",
                description:
                  "Defines whether the instance has the vTPM enabled.Enabled by\ndefault.",
              },
            },
            description: "A set of Shielded Instance options.",
            additionalProperties: true,
          },
          required: false,
        },
        advancedMachineFeatures: {
          name: "Advanced Machine Features",
          description:
            "Controls for advanced machine-related behavior features.",
          type: {
            type: "object",
            properties: {
              performanceMonitoringUnit: {
                type: "string",
                enum: [
                  "ARCHITECTURAL",
                  "ENHANCED",
                  "PERFORMANCE_MONITORING_UNIT_UNSPECIFIED",
                  "STANDARD",
                ],
                description:
                  "Type of Performance Monitoring Unit requested on instance.",
              },
              visibleCoreCount: {
                type: "integer",
                description:
                  "The number of physical cores to expose to an instance. Multiply by\nthe number of threads per core to compute the total number of virtual\nCPUs to expose to the instance. If unset, the number of cores is\ninferred from the instance's nominal CPU count and the underlying\nplatform's SMT width. (Format: int32)",
              },
              threadsPerCore: {
                type: "integer",
                description:
                  "The number of threads per physical core. To disable simultaneous\nmultithreading (SMT) set this to 1. If unset, the maximum number\nof threads supported per core by the underlying processor is\nassumed. (Format: int32)",
              },
              enableNestedVirtualization: {
                type: "boolean",
                description:
                  "Whether to enable nested virtualization or not (default is false).",
              },
              turboMode: {
                type: "string",
                description:
                  "Turbo frequency mode to use for the instance.\nSupported modes include:\n* ALL_CORE_MAX\n\nUsing empty string or not setting this field will use the platform-specific\ndefault turbo mode.",
              },
              enableUefiNetworking: {
                type: "boolean",
                description:
                  "Whether to enable UEFI networking for instance creation.",
              },
            },
            description:
              "Specifies options for controlling advanced machine features.\nOptions that would traditionally be configured in a BIOS belong\nhere. Features that require operating system support may have\ncorresponding entries in the GuestOsFeatures of anImage (e.g., whether or not the OS in theImage supports nested virtualization being enabled or\ndisabled).",
            additionalProperties: true,
          },
          required: false,
        },
        networkInterfaces: {
          name: "Network Interfaces",
          description: "An array of network configurations for this instance.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                network: {
                  type: "string",
                  description:
                    "URL of the VPC network resource for this instance. When creating an\ninstance, if neither the network nor the subnetwork is specified, the\ndefault network global/networks/default is used. If the\nselected project doesn't have the default network, you must specify a\nnetwork or subnet. If the network is not specified but the subnetwork is\nspecified, the network is inferred.\n\nIf you specify this property, you can specify the network as\na full or partial URL. For example, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/global/networks/network\n      - projects/project/global/networks/network\n      - global/networks/default",
                },
                name: {
                  type: "string",
                  description:
                    "[Output Only] The name of the network interface, which is generated by the\nserver. For a VM, the network interface uses the nicN naming\nformat. Where N is a value between 0 and7. The default interface value is nic0.",
                },
                ipv6AccessType: {
                  type: "string",
                  enum: ["EXTERNAL", "INTERNAL"],
                  description:
                    "[Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be\naccessed from the Internet. This field is always inherited from its\nsubnetwork.\n\nValid only if stackType is IPV4_IPV6.",
                },
                networkIP: {
                  type: "string",
                  description:
                    "An IPv4 internal IP address to assign to the instance for this network\ninterface. If not specified by the user, an unused internal IP is\nassigned by the system.",
                },
                nicType: {
                  type: "string",
                  enum: [
                    "GVNIC",
                    "IDPF",
                    "IRDMA",
                    "MRDMA",
                    "UNSPECIFIED_NIC_TYPE",
                    "VIRTIO_NET",
                  ],
                  description:
                    "The type of vNIC to be used on this interface. This may be gVNIC or\nVirtioNet.",
                },
                igmpQuery: {
                  type: "string",
                  enum: ["IGMP_QUERY_DISABLED", "IGMP_QUERY_V2"],
                  description:
                    "Indicate whether igmp query is enabled on the network interface\nor not. If enabled, also indicates the version of IGMP supported.",
                },
                aliasIpRanges: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      subnetworkRangeName: {
                        type: "string",
                        description:
                          "The name of a subnetwork secondary IP range from which to allocate an IP\nalias range. If not specified, the primary range of the subnetwork is used.",
                      },
                      ipCidrRange: {
                        type: "string",
                        description:
                          "The IP alias ranges to allocate for this interface. This IP CIDR range\nmust belong to the specified subnetwork and cannot contain IP addresses\nreserved by system or used by other network interfaces. This range may be\na single IP address (such as 10.2.3.4), a netmask (such as/24) or a CIDR-formatted string (such as10.1.2.0/24).",
                      },
                    },
                    description:
                      "An alias IP range attached to an instance's network interface.",
                    additionalProperties: true,
                  },
                  description:
                    "An array of alias IP ranges for this network interface.\nYou can only specify this field for network interfaces in VPC networks.",
                },
                networkAttachment: {
                  type: "string",
                  description:
                    "The URL of the network attachment that this interface should connect\nto in the following format:\nprojects/{project_number}/regions/{region_name}/networkAttachments/{network_attachment_name}.",
                },
                vlan: {
                  type: "integer",
                  description:
                    "VLAN tag of a dynamic network interface, must be  an integer in the range\nfrom 2 to 255 inclusively. (Format: int32)",
                },
                ipv6Address: {
                  type: "string",
                  description:
                    "An IPv6 internal network address for this network interface. To\nuse a static internal IP address, it must be unused and in the same region\nas the instance's zone. If not specified, Google Cloud will automatically\nassign an internal IPv6 address from the instance's subnetwork.",
                },
                queueCount: {
                  type: "integer",
                  description:
                    "The networking queue count that's specified by users for the network\ninterface. Both Rx and Tx queues will be set to this number. It'll be empty\nif not specified by the users. (Format: int32)",
                },
                ipv6AccessConfigs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        description:
                          "[Output Only] Type of the resource. Alwayscompute#accessConfig for access configs.",
                      },
                      setPublicPtr: {
                        type: "boolean",
                        description:
                          "Specifies whether a public DNS 'PTR' record should be created to map the\nexternal IP address of the instance to a DNS domain name.\n\nThis field is not used in ipv6AccessConfig. A default PTR\nrecord will be created if the VM has external IPv6 range associated.",
                      },
                      externalIpv6PrefixLength: {
                        type: "integer",
                        description:
                          "Applies to ipv6AccessConfigs only. The prefix length of the\nexternal IPv6 range. (Format: int32)",
                      },
                      type: {
                        type: "string",
                        enum: ["DIRECT_IPV6", "ONE_TO_ONE_NAT"],
                        description:
                          "The type of configuration. In accessConfigs (IPv4), the\ndefault and only option is ONE_TO_ONE_NAT. Inipv6AccessConfigs, the default and only option isDIRECT_IPV6.",
                      },
                      externalIpv6: {
                        type: "string",
                        description:
                          "Applies to ipv6AccessConfigs only.\nThe first IPv6 address of the external IPv6 range associated\nwith this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To\nuse a static external IP address, it must be unused and in the same region\nas the instance's zone. If not specified, Google Cloud will automatically\nassign an external IPv6 address from the instance's subnetwork.",
                      },
                      natIP: {
                        type: "string",
                        description:
                          "Applies to accessConfigs (IPv4) only. Anexternal IP\naddress associated with this instance. Specify an unused static\nexternal IP address available to the project or leave this field undefined\nto use an IP from a shared ephemeral IP address pool. If you specify a\nstatic external IP address, it must live in the same region as the zone of\nthe instance.",
                      },
                      networkTier: {
                        type: "string",
                        enum: [
                          "FIXED_STANDARD",
                          "PREMIUM",
                          "STANDARD",
                          "STANDARD_OVERRIDES_FIXED_STANDARD",
                        ],
                        description:
                          "This signifies the networking tier used for configuring this access\nconfiguration and can only take the following values: PREMIUM,STANDARD.\n\nIf an AccessConfig is specified without a valid external IP address, an\nephemeral IP will be created with this networkTier.\n\nIf an AccessConfig with a valid external IP address is specified, it must\nmatch that of the networkTier associated with the Address resource owning\nthat IP.",
                      },
                      securityPolicy: {
                        type: "string",
                        description:
                          "The resource URL for the security policy associated with this access\nconfig.",
                      },
                      publicPtrDomainName: {
                        type: "string",
                        description:
                          "The DNS domain name for the public PTR record.\n\nYou can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for\nfirst IP in associated external IPv6 range.",
                      },
                      name: {
                        type: "string",
                        description:
                          "The name of this access configuration. In accessConfigs\n(IPv4), the default and recommended name is External NAT, but\nyou can use any arbitrary string, such as My external IP orNetwork Access. In ipv6AccessConfigs, the\nrecommend name is External IPv6.",
                      },
                    },
                    description:
                      "An access configuration attached to an instance's network interface.\nOnly one access config per instance is supported.",
                    additionalProperties: true,
                  },
                  description:
                    "An array of IPv6 access configurations for this interface. Currently, only\none IPv6 access config, DIRECT_IPV6, is supported. If there\nis no ipv6AccessConfig specified, then this instance will\nhave no external IPv6 Internet access.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "The URL of the Subnetwork resource for this instance. If the network\nresource is inlegacy\nmode, do not specify this field. If the network is in auto subnet\nmode, specifying the subnetwork is optional. If the network is in custom\nsubnet mode, specifying the subnetwork is required. If you specify this\nfield, you can specify the subnetwork as a full or partial URL. For\nexample, the following are all valid URLs:\n   \n   \n      - https://www.googleapis.com/compute/v1/projects/project/regions/region/subnetworks/subnetwork \n   - regions/region/subnetworks/subnetwork",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint hash of contents stored in this network interface.\nThis field will be ignored when inserting an Instance or\nadding a NetworkInterface. An up-to-date\nfingerprint must be provided in order to update theNetworkInterface. The request will fail with error400 Bad Request if the fingerprint is not provided, or412 Precondition Failed if the fingerprint is out of date. (Format: byte)",
                },
                parentNicName: {
                  type: "string",
                  description:
                    "Name of the parent network interface of a dynamic network interface.",
                },
                stackType: {
                  type: "string",
                  enum: ["IPV4_IPV6", "IPV4_ONLY", "IPV6_ONLY"],
                  description:
                    "The stack type for this network interface. To assign only IPv4 addresses,\nuse IPV4_ONLY. To assign both IPv4 and IPv6 addresses, useIPV4_IPV6. If not specified, IPV4_ONLY is used.\n\nThis field can be both set at instance creation and update network\ninterface operations.",
                },
                kind: {
                  type: "string",
                  description:
                    "[Output Only] Type of the resource. Alwayscompute#networkInterface for network interfaces.",
                },
                accessConfigs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: {
                        type: "string",
                        description:
                          "[Output Only] Type of the resource. Alwayscompute#accessConfig for access configs.",
                      },
                      setPublicPtr: {
                        type: "boolean",
                        description:
                          "Specifies whether a public DNS 'PTR' record should be created to map the\nexternal IP address of the instance to a DNS domain name.\n\nThis field is not used in ipv6AccessConfig. A default PTR\nrecord will be created if the VM has external IPv6 range associated.",
                      },
                      externalIpv6PrefixLength: {
                        type: "integer",
                        description:
                          "Applies to ipv6AccessConfigs only. The prefix length of the\nexternal IPv6 range. (Format: int32)",
                      },
                      type: {
                        type: "string",
                        enum: ["DIRECT_IPV6", "ONE_TO_ONE_NAT"],
                        description:
                          "The type of configuration. In accessConfigs (IPv4), the\ndefault and only option is ONE_TO_ONE_NAT. Inipv6AccessConfigs, the default and only option isDIRECT_IPV6.",
                      },
                      externalIpv6: {
                        type: "string",
                        description:
                          "Applies to ipv6AccessConfigs only.\nThe first IPv6 address of the external IPv6 range associated\nwith this instance, prefix length is stored inexternalIpv6PrefixLength in ipv6AccessConfig. To\nuse a static external IP address, it must be unused and in the same region\nas the instance's zone. If not specified, Google Cloud will automatically\nassign an external IPv6 address from the instance's subnetwork.",
                      },
                      natIP: {
                        type: "string",
                        description:
                          "Applies to accessConfigs (IPv4) only. Anexternal IP\naddress associated with this instance. Specify an unused static\nexternal IP address available to the project or leave this field undefined\nto use an IP from a shared ephemeral IP address pool. If you specify a\nstatic external IP address, it must live in the same region as the zone of\nthe instance.",
                      },
                      networkTier: {
                        type: "string",
                        enum: [
                          "FIXED_STANDARD",
                          "PREMIUM",
                          "STANDARD",
                          "STANDARD_OVERRIDES_FIXED_STANDARD",
                        ],
                        description:
                          "This signifies the networking tier used for configuring this access\nconfiguration and can only take the following values: PREMIUM,STANDARD.\n\nIf an AccessConfig is specified without a valid external IP address, an\nephemeral IP will be created with this networkTier.\n\nIf an AccessConfig with a valid external IP address is specified, it must\nmatch that of the networkTier associated with the Address resource owning\nthat IP.",
                      },
                      securityPolicy: {
                        type: "string",
                        description:
                          "The resource URL for the security policy associated with this access\nconfig.",
                      },
                      publicPtrDomainName: {
                        type: "string",
                        description:
                          "The DNS domain name for the public PTR record.\n\nYou can set this field only if the `setPublicPtr` field is enabled inaccessConfig. If this field is unspecified inipv6AccessConfig, a default PTR record will be created for\nfirst IP in associated external IPv6 range.",
                      },
                      name: {
                        type: "string",
                        description:
                          "The name of this access configuration. In accessConfigs\n(IPv4), the default and recommended name is External NAT, but\nyou can use any arbitrary string, such as My external IP orNetwork Access. In ipv6AccessConfigs, the\nrecommend name is External IPv6.",
                      },
                    },
                    description:
                      "An access configuration attached to an instance's network interface.\nOnly one access config per instance is supported.",
                    additionalProperties: true,
                  },
                  description:
                    "An array of configurations for this interface. Currently, only one access\nconfig, ONE_TO_ONE_NAT, is supported. If there are noaccessConfigs specified, then this instance will have\nno external internet access.",
                },
                internalIpv6PrefixLength: {
                  type: "integer",
                  description:
                    "The prefix length of the primary internal IPv6 range. (Format: int32)",
                },
              },
              description:
                "A network interface resource attached to an instance.",
              additionalProperties: true,
            },
            description:
              "An array of network configurations for this instance. These specify how\ninterfaces are configured to interact with other network services, such as\nconnecting to the internet. Multiple interfaces are supported\nper instance.",
          },
          required: false,
        },
        labelFingerprint: {
          name: "Label Fingerprint",
          description:
            "A fingerprint for this request, which is essentially a hash of the label's contents and used for optimistic locking.",
          type: {
            type: "string",
            description:
              "A fingerprint for this request, which is essentially a hash of\nthe label's contents and used for optimistic locking. The\nfingerprint is initially generated by Compute Engine and changes after\nevery request to modify or update labels. You must always provide an\nup-to-date fingerprint hash in order to update or change labels.\n\nTo see the latest fingerprint, make get() request to the\ninstance. (Format: byte)",
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
        let path = `projects/{project}/zones/{zone}/instances`;

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

        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.displayDevice !== undefined)
          requestBody.displayDevice = input.event.inputConfig.displayDevice;
        if (input.event.inputConfig.satisfiesPzi !== undefined)
          requestBody.satisfiesPzi = input.event.inputConfig.satisfiesPzi;
        if (input.event.inputConfig.hostname !== undefined)
          requestBody.hostname = input.event.inputConfig.hostname;
        if (input.event.inputConfig.lastStopTimestamp !== undefined)
          requestBody.lastStopTimestamp =
            input.event.inputConfig.lastStopTimestamp;
        if (input.event.inputConfig.labels !== undefined)
          requestBody.labels = input.event.inputConfig.labels;
        if (input.event.inputConfig.confidentialInstanceConfig !== undefined)
          requestBody.confidentialInstanceConfig =
            input.event.inputConfig.confidentialInstanceConfig;
        if (
          input.event.inputConfig.sourceMachineImageEncryptionKey !== undefined
        )
          requestBody.sourceMachineImageEncryptionKey =
            input.event.inputConfig.sourceMachineImageEncryptionKey;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;
        if (input.event.inputConfig.scheduling !== undefined)
          requestBody.scheduling = input.event.inputConfig.scheduling;
        if (input.event.inputConfig.lastStartTimestamp !== undefined)
          requestBody.lastStartTimestamp =
            input.event.inputConfig.lastStartTimestamp;
        if (input.event.inputConfig.instanceEncryptionKey !== undefined)
          requestBody.instanceEncryptionKey =
            input.event.inputConfig.instanceEncryptionKey;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.status !== undefined)
          requestBody.status = input.event.inputConfig.status;
        if (input.event.inputConfig.metadata !== undefined)
          requestBody.metadata = input.event.inputConfig.metadata;
        if (input.event.inputConfig.networkPerformanceConfig !== undefined)
          requestBody.networkPerformanceConfig =
            input.event.inputConfig.networkPerformanceConfig;
        if (input.event.inputConfig.startRestricted !== undefined)
          requestBody.startRestricted = input.event.inputConfig.startRestricted;
        if (input.event.inputConfig.zone !== undefined)
          requestBody.zone = input.event.inputConfig.zone;
        if (input.event.inputConfig.fingerprint !== undefined)
          requestBody.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.privateIpv6GoogleAccess !== undefined)
          requestBody.privateIpv6GoogleAccess =
            input.event.inputConfig.privateIpv6GoogleAccess;
        if (input.event.inputConfig.disks !== undefined)
          requestBody.disks = input.event.inputConfig.disks;
        if (input.event.inputConfig.keyRevocationActionType !== undefined)
          requestBody.keyRevocationActionType =
            input.event.inputConfig.keyRevocationActionType;
        if (input.event.inputConfig.minCpuPlatform !== undefined)
          requestBody.minCpuPlatform = input.event.inputConfig.minCpuPlatform;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.statusMessage !== undefined)
          requestBody.statusMessage = input.event.inputConfig.statusMessage;
        if (input.event.inputConfig.creationTimestamp !== undefined)
          requestBody.creationTimestamp =
            input.event.inputConfig.creationTimestamp;
        if (
          input.event.inputConfig.shieldedInstanceIntegrityPolicy !== undefined
        )
          requestBody.shieldedInstanceIntegrityPolicy =
            input.event.inputConfig.shieldedInstanceIntegrityPolicy;
        if (input.event.inputConfig.lastSuspendedTimestamp !== undefined)
          requestBody.lastSuspendedTimestamp =
            input.event.inputConfig.lastSuspendedTimestamp;
        if (input.event.inputConfig.deletionProtection !== undefined)
          requestBody.deletionProtection =
            input.event.inputConfig.deletionProtection;
        if (input.event.inputConfig.machineType !== undefined)
          requestBody.machineType = input.event.inputConfig.machineType;
        if (input.event.inputConfig.canIpForward !== undefined)
          requestBody.canIpForward = input.event.inputConfig.canIpForward;
        if (input.event.inputConfig.sourceMachineImage !== undefined)
          requestBody.sourceMachineImage =
            input.event.inputConfig.sourceMachineImage;
        if (input.event.inputConfig.cpuPlatform !== undefined)
          requestBody.cpuPlatform = input.event.inputConfig.cpuPlatform;
        if (input.event.inputConfig.reservationAffinity !== undefined)
          requestBody.reservationAffinity =
            input.event.inputConfig.reservationAffinity;
        if (input.event.inputConfig.serviceAccounts !== undefined)
          requestBody.serviceAccounts = input.event.inputConfig.serviceAccounts;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.resourcePolicies !== undefined)
          requestBody.resourcePolicies =
            input.event.inputConfig.resourcePolicies;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.guestAccelerators !== undefined)
          requestBody.guestAccelerators =
            input.event.inputConfig.guestAccelerators;
        if (input.event.inputConfig.satisfiesPzs !== undefined)
          requestBody.satisfiesPzs = input.event.inputConfig.satisfiesPzs;
        if (input.event.inputConfig.tags !== undefined)
          requestBody.tags = input.event.inputConfig.tags;
        if (input.event.inputConfig.resourceStatus !== undefined)
          requestBody.resourceStatus = input.event.inputConfig.resourceStatus;
        if (input.event.inputConfig.shieldedInstanceConfig !== undefined)
          requestBody.shieldedInstanceConfig =
            input.event.inputConfig.shieldedInstanceConfig;
        if (input.event.inputConfig.advancedMachineFeatures !== undefined)
          requestBody.advancedMachineFeatures =
            input.event.inputConfig.advancedMachineFeatures;
        if (input.event.inputConfig.networkInterfaces !== undefined)
          requestBody.networkInterfaces =
            input.event.inputConfig.networkInterfaces;
        if (input.event.inputConfig.labelFingerprint !== undefined)
          requestBody.labelFingerprint =
            input.event.inputConfig.labelFingerprint;

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

export default instancesInsert;
