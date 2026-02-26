import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Addresses - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Addresses",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "string",
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
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.maxResults !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.maxResults,
          );
        if (input.event.inputConfig.orderBy !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.orderBy);
        if (input.event.inputConfig.pageToken !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.pageToken);
        if (input.event.inputConfig.returnPartialSuccess !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.returnPartialSuccess,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/addresses",
          pathParams,
          queryParams,
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
          id: {
            type: "string",
            description:
              "[Output Only] Unique identifier for the resource; defined by the server.",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                address: {
                  type: "string",
                  description:
                    "The static IP address represented by this resource.",
                },
                addressType: {
                  type: "string",
                  description:
                    "The type of address to reserve, either INTERNAL orEXTERNAL. If unspecified, defaults to EXTERNAL. Check the AddressType enum for the list of possible values.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "An optional description of this resource. Provide this field when you create the resource.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                ipCollection: {
                  type: "string",
                  description:
                    "Reference to the source of external IPv4 addresses, like a PublicDelegatedPrefix (PDP) for BYOIP. The PDP must support enhanced IPv4 allocations.  Use one of the following formats to specify a PDP when reserving an external IPv4 address using BYOIP.     -    Full resource URL, as inhttps://www.googleapis.com/compute/v1/projects/projectId/regions/region/publicDelegatedPrefixes/pdp-name    -    Partial URL, as in             - projects/projectId/regions/region/publicDelegatedPrefixes/pdp-name           - regions/region/publicDelegatedPrefixes/pdp-name",
                },
                ipVersion: {
                  type: "string",
                  description:
                    "The IP version that will be used by this address. Valid options areIPV4 or IPV6. Check the IpVersion enum for the list of possible values.",
                },
                ipv6EndpointType: {
                  type: "string",
                  description:
                    "The endpoint type of this address, which should be VM or NETLB. This is used for deciding which type of endpoint this address can be used after the external IPv6 address reservation. Check the Ipv6EndpointType enum for the list of possible values.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Always compute#address for addresses.",
                },
                labelFingerprint: {
                  type: "string",
                  description:
                    "A fingerprint for the labels being applied to this Address, which is essentially a hash of the labels set used for optimistic locking. The fingerprint is initially generated by Compute Engine and changes after every request to modify or update labels. You must always provide an up-to-date fingerprint hash in order to update or change labels, otherwise the request will fail with error412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an Address.",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "Labels for this resource. These can only be added or modified by thesetLabels method. Each label key/value pair must comply withRFC1035. Label values may be empty.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?`. The first character must be a lowercase letter, and all following characters (except for the last character) must be a dash, lowercase letter, or digit. The last character must be a lowercase letter or digit.",
                },
                network: {
                  type: "string",
                  description:
                    "The URL of the network in which to reserve the address. This field can only be used with INTERNAL type with theVPC_PEERING purpose.",
                },
                networkTier: {
                  type: "string",
                  description:
                    "This signifies the networking tier used for configuring this address and can only take the following values: PREMIUM orSTANDARD. Internal IP addresses are always Premium Tier; global external IP addresses are always Premium Tier; regional external IP addresses can be either Standard or Premium Tier.  If this field is not specified, it is assumed to be PREMIUM. Check the NetworkTier enum for the list of possible values.",
                },
                prefixLength: {
                  type: "integer",
                  description:
                    "The prefix length if the resource represents an IP range.",
                },
                purpose: {
                  type: "string",
                  description:
                    "The purpose of this resource, which can be one of the following values:        - GCE_ENDPOINT for addresses that are used by VM      instances, alias IP ranges, load balancers, and similar resources.      - DNS_RESOLVER for a DNS resolver address in a subnetwork        for a Cloud DNS  inbound        forwarder IP addresses (regional internal IP address in a subnet of        a VPC network)      - VPC_PEERING for global internal IP addresses used for            private services access allocated ranges.      - NAT_AUTO for the regional external IP addresses used by           Cloud NAT when allocating addresses using            automatic NAT IP address allocation.      - IPSEC_INTERCONNECT for addresses created from a private      IP range that are reserved for a VLAN attachment in an      *HA VPN over Cloud Interconnect* configuration. These addresses      are regional resources.      - `SHARED_LOADBALANCER_VIP` for an internal IP address that is assigned      to multiple internal forwarding rules.      - `PRIVATE_SERVICE_CONNECT` for a private network address that is      used to configure Private Service Connect. Only global internal addresses      can use this purpose. Check the Purpose enum for the list of possible values.",
                },
                region: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The URL of the region where a regional address resides. For regional addresses, you must specify the region as a path parameter in the HTTP request URL. *This field is not applicable to global addresses.*",
                },
                selfLink: {
                  type: "string",
                  description:
                    "[Output Only] Server-defined URL for the resource.",
                },
                status: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The status of the address, which can be one ofRESERVING, RESERVED, or IN_USE. An address that is RESERVING is currently in the process of being reserved. A RESERVED address is currently reserved and available to use. An IN_USE address is currently being used by another resource and is not available. Check the Status enum for the list of possible values.",
                },
                subnetwork: {
                  type: "string",
                  description:
                    "The URL of the subnetwork in which to reserve the address. If an IP address is specified, it must be within the subnetwork's IP range. This field can only be used with INTERNAL type with aGCE_ENDPOINT or DNS_RESOLVER purpose.",
                },
                users: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "[Output Only] The URLs of the resources that are using this address.",
                },
              },
              description:
                "Represents an IP Address resource.  Google Compute Engine has two IP Address resources:  * [Global (external and internal)](https://cloud.google.com/compute/docs/reference/rest/v1/globalAddresses) * [Regional (external and internal)](https://cloud.google.com/compute/docs/reference/rest/v1/addresses)  For more information, see Reserving a static external IP address.",
              additionalProperties: true,
            },
            description: "A list of Address resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#addressList for lists of addresses.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          warning: {
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description: "Contains a list of addresses.",
        additionalProperties: true,
      },
    },
  },
};

export default list;
