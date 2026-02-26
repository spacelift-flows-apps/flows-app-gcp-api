import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Ssl Policies - Get",
  description: `Returns the specified Zone resource.`,
  category: "Ssl Policies",
  inputs: {
    default: {
      config: {
        ssl_policy: {
          name: "Ssl Policy",
          description:
            "Name of the SSL policy to update. The name must be 1-63 characters long, and comply with RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.ssl_policy !== undefined)
          pathParams["ssl_policy"] = String(input.event.inputConfig.ssl_policy);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/sslPolicies/{ssl_policy}",
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
          custom_features: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of features enabled when the selected profile is CUSTOM. The  method returns the set of features that can be specified in this list. This field must be empty if the profile is notCUSTOM.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          enabled_features: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] The list of features enabled in the SSL policy.",
          },
          fingerprint: {
            type: "string",
            description:
              "Fingerprint of this resource. A hash of the contents stored in this object. This field is used in optimistic locking. This field will be ignored when inserting a SslPolicy. An up-to-date fingerprint must be provided in order to update the SslPolicy, otherwise the request will fail with error 412 conditionNotMet.  To see the latest fingerprint, make a get() request to retrieve an SslPolicy.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output only] Type of the resource. Alwayscompute#sslPolicyfor SSL policies.",
          },
          min_tls_version: {
            type: "string",
            description:
              "The minimum version of SSL protocol that can be used by the clients to establish a connection with the load balancer. This can be one ofTLS_1_0, TLS_1_1, TLS_1_2,TLS_1_3. When set to TLS_1_3, the profile field must be set to RESTRICTED. Check the MinTlsVersion enum for the list of possible values.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          profile: {
            type: "string",
            description:
              "Profile specifies the set of SSL features that can be used by the load balancer when negotiating SSL with clients. This can be one ofCOMPATIBLE, MODERN, RESTRICTED, orCUSTOM. If using CUSTOM, the set of SSL features to enable must be specified in the customFeatures field. Check the Profile enum for the list of possible values.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional SSL policy resides. This field is not applicable to global SSL policies.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          warnings: {
            type: "array",
            items: {
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
              additionalProperties: true,
            },
            description:
              "Output only. [Output Only] If potential misconfigurations are detected for this SSL policy, this field will be populated with warning messages.",
          },
        },
        description:
          "Represents an SSL Policy resource.  Use SSL policies to control SSL features, such as versions and cipher suites, that are offered by Application Load Balancers and proxy Network Load Balancers. For more information, read SSL policies overview.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
