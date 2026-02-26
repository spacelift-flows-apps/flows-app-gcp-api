import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Target Ssl Proxies - Get",
  description: `Returns the specified Zone resource.`,
  category: "Target Ssl Proxies",
  inputs: {
    default: {
      config: {
        target_ssl_proxy: {
          name: "Target Ssl Proxy",
          description: "Name of the TargetSslProxy resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.target_ssl_proxy !== undefined)
          pathParams["target_ssl_proxy"] = String(
            input.event.inputConfig.target_ssl_proxy,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/targetSslProxies/{target_ssl_proxy}",
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
          certificate_map: {
            type: "string",
            description:
              "URL of a certificate map that identifies a certificate map associated with the given target proxy. This field can only be set for global target proxies. If set, sslCertificates will be ignored.   Accepted format is//certificatemanager.googleapis.com/projects/{project}/locations/{location}/certificateMaps/{resourceName}.",
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
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#targetSslProxy for target SSL proxies.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          proxy_header: {
            type: "string",
            description:
              "Specifies the type of proxy header to append before sending data to the backend, either NONE or PROXY_V1. The default is NONE. Check the ProxyHeader enum for the list of possible values.",
          },
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          service: {
            type: "string",
            description: "URL to the BackendService resource.",
          },
          ssl_certificates: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "URLs to SslCertificate resources that are used to authenticate connections to Backends. At least one SSL certificate must be specified. Currently, you may specify up to 15 SSL certificates. sslCertificates do not apply when the load balancing scheme is set to INTERNAL_SELF_MANAGED.",
          },
          ssl_policy: {
            type: "string",
            description:
              "URL of SslPolicy resource that will be associated with the TargetSslProxy resource. If not set, the TargetSslProxy resource will not have any SSL policy configured.",
          },
        },
        description:
          "Represents a Target SSL Proxy resource.  A target SSL proxy is a component of a Proxy Network Load Balancer. The forwarding rule references the target SSL proxy, and the target proxy then references a backend service. For more information, readProxy Network Load Balancer overview.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
