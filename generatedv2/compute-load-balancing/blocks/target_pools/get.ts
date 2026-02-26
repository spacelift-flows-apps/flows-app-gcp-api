import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Target Pools - Get",
  description: `Returns the specified Zone resource.`,
  category: "Target Pools",
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
        targetPool: {
          name: "Target Pool",
          description: "Name of the TargetPool resource to return.",
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
        if (input.event.inputConfig.targetPool !== undefined)
          pathParams["target_pool"] = String(
            input.event.inputConfig.targetPool,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/targetPools/{target_pool}",
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
          backupPool: {
            type: "string",
            description:
              'The server-defined URL for the resource. This field is applicable only when the containing target pool is serving a forwarding rule as the primary pool, and its failoverRatio field is properly set to a value between [0, 1].backupPool and failoverRatio together define the fallback behavior of the primary target pool: if the ratio of the healthy instances in the primary pool is at or belowfailoverRatio, traffic arriving at the load-balanced IP will be directed to the backup pool.  In case where failoverRatio and backupPool are not set, or all the instances in the backup pool are unhealthy, the traffic will be directed back to the primary pool in the "force" mode, where traffic will be spread to the healthy instances with the best effort, or to all instances when no instance is healthy.',
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
          failoverRatio: {
            type: "number",
            description:
              'This field is applicable only when the containing target pool is serving a forwarding rule as the primary pool (i.e., not as a backup pool to some other target pool). The value of the field must be in [0, 1].  If set, backupPool must also be set. They together define the fallback behavior of the primary target pool: if the ratio of the healthy instances in the primary pool is at or below this number, traffic arriving at the load-balanced IP will be directed to the backup pool.  In case where failoverRatio is not set or all the instances in the backup pool are unhealthy, the traffic will be directed back to the primary pool in the "force" mode, where traffic will be spread to the healthy instances with the best effort, or to all instances when no instance is healthy.',
          },
          healthChecks: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The URL of the HttpHealthCheck resource. A member instance in this pool is considered healthy if and only if the health checks pass. Only legacy HttpHealthChecks are supported. Only one health check may be specified.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          instances: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of resource URLs to the virtual machine instances serving this pool. They must live in zones contained in the same region as this pool.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Always compute#targetPool for target pools.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the target pool resides.",
          },
          securityPolicy: {
            type: "string",
            description:
              "[Output Only] The resource URL for the security policy associated with this target pool.",
          },
          selfLink: {
            type: "string",
            description: "[Output Only] Server-defined URL for the resource.",
          },
          sessionAffinity: {
            type: "string",
            description:
              "Session affinity option, must be one of the following values: NONE: Connections from the same client IP may go to any     instance in the pool. CLIENT_IP: Connections from the same client IP will go     to the same instance in     the pool while that instance remains healthy. CLIENT_IP_PROTO: Connections from the same client IP     with the same IP protocol will go to the same instance in the     pool while that instance remains healthy. Check the SessionAffinity enum for the list of possible values.",
          },
        },
        description:
          "Represents a Target Pool resource.  Target pools are used with external passthrough Network Load Balancers. A target pool references member instances, an associated legacy HttpHealthCheck resource, and, optionally, a backup target pool. For more information, readUsing target pools.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
