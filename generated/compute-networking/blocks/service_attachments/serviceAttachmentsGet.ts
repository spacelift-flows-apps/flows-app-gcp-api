import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const serviceAttachmentsGet: AppBlock = {
  name: "Service Attachments - Get",
  description: `Returns the specified Zone resource.`,
  category: "Service Attachments",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region of this request.",
          type: {
            type: "string",
            description: "Name of the region of this request.",
          },
          required: true,
        },
        serviceAttachment: {
          name: "Service Attachment",
          description: "Name of the ServiceAttachment resource to return.",
          type: {
            type: "string",
            description: "Name of the ServiceAttachment resource to return.",
          },
          required: true,
        },
        showNatIps: {
          name: "Show Nat Ips",
          description:
            "Indicates whether NAT IPs should be included in the response.",
          type: {
            type: "boolean",
            description:
              "Indicates whether NAT IPs should be included in the response.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.serviceAttachment !== undefined)
          pathParams["service_attachment"] = String(
            input.event.inputConfig.serviceAttachment,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.showNatIps !== undefined)
          queryParams["showNatIps"] = String(
            input.event.inputConfig.showNatIps,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/serviceAttachments/{service_attachment}",
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
          connectedEndpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                consumerNetwork: {
                  type: "string",
                  description: "The url of the consumer network.",
                },
                endpoint: {
                  type: "string",
                  description: "The url of a connected endpoint.",
                },
                natIps: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "NAT IPs of the connected PSC endpoint and those of other endpoints propagated from it.",
                },
                propagatedConnectionCount: {
                  type: "integer",
                  description:
                    "The number of consumer Network Connectivity Center spokes that the connected Private Service Connect endpoint has propagated to.",
                },
                pscConnectionId: {
                  type: "string",
                  description: "64-bit integer as string",
                },
                status: {
                  type: "string",
                  enum: [
                    "UNDEFINED_STATUS",
                    "ACCEPTED",
                    "CLOSED",
                    "NEEDS_ATTENTION",
                    "PENDING",
                    "REJECTED",
                    "STATUS_UNSPECIFIED",
                  ],
                  description:
                    "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details.  You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
                },
              },
              description:
                "[Output Only] A connection connected to this service attachment.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] An array of connections for all the consumers connected to this service attachment.",
          },
          connectionPreference: {
            type: "string",
            enum: [
              "UNDEFINED_CONNECTION_PREFERENCE",
              "ACCEPT_AUTOMATIC",
              "ACCEPT_MANUAL",
              "CONNECTION_PREFERENCE_UNSPECIFIED",
            ],
            description:
              "The connection preference of service attachment. The value can be set to ACCEPT_AUTOMATIC. An ACCEPT_AUTOMATIC service attachment is one that always accepts the connection from consumer forwarding rules. Check the ConnectionPreference enum for the list of possible values.",
          },
          consumerAcceptLists: {
            type: "array",
            items: {
              type: "object",
              properties: {
                connectionLimit: {
                  type: "integer",
                  description:
                    "The value of the limit to set. For endpoint_url, the limit should be no more than 1.",
                },
                networkUrl: {
                  type: "string",
                  description:
                    "The network URL for the network to set the limit for.",
                },
                projectIdOrNum: {
                  type: "string",
                  description:
                    "The project id or number for the project to set the limit for.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Specifies which consumer projects or networks are allowed to connect to the service attachment. Each project or network has a connection limit. A given service attachment can manage connections at either the project or network level. Therefore, both the accept and reject lists for a given service attachment must contain either only projects or only networks or only endpoints.",
          },
          consumerRejectLists: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Specifies a list of projects or networks that are not allowed to connect to this service attachment. The project can be specified using its project ID or project number and the network can be specified using its URL. A given service attachment can manage connections at either the project or network level. Therefore, both the reject and accept lists for a given service attachment must contain either only projects or only networks.",
          },
          creationTimestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          domainNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              'If specified, the domain name will be used during the integration between the PSC connected endpoints and the Cloud DNS. For example, this is a valid domain name: "p.mycompany.com.". Current max number of domain names supported is 1.',
          },
          enableProxyProtocol: {
            type: "boolean",
            description:
              "If true, enable the proxy protocol which is for supplying client TCP/IP address data in TCP connections that traverse proxies on their way to destination servers.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a ServiceAttachment. An up-to-date fingerprint must be provided in order to patch/update the ServiceAttachment; otherwise, the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve the ServiceAttachment.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#serviceAttachment for service attachments.",
          },
          metadata: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description: "Metadata of the service attachment.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          natSubnets: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "An array of URLs where each entry is the URL of a subnet provided by the service producer to use for NAT in this service attachment.",
          },
          producerForwardingRule: {
            type: "string",
            description:
              "The URL of a forwarding rule with loadBalancingScheme INTERNAL* that is serving the endpoint identified by this service attachment.",
          },
          propagatedConnectionLimit: {
            type: "integer",
            description:
              "The number of consumer spokes that connected Private Service Connect endpoints can be propagated to through Network Connectivity Center. This limit lets the service producer limit how many propagated Private Service Connect connections can be established to this service attachment from a single consumer.  If the connection preference of the service attachment is ACCEPT_MANUAL, the limit applies to each project or network that is listed in the consumer accept list. If the connection preference of the service attachment is ACCEPT_AUTOMATIC, the limit applies to each project that contains a connected endpoint.  If unspecified, the default propagated connection limit is 250.",
          },
          pscServiceAttachmentId: {
            type: "object",
            properties: {
              high: {
                type: "string",
                description: "64-bit integer as string",
              },
              low: {
                type: "string",
                description: "64-bit integer as string",
              },
            },
            additionalProperties: true,
            description:
              "Output only. [Output Only] An 128-bit global unique ID of the PSC service attachment.",
          },
          reconcileConnections: {
            type: "boolean",
            description:
              "This flag determines whether a consumer accept/reject list change can reconcile the statuses of existing ACCEPTED or REJECTED PSC endpoints.       -  If false, connection policy update will only affect existing PENDING     PSC endpoints. Existing ACCEPTED/REJECTED endpoints will remain untouched     regardless how the connection policy is modified .    -  If true,     update will affect both PENDING and ACCEPTED/REJECTED PSC endpoints. For     example, an ACCEPTED PSC endpoint will be moved to REJECTED if its project     is added to the reject list.   For newly created service attachment, this boolean defaults to false.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the service attachment resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          targetService: {
            type: "string",
            description:
              "The URL of a service serving the endpoint identified by this service attachment.",
          },
        },
        description:
          "Represents a ServiceAttachment resource.  A service attachment represents a service that a producer has exposed. It encapsulates the load balancer which fronts the service runs and a list of NAT IP ranges that the producers uses to represent the consumers connecting to the service.",
        additionalProperties: true,
      },
    },
  },
};

export default serviceAttachmentsGet;
