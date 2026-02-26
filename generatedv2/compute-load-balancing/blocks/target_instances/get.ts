import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Target Instances - Get",
  description: `Returns the specified Zone resource.`,
  category: "Target Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "Name of the zone scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        target_instance: {
          name: "Target Instance",
          description: "Name of the TargetInstance resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.target_instance !== undefined)
          pathParams["target_instance"] = String(
            input.event.inputConfig.target_instance,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/targetInstances/{target_instance}",
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
          instance: {
            type: "string",
            description:
              "A URL to the virtual machine instance that handles traffic for this target instance. When creating a target instance, you can provide the fully-qualified URL or a valid partial URL to the desired virtual machine. For example, the following are all valid URLs:     - https://www.googleapis.com/compute/v1/projects/project/zones/zone/instances/instance    - projects/project/zones/zone/instances/instance    - zones/zone/instances/instance",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] The type of the resource. Alwayscompute#targetInstance for target instances.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          nat_policy: {
            type: "string",
            description:
              "Must have a value of NO_NAT. Protocol forwarding delivers packets while preserving the destination IP address of the forwarding rule referencing the target instance. Check the NatPolicy enum for the list of possible values.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network this target instance uses to forward traffic. If not specified, the traffic will be forwarded to the network that the default network interface belongs to.",
          },
          security_policy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the security policy associated with this target instance.",
          },
          self_link: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          zone: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the zone where the target instance resides. You must specify this field as part of the HTTP request URL. It is not settable as a field in the request body.",
          },
        },
        description:
          "Represents a Target Instance resource.  You can use a target instance to handle traffic for one or more forwarding rules, which is ideal for forwarding protocol traffic that is managed by a single source. For example, ESP, AH, TCP, or UDP. For more information, readTarget instances.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
