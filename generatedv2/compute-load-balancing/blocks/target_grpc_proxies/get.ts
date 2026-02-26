import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Target Grpc Proxies - Get",
  description: `Returns the specified Zone resource.`,
  category: "Target Grpc Proxies",
  inputs: {
    default: {
      config: {
        targetGrpcProxy: {
          name: "Target Grpc Proxy",
          description: "Name of the TargetGrpcProxy resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.targetGrpcProxy !== undefined)
          pathParams["target_grpc_proxy"] = String(
            input.event.inputConfig.targetGrpcProxy,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/targetGrpcProxies/{target_grpc_proxy}",
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
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a TargetGrpcProxy. An up-to-date fingerprint must be provided in order to patch/update the TargetGrpcProxy; otherwise, the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve the TargetGrpcProxy.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#targetGrpcProxy for target grpc proxies.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          selfLinkWithId: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL with id for the resource.",
          },
          urlMap: {
            type: "string",
            description:
              "URL to the UrlMap resource that defines the mapping from URL to the BackendService. The protocol field in the BackendService must be set to GRPC.",
          },
          validateForProxyless: {
            type: "boolean",
            description:
              'If true, indicates that the BackendServices referenced by the urlMap may be accessed by gRPC applications without using a sidecar proxy. This will enable configuration checks on urlMap and its referenced BackendServices to not allow unsupported features. A gRPC application must use "xds:///" scheme in the target URI of the service it is connecting to. If false, indicates that the BackendServices referenced by the urlMap will be accessed by gRPC applications via a sidecar proxy. In this case, a gRPC application must not use "xds:///" scheme in the target URI of the service it is connecting to',
          },
        },
        description:
          "Represents a Target gRPC Proxy resource.  A target gRPC proxy is a component of load balancers intended for load balancing gRPC traffic. Only global forwarding rules with load balancing scheme INTERNAL_SELF_MANAGED can reference a target gRPC proxy. The target gRPC Proxy references a URL map that specifies how traffic is routed to gRPC backend services.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
