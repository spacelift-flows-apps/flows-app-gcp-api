import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const interconnectRemoteLocationsList: AppBlock = {
  name: "Interconnect Remote Locations - List",
  description: `Retrieves the list of Zone resources available to the specified project.`,
  category: "Interconnect Remote Locations",
  inputs: {
    default: {
      config: {
        filter: {
          name: "Filter",
          description:
            'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          type: {
            type: "string",
            description:
              'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request.  If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`.  For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`.  The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ```  You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based onresource labels.  To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ```  If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples:  `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")`  The literal value is interpreted as a regular expression using GoogleRE2 library syntax. The literal value must match the entire field.  For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`.  You cannot combine constraints on multiple fields using regular expressions.',
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          type: {
            type: "integer",
            description:
              "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
          },
          required: false,
        },
        orderBy: {
          name: "Order By",
          description:
            'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          type: {
            type: "string",
            description:
              'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name.  You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first.  Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          type: {
            type: "string",
            description:
              "Specifies a page token to use. Set `pageToken` to the `nextPageToken` returned by a previous list request to get the next page of results.",
          },
          required: false,
        },
        returnPartialSuccess: {
          name: "Return Partial Success",
          description:
            "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
          type: {
            type: "boolean",
            description:
              "Opt-in for partial success behavior which provides partial results in case of failure. The default value is false.  For example, when partial success behavior is enabled, aggregatedList for a single zone scope either returns all resources in the zone or no resources, with an error code.",
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
            "/compute/v1/projects/{project}/global/interconnectRemoteLocations",
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
                    "Output only. [Output Only] The postal address of the Point of Presence, each line in the address is separated by a newline character.",
                },
                attachmentConfigurationConstraints: {
                  type: "object",
                  properties: {
                    bgpMd5: {
                      type: "string",
                      enum: [
                        "UNDEFINED_BGP_MD5",
                        "MD5_OPTIONAL",
                        "MD5_REQUIRED",
                        "MD5_UNSUPPORTED",
                      ],
                      description:
                        "Output only. [Output Only] Whether the attachment's BGP session requires/allows/disallows BGP MD5 authentication. This can take one of the following values: MD5_OPTIONAL, MD5_REQUIRED, MD5_UNSUPPORTED.  For example, a Cross-Cloud Interconnect connection to a remote cloud provider that requires BGP MD5 authentication has the interconnectRemoteLocation attachment_configuration_constraints.bgp_md5 field set to MD5_REQUIRED, and that property is propagated to the attachment. Similarly, if BGP MD5 is MD5_UNSUPPORTED, an error is returned if MD5 is requested. Check the BgpMd5 enum for the list of possible values.",
                    },
                    bgpPeerAsnRanges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          max: {
                            type: "integer",
                          },
                          min: {
                            type: "integer",
                          },
                        },
                        additionalProperties: true,
                      },
                      description:
                        "Output only. [Output Only] List of ASN ranges that the remote location is known to support. Formatted as an array of inclusive ranges {min: min-value, max: max-value}. For example, [{min: 123, max: 123}, {min: 64512, max: 65534}] allows the peer ASN to be 123 or anything in the range 64512-65534.  This field is only advisory. Although the API accepts other ranges, these are the ranges that we recommend.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Subset of fields from InterconnectAttachment's |configurationConstraints| field that apply to all attachments for this remote location.",
                },
                city: {
                  type: "string",
                  description:
                    'Output only. [Output Only] Metropolitan area designator that indicates which city an interconnect is located. For example: "Chicago, IL", "Amsterdam, Netherlands".',
                },
                constraints: {
                  type: "object",
                  properties: {
                    portPairRemoteLocation: {
                      type: "string",
                      enum: [
                        "UNDEFINED_PORT_PAIR_REMOTE_LOCATION",
                        "PORT_PAIR_MATCHING_REMOTE_LOCATION",
                        "PORT_PAIR_UNCONSTRAINED_REMOTE_LOCATION",
                      ],
                      description:
                        "Output only. [Output Only] Port pair remote location constraints, which can take one of the following values: PORT_PAIR_UNCONSTRAINED_REMOTE_LOCATION, PORT_PAIR_MATCHING_REMOTE_LOCATION.  Google Cloud API refers only to individual ports, but the UI uses this field when ordering a pair of ports, to prevent users from accidentally ordering something that is incompatible with their cloud provider. Specifically, when ordering a redundant pair of Cross-Cloud Interconnect ports, and one of them uses a remote location with portPairMatchingRemoteLocation set to matching, the UI requires that both ports use the same remote location. Check the PortPairRemoteLocation enum for the list of possible values.",
                    },
                    portPairVlan: {
                      type: "string",
                      enum: [
                        "UNDEFINED_PORT_PAIR_VLAN",
                        "PORT_PAIR_MATCHING_VLAN",
                        "PORT_PAIR_UNCONSTRAINED_VLAN",
                      ],
                      description:
                        "Output only. [Output Only] Port pair VLAN constraints, which can take one of the following values: PORT_PAIR_UNCONSTRAINED_VLAN, PORT_PAIR_MATCHING_VLAN Check the PortPairVlan enum for the list of possible values.",
                    },
                    subnetLengthRange: {
                      type: "object",
                      properties: {
                        max: {
                          type: "integer",
                        },
                        min: {
                          type: "integer",
                        },
                      },
                      additionalProperties: true,
                      description:
                        "Output only. [Output Only]  [min-length, max-length]  The minimum and maximum value (inclusive) for the IPv4 subnet length.   For example, an  interconnectRemoteLocation for Azure has {min: 30, max: 30} because Azure requires /30 subnets.  This range specifies the values supported by both cloud providers. Interconnect currently supports /29 and /30 IPv4 subnet lengths. If a remote cloud has no constraint on IPv4 subnet length, the range would thus be {min: 29, max: 30}.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Output only. [Output Only] Constraints on the parameters for creating Cross-Cloud Interconnect and associated InterconnectAttachments.",
                },
                continent: {
                  type: "string",
                  enum: [
                    "UNDEFINED_CONTINENT",
                    "AFRICA",
                    "ASIA_PAC",
                    "EUROPE",
                    "NORTH_AMERICA",
                    "SOUTH_AMERICA",
                  ],
                  description:
                    "Output only. [Output Only] Continent for this location, which can take one of the following values:     - AFRICA    - ASIA_PAC    - EUROPE    - NORTH_AMERICA    - SOUTH_AMERICA Check the Continent enum for the list of possible values.",
                },
                creationTimestamp: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
                },
                description: {
                  type: "string",
                  description:
                    "Output only. [Output Only] An optional description of the resource.",
                },
                facilityProvider: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The name of the provider for this facility (e.g., EQUINIX).",
                },
                facilityProviderFacilityId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] A provider-assigned Identifier for this facility (e.g., Ashburn-DC1).",
                },
                id: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                kind: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Type of the resource. Alwayscompute#interconnectRemoteLocation for interconnect remote locations.",
                },
                lacp: {
                  type: "string",
                  enum: [
                    "UNDEFINED_LACP",
                    "LACP_SUPPORTED",
                    "LACP_UNSUPPORTED",
                  ],
                  description:
                    "Output only. [Output Only] Link Aggregation Control Protocol (LACP) constraints, which can take one of the following values: LACP_SUPPORTED, LACP_UNSUPPORTED Check the Lacp enum for the list of possible values.",
                },
                maxLagSize100Gbps: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] The maximum number of 100 Gbps ports supported in a link aggregation group (LAG). When linkType is 100 Gbps, requestedLinkCount cannot exceed max_lag_size_100_gbps.",
                },
                maxLagSize10Gbps: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] The maximum number of 10 Gbps ports supported in a link aggregation group (LAG). When linkType is 10 Gbps, requestedLinkCount cannot exceed max_lag_size_10_gbps.",
                },
                maxLagSize400Gbps: {
                  type: "integer",
                  description:
                    "Output only. [Output Only] The maximum number of 400 Gbps ports supported in a link aggregation group (LAG). When linkType is 400 Gbps, requestedLinkCount cannot exceed max_lag_size_400_gbps.",
                },
                name: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Name of the resource.",
                },
                peeringdbFacilityId: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The peeringdb identifier for this facility (corresponding with a netfac type in peeringdb).",
                },
                permittedConnections: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      interconnectLocation: {
                        type: "string",
                        description:
                          "Output only. [Output Only] URL of an Interconnect location that is permitted to connect to this Interconnect remote location.",
                      },
                    },
                    additionalProperties: true,
                  },
                  description:
                    "Output only. [Output Only] Permitted connections.",
                },
                remoteService: {
                  type: "string",
                  description:
                    'Output only. [Output Only] Indicates the service provider present at the remote location. Example values: "Amazon Web Services", "Microsoft Azure".',
                },
                selfLink: {
                  type: "string",
                  description:
                    "Output only. [Output Only] Server-defined URL for the resource.",
                },
                status: {
                  type: "string",
                  enum: ["UNDEFINED_STATUS", "AVAILABLE", "CLOSED"],
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                },
              },
              description:
                "Represents a Cross-Cloud Interconnect Remote Location resource.  You can use this resource to find remote location details about an Interconnect attachment (VLAN).",
              additionalProperties: true,
            },
            description: "A list of InterconnectRemoteLocation resources.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Alwayscompute#interconnectRemoteLocationList for lists of interconnect remote locations.",
          },
          nextPageToken: {
            type: "string",
            description:
              "[Output Only] This token lets you get the next page of results for list requests. If the number of results is larger thanmaxResults, use the nextPageToken as a value for the query parameter pageToken in the next list request. Subsequent list requests will have their own nextPageToken to continue paging through the results.",
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
            description: "Informational warning message.",
            additionalProperties: true,
          },
        },
        description:
          "Response to the list request, and contains a list of interconnect remote locations.",
        additionalProperties: true,
      },
    },
  },
};

export default interconnectRemoteLocationsList;
