import { AppBlock, events } from "@slflows/sdk/v1";
import { getAutokeyAdminClient } from "../../lib/grpcClient.ts";

const showEffectiveAutokeyConfig: AppBlock = {
  name: "Show Effective Autokey Config",
  description: `Returns the effective Cloud KMS Autokey configuration for a given project.`,
  category: "Autokey",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Name of the resource project to the show effective Cloud KMS Autokey configuration for. This may be helpful for interrogating the effect of nested folder configurations on a given resource project.",
          type: {
            type: "string",
            description:
              "Required. Name of the resource project to the show effective Cloud KMS Autokey configuration for. This may be helpful for interrogating the effect of nested folder configurations on a given resource project.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getAutokeyAdminClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.parent !== undefined)
          request.parent = input.event.inputConfig.parent;

        const result = await new Promise<any>((resolve, reject) => {
          client.showEffectiveAutokeyConfig(
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
          key_project: {
            type: "string",
            description:
              "Name of the key project configured in the resource project's folder ancestry.",
          },
        },
        description:
          "Response message for [ShowEffectiveAutokeyConfig][google.cloud.kms.v1.AutokeyAdmin.ShowEffectiveAutokeyConfig].",
        additionalProperties: true,
      },
    },
  },
};

export default showEffectiveAutokeyConfig;
