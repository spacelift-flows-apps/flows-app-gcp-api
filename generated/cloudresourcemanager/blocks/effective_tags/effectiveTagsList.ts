import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const effectiveTagsList: AppBlock = {
  name: "Effective Tags - List",
  description: `Return a list of effective tags for the given Google Cloud resource, as specified in 'parent'.`,
  category: "Effective Tags",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "Optional. The maximum number of effective tags to return in the response. The server allows a maximum of 300 effective tags to return in a single page. If unspecified, the server will use 100 as the default.",
          type: {
            type: "integer",
          },
          required: false,
        },
        parent: {
          name: "Parent",
          description:
            'Required. The full resource name of a resource for which you want to list the effective tags. E.g. "//cloudresourcemanager.googleapis.com/projects/123"',
          type: {
            type: "string",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A pagination token returned from a previous call to `ListEffectiveTags` that indicates from where this listing should continue.",
          type: {
            type: "string",
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
            scopes: [
              "https://www.googleapis.com/auth/cloud-platform",
              "https://www.googleapis.com/auth/cloud-platform.read-only",
            ],
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
        let path = `v3/effectiveTags`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

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
          nextPageToken: {
            type: "string",
            description:
              "Pagination token. If the result set is too large to fit in a single response, this token is returned. It encodes the position of the current result cursor. Feeding this value into a new list request with the `page_token` parameter gives the next page of the results. When `next_page_token` is not filled in, there is no next page and the list returned is the last page in the result set. Pagination tokens have a limited lifetime.",
          },
          effectiveTags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tagValue: {
                  type: "string",
                  description:
                    "Resource name for TagValue in the format `tagValues/456`.",
                },
                tagKeyParentName: {
                  type: "string",
                  description:
                    "The parent name of the tag key. Must be in the format `organizations/{organization_id}` or `projects/{project_number}`",
                },
                tagKey: {
                  type: "string",
                  description:
                    "The name of the TagKey, in the format `tagKeys/{id}`, such as `tagKeys/123`.",
                },
                namespacedTagKey: {
                  type: "string",
                  description:
                    "The namespaced name of the TagKey. Can be in the form `{organization_id}/{tag_key_short_name}` or `{project_id}/{tag_key_short_name}` or `{project_number}/{tag_key_short_name}`.",
                },
                namespacedTagValue: {
                  type: "string",
                  description:
                    "The namespaced name of the TagValue. Can be in the form `{organization_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_id}/{tag_key_short_name}/{tag_value_short_name}` or `{project_number}/{tag_key_short_name}/{tag_value_short_name}`.",
                },
                inherited: {
                  type: "boolean",
                  description:
                    "Indicates the inheritance status of a tag value attached to the given resource. If the tag value is inherited from one of the resource's ancestors, inherited will be true. If false, then the tag value is directly attached to the resource, inherited will be false.",
                },
              },
              description:
                "An EffectiveTag represents a tag that applies to a resource during policy evaluation. Tags can be either directly bound to a resource or inherited from its ancestor. EffectiveTag contains the name and namespaced_name of the tag value and tag key, with additional fields of `inherited` to indicate the inheritance status of the effective tag.",
              additionalProperties: true,
            },
            description:
              "A possibly paginated list of effective tags for the specified resource.",
          },
        },
        description: "The response of ListEffectiveTags.",
        additionalProperties: true,
      },
    },
  },
};

export default effectiveTagsList;
