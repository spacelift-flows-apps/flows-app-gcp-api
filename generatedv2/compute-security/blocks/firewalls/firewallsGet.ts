import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const firewallsGet: AppBlock = {
  name: "Firewalls - Get",
  description: `Returns the specified Zone resource.`,
  category: "Firewalls",
  inputs: {
    default: {
      config: {
        firewall: {
          name: "Firewall",
          description: "Name of the firewall rule to return.",
          type: {
            type: "string",
            description: "Name of the firewall rule to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.firewall !== undefined)
          pathParams["firewall"] = String(input.event.inputConfig.firewall);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/firewalls/{firewall}",
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
          allowed: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IPProtocol: {
                  type: "string",
                  description:
                    "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                },
                ports: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'An optional list of ports to which this rule applies. This field is only applicable for the UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"], ["80","443"], and ["12345-12349"].',
                },
              },
              additionalProperties: true,
            },
            description:
              "The list of ALLOW rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a permitted connection.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          denied: {
            type: "array",
            items: {
              type: "object",
              properties: {
                IPProtocol: {
                  type: "string",
                  description:
                    "The IP protocol to which this rule applies. The protocol type is required when creating a firewall rule. This value can either be one of the following well known protocol strings (tcp, udp,icmp, esp, ah, ipip,sctp) or the IP protocol number.",
                },
                ports: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    'An optional list of ports to which this rule applies. This field is only applicable for the UDP or TCP protocol. Each entry must be either an integer or a range. If not specified, this rule applies to connections through any port.  Example inputs include: ["22"], ["80","443"], and ["12345-12349"].',
                },
              },
              additionalProperties: true,
            },
            description:
              "The list of DENY rules specified by this firewall. Each rule specifies a protocol and port-range tuple that describes a denied connection.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this field when you create the resource.",
          },
          destinationRanges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If destination ranges are specified, the firewall rule applies only to traffic that has destination IP address in these ranges. These ranges must be expressed inCIDR format. Both IPv4 and IPv6 are supported.",
          },
          direction: {
            type: "string",
            enum: ["UNDEFINED_DIRECTION", "EGRESS", "INGRESS"],
            description:
              "Direction of traffic to which this firewall applies, either `INGRESS` or `EGRESS`. The default is `INGRESS`. For `EGRESS` traffic, you cannot specify the sourceTags fields. Check the Direction enum for the list of possible values.",
          },
          disabled: {
            type: "boolean",
            description:
              "Denotes whether the firewall rule is disabled. When set to true, the firewall rule is not enforced and the network behaves as if it did not exist. If this is unspecified, the firewall rule will be enabled.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#firewall for firewall rules.",
          },
          logConfig: {
            type: "object",
            properties: {
              enable: {
                type: "boolean",
                description:
                  "This field denotes whether to enable logging for a particular firewall rule.",
              },
              metadata: {
                type: "string",
                enum: [
                  "UNDEFINED_METADATA",
                  "EXCLUDE_ALL_METADATA",
                  "INCLUDE_ALL_METADATA",
                ],
                description: "A metadata key/value entry.",
              },
            },
            description: "The available logging options for a firewall rule.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
          },
          network: {
            type: "string",
            description:
              "URL of the network resource for this firewall rule. If not specified when creating a firewall rule, the default network is used:  global/networks/default  If you choose to specify this field, you can specify the network as a full or partial URL. For example, the following are all valid URLs:     -    https://www.googleapis.com/compute/v1/projects/myproject/global/networks/my-network    - projects/myproject/global/networks/my-network    - global/networks/default",
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
                  'Tag keys/values directly bound to this resource. Tag keys and values have the same definition as resource manager tags. The field is allowed for INSERT only. The keys/values to set on the resource should be specified in either ID { : } or Namespaced format { : }. For example the following are valid inputs: * {"tagKeys/333" : "tagValues/444", "tagKeys/123" : "tagValues/456"} * {"123/environment" : "production", "345/abc" : "xyz"} Note: * Invalid combinations of ID & namespaced format is not supported. For   instance: {"123/environment" : "tagValues/444"} is invalid.',
              },
            },
            description: "Additional firewall parameters.",
            additionalProperties: true,
          },
          priority: {
            type: "integer",
            description:
              "Priority for this rule. This is an integer between `0` and `65535`, both inclusive. The default value is `1000`. Relative priorities determine which rule takes effect if multiple rules apply. Lower values indicate higher priority. For example, a rule with priority `0` has higher precedence than a rule with priority `1`. DENY rules take precedence over ALLOW rules if they have equal priority. Note that VPC networks have implied rules with a priority of `65535`. To avoid conflicts with the implied rules, use a priority number less than `65535`.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          sourceRanges: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source ranges are specified, the firewall rule applies only to traffic that has a source IP address in these ranges. These ranges must be expressed inCIDR format. One or both of sourceRanges and sourceTags may be set. If both fields are set, the rule applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in thesourceTags field. The connection does not need to match both fields for the rule to apply. Both IPv4 and IPv6 are supported.",
          },
          sourceServiceAccounts: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source service accounts are specified, the firewall rules apply only to traffic originating from an instance with a service account in this list. Source service accounts cannot be used to control traffic to an instance's external IP address because service accounts are associated with an instance, not an IP address.sourceRanges can be set at the same time assourceServiceAccounts. If both are set, the firewall applies to traffic that has a source IP address within the sourceRanges OR a source IP that belongs to an instance with service account listed insourceServiceAccount. The connection does not need to match both fields for the firewall to apply.sourceServiceAccounts cannot be used at the same time assourceTags or targetTags.",
          },
          sourceTags: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "If source tags are specified, the firewall rule applies only to traffic with source IPs that match the primary network interfaces of VM instances that have the tag and are in the same VPC network. Source tags cannot be used to control traffic to an instance's external IP address, it only applies to traffic between instances in the same virtual network. Because tags are associated with instances, not IP addresses. One or both of sourceRanges and sourceTags may be set. If both fields are set, the firewall applies to traffic that has a source IP address within sourceRanges OR a source IP from a resource with a matching tag listed in the sourceTags field. The connection does not need to match both fields for the firewall to apply.",
          },
          targetServiceAccounts: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of service accounts indicating sets of instances located in the network that may make network connections as specified inallowed[].targetServiceAccounts cannot be used at the same time astargetTags or sourceTags. If neither targetServiceAccounts nor targetTags are specified, the firewall rule applies to all instances on the specified network.",
          },
          targetTags: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of tags that controls which instances the firewall rule applies to. If targetTags are specified, then the firewall rule applies only to instances in the VPC network that have one of those tags. If no targetTags are specified, the firewall rule applies to all instances on the specified network.",
          },
        },
        description:
          "Represents a Firewall Rule resource.  Firewall rules allow or deny ingress traffic to, and egress traffic from your instances. For more information, readFirewall rules.",
        additionalProperties: true,
      },
    },
  },
};

export default firewallsGet;
