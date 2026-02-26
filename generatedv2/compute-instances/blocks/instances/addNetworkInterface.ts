import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const addNetworkInterface: AppBlock = {
  name: "Instances - Add Network Interface",
  description: `Adds one dynamic network interface to an active instance.`,
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
          description:
            "The instance name for this request stored as resource_id. Name should conform to RFC1035 or be an unsigned long integer.",
          type: {
            type: "string",
          },
          required: true,
        },
        accessConfigs: {
          name: "Access Configs",
          description:
            "An array of configurations for this interface. Currently, only one access config, ONE_TO_ONE_NAT, is supported. If there are noaccessConfigs specified, then this instance will have no external internet access.",
          type: {
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
          required: false,
        },
        aliasIpRanges: {
          name: "Alias Ip Ranges",
          description:
            "An array of alias IP ranges for this network interface. You can only specify this field for network interfaces in VPC networks.",
          type: {
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
          required: false,
        },
        fingerprint: {
          name: "Fingerprint",
          description:
            "Fingerprint hash of contents stored in this network interface. This field will be ignored when inserting an Instance or adding a NetworkInterface. An up-to-date fingerprint must be provided in order to update theNetworkInterface. The request will fail with error400 Bad Request if the fingerprint is not provided, or412 Precondition Failed if the fingerprint is out of date.",
          type: {
            type: "string",
            description:
              "Fingerprint hash of contents stored in this network interface. This field will be ignored when inserting an Instance or adding a NetworkInterface. An up-to-date fingerprint must be provided in order to update theNetworkInterface. The request will fail with error400 Bad Request if the fingerprint is not provided, or412 Precondition Failed if the fingerprint is out of date.",
          },
          required: false,
        },
        igmpQuery: {
          name: "Igmp Query",
          description:
            "Indicate whether igmp query is enabled on the network interface or not. If enabled, also indicates the version of IGMP supported. Check the IgmpQuery enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Indicate whether igmp query is enabled on the network interface or not. If enabled, also indicates the version of IGMP supported. Check the IgmpQuery enum for the list of possible values.",
          },
          required: false,
        },
        internalIpv6PrefixLength: {
          name: "Internal Ipv6 Prefix Length",
          description: "The prefix length of the primary internal IPv6 range.",
          type: {
            type: "integer",
            description:
              "The prefix length of the primary internal IPv6 range.",
          },
          required: false,
        },
        ipv6AccessConfigs: {
          name: "Ipv6 Access Configs",
          description:
            "An array of IPv6 access configurations for this interface. Currently, only one IPv6 access config, DIRECT_IPV6, is supported. If there is no ipv6AccessConfig specified, then this instance will have no external IPv6 Internet access.",
          type: {
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
          required: false,
        },
        ipv6AccessType: {
          name: "Ipv6 Access Type",
          description:
            "Output only. [Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be accessed from the Internet. This field is always inherited from its subnetwork.  Valid only if stackType is IPV4_IPV6. Check the Ipv6AccessType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] One of EXTERNAL, INTERNAL to indicate whether the IP can be accessed from the Internet. This field is always inherited from its subnetwork.  Valid only if stackType is IPV4_IPV6. Check the Ipv6AccessType enum for the list of possible values.",
          },
          required: false,
        },
        ipv6Address: {
          name: "Ipv6 Address",
          description:
            "An IPv6 internal network address for this network interface. To use a static internal IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an internal IPv6 address from the instance's subnetwork.",
          type: {
            type: "string",
            description:
              "An IPv6 internal network address for this network interface. To use a static internal IP address, it must be unused and in the same region as the instance's zone. If not specified, Google Cloud will automatically assign an internal IPv6 address from the instance's subnetwork.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            "Output only. [Output Only] Type of the resource. Alwayscompute#networkInterface for network interfaces.",
          type: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#networkInterface for network interfaces.",
          },
          required: false,
        },
        name: {
          name: "Name",
          description:
            "[Output Only] The name of the network interface, which is generated by the server. For a VM, the network interface uses the nicN naming format. Where N is a value between 0 and7. The default interface value is nic0.",
          type: {
            type: "string",
            description:
              "[Output Only] The name of the network interface, which is generated by the server. For a VM, the network interface uses the nicN naming format. Where N is a value between 0 and7. The default interface value is nic0.",
          },
          required: false,
        },
        network: {
          name: "Network",
          description:
            "URL of the VPC network resource for this instance. When creating an instance, if neither the network nor the subnetwork is specified, the default network global/networks/default is used. If the selected project doesn't have the default network, you must specify a network or subnet. If the network is not specified but the subnetwork is specified, the network is inferred.  If you specify this property, you can specify the network as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/global/networks/network       - projects/project/global/networks/network       - global/networks/default",
          type: {
            type: "string",
            description:
              "URL of the VPC network resource for this instance. When creating an instance, if neither the network nor the subnetwork is specified, the default network global/networks/default is used. If the selected project doesn't have the default network, you must specify a network or subnet. If the network is not specified but the subnetwork is specified, the network is inferred.  If you specify this property, you can specify the network as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/global/networks/network       - projects/project/global/networks/network       - global/networks/default",
          },
          required: false,
        },
        networkAttachment: {
          name: "Network Attachment",
          description:
            "The URL of the network attachment that this interface should connect to in the following format: projects/{project_number}/regions/{region_name}/networkAttachments/{network_attachment_name}.",
          type: {
            type: "string",
            description:
              "The URL of the network attachment that this interface should connect to in the following format: projects/{project_number}/regions/{region_name}/networkAttachments/{network_attachment_name}.",
          },
          required: false,
        },
        networkIP: {
          name: "Network I P",
          description:
            "An IPv4 internal IP address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.",
          type: {
            type: "string",
            description:
              "An IPv4 internal IP address to assign to the instance for this network interface. If not specified by the user, an unused internal IP is assigned by the system.",
          },
          required: false,
        },
        nicType: {
          name: "Nic Type",
          description:
            "The type of vNIC to be used on this interface. This may be gVNIC or VirtioNet. Check the NicType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The type of vNIC to be used on this interface. This may be gVNIC or VirtioNet. Check the NicType enum for the list of possible values.",
          },
          required: false,
        },
        parentNicName: {
          name: "Parent Nic Name",
          description:
            "Name of the parent network interface of a dynamic network interface.",
          type: {
            type: "string",
            description:
              "Name of the parent network interface of a dynamic network interface.",
          },
          required: false,
        },
        queueCount: {
          name: "Queue Count",
          description:
            "The networking queue count that's specified by users for the network interface. Both Rx and Tx queues will be set to this number. It'll be empty if not specified by the users.",
          type: {
            type: "integer",
            description:
              "The networking queue count that's specified by users for the network interface. Both Rx and Tx queues will be set to this number. It'll be empty if not specified by the users.",
          },
          required: false,
        },
        stackType: {
          name: "Stack Type",
          description:
            "The stack type for this network interface. To assign only IPv4 addresses, use IPV4_ONLY. To assign both IPv4 and IPv6 addresses, useIPV4_IPV6. If not specified, IPV4_ONLY is used.  This field can be both set at instance creation and update network interface operations. Check the StackType enum for the list of possible values.",
          type: {
            type: "string",
            description:
              "The stack type for this network interface. To assign only IPv4 addresses, use IPV4_ONLY. To assign both IPv4 and IPv6 addresses, useIPV4_IPV6. If not specified, IPV4_ONLY is used.  This field can be both set at instance creation and update network interface operations. Check the StackType enum for the list of possible values.",
          },
          required: false,
        },
        subnetwork: {
          name: "Subnetwork",
          description:
            "The URL of the Subnetwork resource for this instance. If the network resource is inlegacy mode, do not specify this field. If the network is in auto subnet mode, specifying the subnetwork is optional. If the network is in custom subnet mode, specifying the subnetwork is required. If you specify this field, you can specify the subnetwork as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/subnetworks/subnetwork    - regions/region/subnetworks/subnetwork",
          type: {
            type: "string",
            description:
              "The URL of the Subnetwork resource for this instance. If the network resource is inlegacy mode, do not specify this field. If the network is in auto subnet mode, specifying the subnetwork is optional. If the network is in custom subnet mode, specifying the subnetwork is required. If you specify this field, you can specify the subnetwork as a full or partial URL. For example, the following are all valid URLs:         - https://www.googleapis.com/compute/v1/projects/project/regions/region/subnetworks/subnetwork    - regions/region/subnetworks/subnetwork",
          },
          required: false,
        },
        vlan: {
          name: "Vlan",
          description:
            "VLAN tag of a dynamic network interface, must be  an integer in the range from 2 to 255 inclusively.",
          type: {
            type: "integer",
            description:
              "VLAN tag of a dynamic network interface, must be  an integer in the range from 2 to 255 inclusively.",
          },
          required: false,
        },
        requestId: {
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
        if (input.event.inputConfig.requestId !== undefined)
          queryParams["requestId"] = String(input.event.inputConfig.requestId);
        const body: Record<string, any> = {};
        if (input.event.inputConfig.accessConfigs !== undefined)
          body.accessConfigs = input.event.inputConfig.accessConfigs;
        if (input.event.inputConfig.aliasIpRanges !== undefined)
          body.aliasIpRanges = input.event.inputConfig.aliasIpRanges;
        if (input.event.inputConfig.fingerprint !== undefined)
          body.fingerprint = input.event.inputConfig.fingerprint;
        if (input.event.inputConfig.igmpQuery !== undefined)
          body.igmpQuery = input.event.inputConfig.igmpQuery;
        if (input.event.inputConfig.internalIpv6PrefixLength !== undefined)
          body.internalIpv6PrefixLength =
            input.event.inputConfig.internalIpv6PrefixLength;
        if (input.event.inputConfig.ipv6AccessConfigs !== undefined)
          body.ipv6AccessConfigs = input.event.inputConfig.ipv6AccessConfigs;
        if (input.event.inputConfig.ipv6AccessType !== undefined)
          body.ipv6AccessType = input.event.inputConfig.ipv6AccessType;
        if (input.event.inputConfig.ipv6Address !== undefined)
          body.ipv6Address = input.event.inputConfig.ipv6Address;
        if (input.event.inputConfig.kind !== undefined)
          body.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.name !== undefined)
          body.name = input.event.inputConfig.name;
        if (input.event.inputConfig.network !== undefined)
          body.network = input.event.inputConfig.network;
        if (input.event.inputConfig.networkAttachment !== undefined)
          body.networkAttachment = input.event.inputConfig.networkAttachment;
        if (input.event.inputConfig.networkIP !== undefined)
          body.networkIP = input.event.inputConfig.networkIP;
        if (input.event.inputConfig.nicType !== undefined)
          body.nicType = input.event.inputConfig.nicType;
        if (input.event.inputConfig.parentNicName !== undefined)
          body.parentNicName = input.event.inputConfig.parentNicName;
        if (input.event.inputConfig.queueCount !== undefined)
          body.queueCount = input.event.inputConfig.queueCount;
        if (input.event.inputConfig.stackType !== undefined)
          body.stackType = input.event.inputConfig.stackType;
        if (input.event.inputConfig.subnetwork !== undefined)
          body.subnetwork = input.event.inputConfig.subnetwork;
        if (input.event.inputConfig.vlan !== undefined)
          body.vlan = input.event.inputConfig.vlan;

        const result = await computeFetch({
          config: input.app.config,
          method: "POST",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/addNetworkInterface",
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

export default addNetworkInterface;
