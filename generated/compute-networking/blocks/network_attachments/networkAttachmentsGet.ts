import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const networkAttachmentsGet: AppBlock = {
  name: "Network Attachments - Get",
  description: `Returns the specified Zone resource.`,
  category: "Network Attachments",
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
        networkAttachment: {
          name: "Network Attachment",
          description: "Name of the NetworkAttachment resource to return.",
          type: {
            type: "string",
            description: "Name of the NetworkAttachment resource to return.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.networkAttachment !== undefined)
          pathParams["network_attachment"] = String(
            input.event.inputConfig.networkAttachment,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/networkAttachments/{network_attachment}",
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
          connectionEndpoints: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ipAddress: {
                  type: "string",
                  description:
                    "The IPv4 address assigned to the producer instance network interface. This value will be a range in case of Serverless.",
                },
                ipv6Address: {
                  type: "string",
                  description:
                    "The IPv6 address assigned to the producer instance network interface. This is only assigned when the stack types of both the instance network interface and the consumer subnet are IPv4_IPv6.",
                },
                projectIdOrNum: {
                  type: "string",
                  description:
                    "The project id or number of the interface to which the IP was assigned.",
                },
                secondaryIpCidrRanges: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Alias IP ranges from the same subnetwork.",
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
                subnetwork: {
                  type: "string",
                  description:
                    "The subnetwork used to assign the IP to the producer instance network interface.",
                },
                subnetworkCidrRange: {
                  type: "string",
                  description:
                    "Output only. [Output Only] The CIDR range of the subnet from which the IPv4 internal IP was allocated from.",
                },
              },
              description:
                "[Output Only] A connection connected to this network attachment.",
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] An array of connections for all the producers connected to this network attachment.",
          },
          connectionPreference: {
            type: "string",
            enum: [
              "UNDEFINED_CONNECTION_PREFERENCE",
              "ACCEPT_AUTOMATIC",
              "ACCEPT_MANUAL",
              "INVALID",
            ],
            description:
              "Check the ConnectionPreference enum for the list of possible values.",
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
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. An up-to-date fingerprint must be provided in order to patch.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description: "Output only. [Output Only] Type of the resource.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          network: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of the network which the Network Attachment belongs to. Practically it is inferred by fetching the network of the first subnetwork associated. Because it is required that all the subnetworks must be from the same network, it is assured that the Network Attachment belongs to the same network as all the subnetworks.",
          },
          producerAcceptLists: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Projects that are allowed to connect to this network attachment. The project can be specified using its id or number.",
          },
          producerRejectLists: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Projects that are not allowed to connect to this network attachment. The project can be specified using its id or number.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the network attachment resides. This field applies only to the region resource. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource's resource id.",
          },
          subnetworks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "An array of URLs where each entry is the URL of a subnet provided by the service consumer to use for endpoints in the producers that connect to this network attachment.",
          },
        },
        description: "NetworkAttachments A network attachment resource ...",
        additionalProperties: true,
      },
    },
  },
};

export default networkAttachmentsGet;
