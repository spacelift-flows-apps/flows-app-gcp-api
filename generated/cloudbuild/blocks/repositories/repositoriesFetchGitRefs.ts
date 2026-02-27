import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const repositoriesFetchGitRefs: AppBlock = {
  name: "Repositories - Fetch Git Refs",
  description: `Fetch the list of branches or tags for a given repository.`,
  category: "Repositories",
  inputs: {
    default: {
      config: {
        repository: {
          name: "Repository",
          description:
            "Required. The resource name of the repository in the format `projects/*/locations/*/connections/*/repositories/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        refType: {
          name: "Ref Type",
          description: "Type of refs to fetch",
          type: {
            type: "string",
            enum: ["REF_TYPE_UNSPECIFIED", "TAG", "BRANCH"],
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "Optional. Number of results to return in the list. Default to 20.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description: "Optional. Page start.",
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
        const baseUrl = "https://cloudbuild.googleapis.com/";
        let path = `v2/{+repository}:fetchGitRefs`;

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
          refNames: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Name of the refs fetched.",
          },
          nextPageToken: {
            type: "string",
            description:
              "A token identifying a page of results the server should return.",
          },
        },
        description: "Response for fetching git refs",
        additionalProperties: true,
      },
    },
  },
};

export default repositoriesFetchGitRefs;
