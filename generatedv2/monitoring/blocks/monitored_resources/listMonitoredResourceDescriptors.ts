import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  resource_descriptors: {
    name: "resourceDescriptors",
    fields: {
      display_name: "displayName",
      labels: {
        name: "labels",
        fields: {
          value_type: "valueType",
        },
      },
      launch_stage: "launchStage",
    },
  },
  next_page_token: "nextPageToken",
};

const listMonitoredResourceDescriptors: AppBlock = {
  name: "List Monitored Resource Descriptors",
  description: `Lists monitored resource descriptors that match a filter.`,
  category: "Monitored Resources",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. The [project](https://cloud.google.com/monitoring/api/v3#project_name) on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'An optional [filter](https://cloud.google.com/monitoring/api/v3/filters) describing the descriptors to be returned.  The filter can reference the descriptor\'s type and labels. For example, the following filter returns only Google Compute Engine descriptors that have an `id` label:      resource.type = starts_with("gce_") AND resource.label:id',
          type: {
            type: "string",
            description:
              'An optional [filter](https://cloud.google.com/monitoring/api/v3/filters) describing the descriptors to be returned.  The filter can reference the descriptor\'s type and labels. For example, the following filter returns only Google Compute Engine descriptors that have an `id` label:      resource.type = starts_with("gce_") AND resource.label:id',
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of results to return.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of results to return.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listMonitoredResourceDescriptors(
            request,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          resourceDescriptors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                displayName: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                labels: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                      },
                      valueType: {
                        type: "string",
                        enum: ["STRING", "BOOL", "INT64"],
                      },
                      description: {
                        type: "string",
                      },
                    },
                    additionalProperties: true,
                  },
                },
                launchStage: {
                  type: "string",
                  enum: [
                    "LAUNCH_STAGE_UNSPECIFIED",
                    "UNIMPLEMENTED",
                    "PRELAUNCH",
                    "EARLY_ACCESS",
                    "ALPHA",
                    "BETA",
                    "GA",
                    "DEPRECATED",
                  ],
                },
              },
              additionalProperties: true,
            },
            description:
              "The monitored resource descriptors that are available to this project and that match `filter`, if present.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
        },
        description: "The `ListMonitoredResourceDescriptors` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listMonitoredResourceDescriptors;
