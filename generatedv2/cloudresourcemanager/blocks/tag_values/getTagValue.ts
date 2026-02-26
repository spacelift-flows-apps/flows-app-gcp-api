import { AppBlock, events } from "@slflows/sdk/v1";
import { getTagValuesClient } from "../../lib/grpcClient.ts";

const getTagValue: AppBlock = {
  name: "Get Tag Value",
  description: `Retrieves a TagValue. This method will return 'PERMISSION_DENIED' if the value does not exist or the user does not have permission to view it.`,
  category: "Tag Values",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Resource name for TagValue to be fetched in the format `tagValues/456`.",
          type: {
            type: "string",
            description:
              "Required. Resource name for TagValue to be fetched in the format `tagValues/456`.",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const client = await getTagValuesClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.name !== undefined)
          request.name = input.event.inputConfig.name;

        const result = await new Promise<any>((resolve, reject) => {
          client.getTagValue(request, (err: any, response: any) => {
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
        properties: {
          name: {
            type: "string",
            description:
              "Immutable. Resource name for TagValue in the format `tagValues/456`.",
          },
          parent: {
            type: "string",
            description:
              "Immutable. The resource name of the new TagValue's parent TagKey. Must be of the form `tagKeys/{tag_key_id}`.",
          },
          short_name: {
            type: "string",
            description:
              "Required. Immutable. User-assigned short name for TagValue. The short name should be unique for TagValues within the same parent TagKey.  The short name must be 63 characters or less, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
          },
          namespaced_name: {
            type: "string",
            description:
              "Output only. The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
          },
          description: {
            type: "string",
            description:
              "Optional. User-assigned description of the TagValue. Must not exceed 256 characters.  Read-write.",
          },
          create_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          update_time: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          etag: {
            type: "string",
            description:
              "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagValueRequest for details.",
          },
        },
        required: ["short_name"],
        description:
          "A TagValue is a child of a particular TagKey. This is used to group cloud resources for the purpose of controlling them using policies.",
        additionalProperties: true,
      },
    },
  },
};

export default getTagValue;
