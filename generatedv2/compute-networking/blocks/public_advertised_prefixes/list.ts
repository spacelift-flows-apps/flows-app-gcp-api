import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const list: AppBlock = {
  name: "Public Advertised Prefixes - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Public Advertised Prefixes",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
          },
          required: false,
        },
        max_results: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "string",
          },
          required: false,
        },
        order_by: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
          },
          required: false,
        },
        page_token: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
          },
          required: false,
        },
        return_partial_success: {
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

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.filter !== undefined)
          queryParams["filter"] = String(input.event.inputConfig.filter);
        if (input.event.inputConfig.max_results !== undefined)
          queryParams["maxResults"] = String(
            input.event.inputConfig.max_results,
          );
        if (input.event.inputConfig.order_by !== undefined)
          queryParams["orderBy"] = String(input.event.inputConfig.order_by);
        if (input.event.inputConfig.page_token !== undefined)
          queryParams["pageToken"] = String(input.event.inputConfig.page_token);
        if (input.event.inputConfig.return_partial_success !== undefined)
          queryParams["returnPartialSuccess"] = String(
            input.event.inputConfig.return_partial_success,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/publicAdvertisedPrefixes",
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
                byoip_api_version: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The version of BYOIP API. Check the ByoipApiVersion enum for the list of possible values.",
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
                dns_verification_ip: {
                  type: "string",
                  description:
                    "The address to be used for reverse DNS verification.",
                },
                fingerprint: {
                  type: "string",
                  description:
                    "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a new PublicAdvertisedPrefix. An up-to-date fingerprint must be provided in order to update thePublicAdvertisedPrefix, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve a PublicAdvertisedPrefix.",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                ip_cidr_range: {
                  type: "string",
                  description:
                    "The address range, in CIDR format, represented by this public advertised prefix.",
                },
                ipv6_access_type: {
                  type: "string",
                  description:
                    "The internet access type for IPv6 Public Advertised Prefixes. Check the Ipv6AccessType enum for the list of possible values.",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#publicAdvertisedPrefix for public advertised prefixes.",
                },
                name: {
                  type: "string",
                  description:
                    "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
                },
                pdp_scope: {
                  type: "string",
                  description:
                    "Specifies how child public delegated prefix will be scoped. It could be one of following values:        - `REGIONAL`: The public delegated prefix is regional only. The      provisioning will take a few minutes.      - `GLOBAL`: The public delegated prefix is global only. The      provisioning will take ~4 weeks.      - `GLOBAL_AND_REGIONAL` [output only]: The public delegated prefixes is       BYOIP V1 legacy prefix. This is output only value and no longer       supported in BYOIP V2. Check the PdpScope enum for the list of possible values.",
                },
                public_delegated_prefixs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      ip_range: {
                        type: "string",
                        description:
                          "The IP address range of the public delegated prefix",
                      },
                      name: {
                        type: "string",
                        description: "The name of the public delegated prefix",
                      },
                      project: {
                        type: "string",
                        description:
                          "The project number of the public delegated prefix",
                      },
                      region: {
                        type: "string",
                        description:
                          "The region of the public delegated prefix if it is regional. If absent, the prefix is global.",
                      },
                      status: {
                        type: "string",
                        description:
                          "The status of the public delegated prefix. Possible values are:   INITIALIZING: The public delegated prefix is being initialized and     addresses cannot be created yet.   ANNOUNCED: The public delegated prefix is active.",
                      },
                    },
                    description:
                      "Represents a CIDR range which can be used to assign addresses.",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output Only] The list of public delegated prefixes that exist for this public advertised prefix.",
                },
                self_link: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for the resource.",
                },
                shared_secret: {
                  type: "string",
                  description:
                    "[Output Only] The shared secret to be used for reverse DNS verification.",
                },
                status: {
                  type: "string",
                  description:
                    "The status of the public advertised prefix. Possible values include:        - `INITIAL`: RPKI validation is complete.      - `PTR_CONFIGURED`: User has configured the PTR.      - `VALIDATED`: Reverse DNS lookup is successful.      - `REVERSE_DNS_LOOKUP_FAILED`: Reverse DNS lookup failed.      - `PREFIX_CONFIGURATION_IN_PROGRESS`: The prefix is being      configured.      - `PREFIX_CONFIGURATION_COMPLETE`: The prefix is fully configured.      - `PREFIX_REMOVAL_IN_PROGRESS`: The prefix is being removed. Check the Status enum for the list of possible values.",
                },
              },
              description:
                "A public advertised prefix represents an aggregated IP prefix or netblock which customers bring to cloud. The IP prefix is a single unit of route advertisement and is announced globally to the internet.",
              additionalProperties: true,
            },
            description: "A list of PublicAdvertisedPrefix resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#publicAdvertisedPrefix for public advertised prefixes.",
          },
          next_page_token: {
            type: "string",
            description:
              "[Output Only] This token allows you to get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
          },
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for this resource.",
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
        additionalProperties: true,
      },
    },
  },
};

export default list;
