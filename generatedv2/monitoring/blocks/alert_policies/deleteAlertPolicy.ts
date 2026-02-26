import { AppBlock, events } from "@slflows/sdk/v1";
import { getAlertPolicyServiceClient } from "../../lib/grpcClient.ts";

const deleteAlertPolicy: AppBlock = {
  name: "Delete Alert Policy",
  description: `Deletes an alerting policy. Design your application to single-thread API calls that modify the state of alerting policies in a single project. This includes calls to CreateAlertPolicy, DeleteAlertPolicy and UpdateAlertPolicy.`,
  category: "Alert Policies",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The alerting policy to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[ALERT_POLICY_ID]  For more information, see [AlertPolicy][google.monitoring.v3.AlertPolicy].",
          type: {
            type: "string",
            description:
              "Required. The alerting policy to delete. The format is:      projects/[PROJECT_ID_OR_NUMBER]/alertPolicies/[ALERT_POLICY_ID]  For more information, see [AlertPolicy][google.monitoring.v3.AlertPolicy].",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAlertPolicyServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.deleteAlertPolicy(request, (err: any, response: any) => {
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

export default deleteAlertPolicy;
