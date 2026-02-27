import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const instanceTemplatesGet: AppBlock = {
  name: "Instance Templates - Get",
  description: `Returns the specified instance template.`,
  category: "Instance Templates",
  inputs: {
    default: {
      config: {
        instanceTemplate: {
          name: "Instance Template",
          description: "The name of the instance template.",
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
        let path = `projects/{project}/global/instanceTemplates/{instanceTemplate}`;

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
          sourceInstanceParams: {
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
                        "Specifies whether the disk will be auto-deleted when the instance is\ndeleted (but not when the disk is detached from the instance).",
                    },
                    instantiateFrom: {
                      type: "string",
                      enum: [
                        "ATTACH_READ_ONLY",
                        "BLANK",
                        "CUSTOM_IMAGE",
                        "DEFAULT",
                        "DO_NOT_INCLUDE",
                        "SOURCE_IMAGE",
                        "SOURCE_IMAGE_FAMILY",
                      ],
                      description:
                        "Specifies whether to include the disk and what image to use. Possible\nvalues are:\n   \n   \n     - source-image: to use the same image that was used to\n     create the source instance's corresponding disk. Applicable to the boot\n     disk and additional read-write disks.\n     - source-image-family: to use the same image family that\n     was used to create the source instance's corresponding disk. Applicable\n     to the boot disk and additional read-write disks.\n     - custom-image: to use a user-provided image url for disk\n     creation. Applicable to the boot disk and additional read-write\n     disks. \n   - attach-read-only: to attach a read-only\n     disk. Applicable to read-only disks.\n     - do-not-include: to exclude a disk from the template.\n     Applicable to additional read-write disks, local SSDs, and read-only\n     disks.",
                    },
                    deviceName: {
                      type: "string",
                      description:
                        "Specifies the device name of the disk to which the configurations apply to.",
                    },
                    customImage: {
                      type: "string",
                      description:
                        "The custom source image to be used to restore this disk when instantiating\nthis instance template.",
                    },
                  },
                  description:
                    "A specification of the desired way to instantiate a disk in the instance\ntemplate when its created from a source instance.",
                  additionalProperties: true,
                },
                description:
                  "Attached disks configuration. If not provided, defaults are applied:\nFor boot disk and any other R/W disks, the source images for each disk\nwill be used. For read-only disks, they will be attached in read-only\nmode. Local SSD disks will be created as blank volumes.",
              },
            },
            description:
              "A specification of the parameters to use when creating the instance template\nfrom a source instance.",
            additionalProperties: true,
          },
          selfLink: {
            type: "string",
            description:
              "[Output Only] The URL for this instance template. The server defines this\nURL.",
          },
          properties: {
            type: "object",
            properties: {
              networkInterfaces: {
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
                  "An array of network access configurations for this interface.",
              },
              canIpForward: {
                type: "boolean",
                description:
                  "Enables instances created based on these properties to send packets with\nsource IP addresses other than their own and receive packets with\ndestination IP addresses other than their own. If these instances will be\nused as an IP gateway or it will be set as the next-hop in a Route\nresource, specify true. If unsure, leave this set tofalse. See theEnable IP forwarding\ndocumentation for more information.",
              },
              networkPerformanceConfig: {
                type: "object",
                properties: {
                  totalEgressBandwidthTier: {
                    type: "string",
                    enum: ["DEFAULT", "TIER_1"],
                  },
                },
                additionalProperties: true,
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels to apply to instances that are created from these properties.",
              },
              description: {
                type: "string",
                description:
                  "An optional text description for the instances that are created from these\nproperties.",
              },
              privateIpv6GoogleAccess: {
                type: "string",
                enum: [
                  "ENABLE_BIDIRECTIONAL_ACCESS_TO_GOOGLE",
                  "ENABLE_OUTBOUND_VM_ACCESS_TO_GOOGLE",
                  "INHERIT_FROM_SUBNETWORK",
                ],
                description:
                  "The private IPv6 google access type for VMs.\nIf not specified, use  INHERIT_FROM_SUBNETWORK as default.\nNote that for MachineImage, this is not supported yet.",
              },
              guestAccelerators: {
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
                  "A list of guest accelerator cards' type and count to use for instances\ncreated from these properties.",
              },
              serviceAccounts: {
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
                  "A list of service accounts with specified scopes. Access tokens for these\nservice accounts are available to the instances that are created from\nthese properties. Use metadata queries to obtain the access tokens for\nthese instances.",
              },
              machineType: {
                type: "string",
                description:
                  "The machine type to use for instances that are created from these\nproperties.\nThis field only accepts a machine type name, for example `n2-standard-4`.\nIf you use the machine type full or partial URL, for example\n`projects/my-l7ilb-project/zones/us-central1-a/machineTypes/n2-standard-4`,\nthe request will result in an `INTERNAL_ERROR`.",
              },
              resourcePolicies: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "Resource policies (names, not URLs) applied to instances created from\nthese properties.\nNote that for MachineImage, this is not supported yet.",
              },
              disks: {
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
                      description:
                        "The size of the disk in GB. (Format: int64)",
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
                  "An array of disks that are associated with the instances that are created\nfrom these properties.",
              },
              confidentialInstanceConfig: {
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
              advancedMachineFeatures: {
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
              resourceManagerTags: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Resource manager tags to be bound to the instance. Tag keys and values\nhave the same definition as resource\nmanager tags. Keys must be in the format `tagKeys/{tag_key_id}`, and\nvalues are in the format `tagValues/456`. The field is ignored (both PUT &\nPATCH) when empty.",
              },
              keyRevocationActionType: {
                type: "string",
                enum: [
                  "KEY_REVOCATION_ACTION_TYPE_UNSPECIFIED",
                  "NONE",
                  "STOP",
                ],
                description:
                  'KeyRevocationActionType of the instance. Supported options are "STOP" and\n"NONE". The default value is "NONE" if it is not specified.',
              },
              reservationAffinity: {
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
              metadata: {
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
              shieldedInstanceConfig: {
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
              minCpuPlatform: {
                type: "string",
                description:
                  'Minimum cpu/platform to be used by instances. The instance may be\nscheduled on the specified or newer cpu/platform. Applicable values are the\nfriendly names of CPU platforms, such asminCpuPlatform: "Intel Haswell" orminCpuPlatform: "Intel Sandy Bridge". For more\ninformation, read Specifying a\nMinimum CPU Platform.',
              },
              scheduling: {
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
                    enum: [
                      "FLEX_START",
                      "RESERVATION_BOUND",
                      "SPOT",
                      "STANDARD",
                    ],
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
              tags: {
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
            },
            additionalProperties: true,
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the instance template resides. Only\napplicable for regional resources.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] A unique identifier for this instance template. The server\ndefines this identifier. (Format: uint64)",
          },
          sourceInstance: {
            type: "string",
            description:
              "The source instance used to create the template. You can provide this as a\npartial or full URL to the resource. For example, the following are valid\nvalues:\n   \n   \n     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance \n   - projects/project/zones/zone/instances/instance",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          kind: {
            type: "string",
            description:
              "[Output Only] The resource type, which is alwayscompute#instanceTemplate for instance templates.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must be\na dash, lowercase letter, or digit, except the last character, which cannot\nbe a dash.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] The creation timestamp for this instance template inRFC3339\ntext format.",
          },
        },
        description:
          "Represents an Instance Template resource.\n\nGoogle Compute Engine has two Instance Template resources:\n\n* [Global](/compute/docs/reference/rest/v1/instanceTemplates)\n* [Regional](/compute/docs/reference/rest/v1/regionInstanceTemplates)\n\nYou can reuse a global instance template in\ndifferent regions whereas you can use a regional instance template in a\nspecified region only. If you want to reduce cross-region dependency or\nachieve data residency, use a regional instance template.\n\nTo create VMs, managed instance groups, and reservations, you can use either\nglobal or regional instance templates.\n\nFor more information, readInstance Templates.",
        additionalProperties: true,
      },
    },
  },
};

export default instanceTemplatesGet;
