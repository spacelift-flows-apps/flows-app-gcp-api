import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const tagKeysPatch: AppBlock = {
  name: "Tag Keys - Patch",
  description: `Updates the attributes of the TagKey resource.`,
  category: "Tag Keys",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description: "Immutable.",
          type: {
            type: "string",
            description:
              "Immutable. The resource name for a TagKey. Must be in the format `tagKeys/{tag_key_id}`, where `tag_key_id` is the generated numeric id for the TagKey.",
          },
          required: false,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "Set as true to perform validations necessary for updating the resource, but not actually perform the action.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Fields to be updated. The mask may only contain `description` or `etag`. If omitted entirely, both `description` and `etag` are assumed to be significant.",
          type: {
            type: "string",
          },
          required: false,
        },
        parent: {
          name: "Parent",
          description: "Immutable.",
          type: {
            type: "string",
            description:
              "Immutable. The resource name of the TagKey's parent. A TagKey can be parented by an Organization or a Project. For a TagKey parented by an Organization, its parent must be in the form `organizations/{org_id}`. For a TagKey parented by a Project, its parent can be in the form `projects/{project_id}` or `projects/{project_number}`.",
          },
          required: false,
        },
        allowedValuesRegex: {
          name: "Allowed Values Regex",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Regular expression constraint for freeform tag values. If present, it implicitly allows freeform values (constrained by the regex).",
          },
          required: false,
        },
        purpose: {
          name: "Purpose",
          description: "Optional.",
          type: {
            type: "string",
            enum: ["PURPOSE_UNSPECIFIED", "GCE_FIREWALL", "DATA_GOVERNANCE"],
            description:
              "Optional. A purpose denotes that this Tag is intended for use in policies of a specific policy engine, and will involve that policy engine in management operations involving this Tag. A purpose does not grant a policy engine exclusive rights to the Tag, and it may be referenced by other policy engines. A purpose cannot be changed once set.",
          },
          required: false,
        },
        shortName: {
          name: "Short Name",
          description: "Required.",
          type: {
            type: "string",
            description:
              "Required. Immutable. The user friendly name for a TagKey. The short name should be unique for TagKeys within the same tag namespace. The short name must be 1-256 characters, beginning and ending with an alphanumeric character ([a-z0-9A-Z]) with dashes (-), underscores (_), dots (.), and alphanumerics between.",
          },
          required: false,
        },
        purposeData: {
          name: "Purpose Data",
          description: "Optional.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Purpose data corresponds to the policy system that the tag is intended for. See documentation for `Purpose` for formatting of this field. Purpose data cannot be changed once set.",
          },
          required: false,
        },
        description: {
          name: "Description",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. User-assigned description of the TagKey. Must not exceed 256 characters. Read-write.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Entity tag which users can pass to prevent race conditions. This field is always set in server responses. See UpdateTagKeyRequest for details.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error(
            "Either serviceAccountKey or accessToken must be provided in app configuration",
          );
        }

        // Build request URL and parameters
        const baseUrl = "https://cloudresourcemanager.googleapis.com/";
        let path = `v3/{+name}`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.parent !== undefined)
          requestBody.parent = input.event.inputConfig.parent;
        if (input.event.inputConfig.allowedValuesRegex !== undefined)
          requestBody.allowedValuesRegex =
            input.event.inputConfig.allowedValuesRegex;
        if (input.event.inputConfig.purpose !== undefined)
          requestBody.purpose = input.event.inputConfig.purpose;
        if (input.event.inputConfig.shortName !== undefined)
          requestBody.shortName = input.event.inputConfig.shortName;
        if (input.event.inputConfig.purposeData !== undefined)
          requestBody.purposeData = input.event.inputConfig.purposeData;
        if (input.event.inputConfig.description !== undefined)
          requestBody.description = input.event.inputConfig.description;
        if (input.event.inputConfig.name !== undefined)
          requestBody.name = input.event.inputConfig.name;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
          );
        }

        const result = await response.json();
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
          response: {
            type: "object",
            additionalProperties: true,
            description:
              "The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.",
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description:
              "Service-specific metadata associated with the operation. It typically contains progress information and common metadata such as create time. Some services might not provide such metadata. Any method that returns a long-running operation should document the metadata type, if any.",
          },
          name: {
            type: "string",
            description:
              "The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`.",
          },
          error: {
            type: "object",
            properties: {
              details: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description:
                  "A list of messages that carry the error details. There is a common set of message types for APIs to use.",
              },
              message: {
                type: "string",
                description:
                  "A developer-facing error message, which should be in English. Any user-facing error message should be localized and sent in the google.rpc.Status.details field, or localized by the client.",
              },
              code: {
                type: "integer",
                description:
                  "The status code, which should be an enum value of google.rpc.Code. (Format: int32)",
              },
            },
            description:
              "The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).",
            additionalProperties: true,
          },
          done: {
            type: "boolean",
            description:
              "If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.",
          },
        },
        description:
          "This resource represents a long-running operation that is the result of a network API call.",
        additionalProperties: true,
      },
    },
  },
};

export default tagKeysPatch;
