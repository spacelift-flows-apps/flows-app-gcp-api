import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Region Target Tcp Proxies - Get",
  description: `Returns the specified Zone resource.`,
  category: "Region Target Tcp Proxies",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        target_tcp_proxy: {
          name: "Target Tcp Proxy",
          description: "Name of the TargetTcpProxy resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.target_tcp_proxy !== undefined)
          pathParams["target_tcp_proxy"] = String(
            input.event.inputConfig.target_tcp_proxy,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/targetTcpProxies/{target_tcp_proxy}",
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
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#targetTcpProxy for target TCP proxies.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          proxy_bind: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this target proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.  When this field is set to true, Envoy proxies set up inbound traffic interception and bind to the IP address and port specified in the forwarding rule. This is generally useful when using Traffic Director to configure Envoy as a gateway or middle proxy (in other words, not a sidecar proxy). The Envoy proxy listens for inbound requests and handles requests when it receives them.  The default is false.",
          },
          proxy_header: {
            type: "string",
            description:
              "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional TCP proxy resides. This field is not applicable to global TCP proxy.",
          },
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          service: {
            type: "string",
            description: "URL to the BackendService resource.",
          },
        },
        description:
          "Represents a Target TCP Proxy resource.  A target TCP proxy is a component of a Proxy Network Load Balancer. The forwarding rule references the target TCP proxy, and the target proxy then references a backend service. For more information, readProxy Network Load Balancer overview.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
