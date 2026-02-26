import { AppBlock, events } from "@slflows/sdk/v1";
import { getMetricServiceClient } from "../../lib/grpcClient.ts";

const deleteMetricDescriptor: AppBlock = {
  name: "Delete Metric Descriptor",
  description: `Deletes a metric descriptor. Only user-created [custom metrics](https://cloud.google.com/monitoring/custom-metrics) can be deleted.`,
  category: "Metric Descriptors",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            'Required. The metric descriptor on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/metricDescriptors/[METRIC_ID]  An example of `[METRIC_ID]` is: `"custom.googleapis.com/my_test_metric"`.',
          type: {
            type: "string",
            description:
              'Required. The metric descriptor on which to execute the request. The format is:      projects/[PROJECT_ID_OR_NUMBER]/metricDescriptors/[METRIC_ID]  An example of `[METRIC_ID]` is: `"custom.googleapis.com/my_test_metric"`.',
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getMetricServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteMetricDescriptor(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
        properties: {},
        additionalProperties: true,
      },
    },
  },
};

export default deleteMetricDescriptor;
