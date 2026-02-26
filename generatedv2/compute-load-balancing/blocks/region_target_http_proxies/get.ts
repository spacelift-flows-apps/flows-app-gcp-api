import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Region Target Http Proxies - Get",
  description: `Returns the specified Zone resource.`,
  category: "Region Target Http Proxies",
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
        targetHttpProxy: {
          name: "Target Http Proxy",
          description: "Name of the TargetHttpProxy resource to return.",
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
        if (input.event.inputConfig.targetHttpProxy !== undefined)
          pathParams["target_http_proxy"] = String(
            input.event.inputConfig.targetHttpProxy,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/targetHttpProxies/{target_http_proxy}",
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
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a TargetHttpProxy. An up-to-date fingerprint must be provided in order to patch/update the TargetHttpProxy; otherwise, the request will fail with error 412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve the TargetHttpProxy.",
          },
          httpKeepAliveTimeoutSec: {
            type: "integer",
            description:
              "Specifies how long to keep a connection open, after completing a response, while there is no matching traffic (in seconds). If an HTTP keep-alive is not specified, a default value (610 seconds) will be used.  For global external Application Load Balancers, the minimum allowed value is 5 seconds and the maximum allowed value is 1200 seconds.  For classic Application Load Balancers, this option is not supported.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of resource. Always compute#targetHttpProxy for target HTTP proxies.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          proxyBind: {
            type: "boolean",
            description:
              "This field only applies when the forwarding rule that references this target proxy has a loadBalancingScheme set toINTERNAL_SELF_MANAGED.  When this field is set to true, Envoy proxies set up inbound traffic interception and bind to the IP address and port specified in the forwarding rule. This is generally useful when using Traffic Director to configure Envoy as a gateway or middle proxy (in other words, not a sidecar proxy). The Envoy proxy listens for inbound requests and handles requests when it receives them.  The default is false.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional Target HTTP Proxy resides. This field is not applicable to global Target HTTP Proxies.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          urlMap: {
            type: "string",
            description:
              "URL to the UrlMap resource that defines the mapping from URL to the BackendService.",
          },
        },
        description:
          "Represents a Target HTTP Proxy resource.  Google Compute Engine has two Target HTTP Proxy resources:  * [Global](/compute/docs/reference/rest/v1/targetHttpProxies) * [Regional](/compute/docs/reference/rest/v1/regionTargetHttpProxies)  A target HTTP proxy is a component of Google Cloud HTTP load balancers.  * targetHttpProxies are used by global external Application Load Balancers,   classic Application Load Balancers, cross-region internal Application Load   Balancers, and Traffic Director. * regionTargetHttpProxies are used by regional internal Application Load   Balancers and regional external Application Load Balancers.  Forwarding rules reference a target HTTP proxy, and the target proxy then references a URL map. For more information, readUsing Target Proxies and Forwarding rule concepts.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
