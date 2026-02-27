import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const zonesGetServerconfig: AppBlock = {
  name: "Zones - Get Serverconfig",
  description: `Returns configuration info about the Google Kubernetes Engine service.`,
  category: "Zones",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "The name (project and location) of the server config to get, specified in the format `projects/*/locations/*`.",
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
        const baseUrl = "https://container.googleapis.com/";
        let path = `v1/projects/{projectId}/zones/{zone}/serverconfig`;

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
          validMasterVersions: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of valid master versions, in descending order.",
          },
          validImageTypes: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of valid image types.",
          },
          defaultClusterVersion: {
            type: "string",
            description:
              "Version of Kubernetes the service deploys by default.",
          },
          channels: {
            type: "array",
            items: {
              type: "object",
              properties: {
                channel: {
                  type: "string",
                  enum: [
                    "UNSPECIFIED",
                    "RAPID",
                    "REGULAR",
                    "STABLE",
                    "EXTENDED",
                  ],
                  description:
                    "The release channel this configuration applies to.",
                },
                validVersions: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of valid versions for the channel.",
                },
                defaultVersion: {
                  type: "string",
                  description:
                    "The default version for newly created clusters on the channel.",
                },
                upgradeTargetVersion: {
                  type: "string",
                  description:
                    "The auto upgrade target version for clusters on the channel.",
                },
              },
              description:
                "ReleaseChannelConfig exposes configuration for a release channel.",
              additionalProperties: true,
            },
            description: "List of release channel configurations.",
          },
          defaultImageType: {
            type: "string",
            description: "Default image type.",
          },
          validNodeVersions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "List of valid node upgrade target versions, in descending order.",
          },
        },
        description: "Kubernetes Engine service configuration.",
        additionalProperties: true,
      },
    },
  },
};

export default zonesGetServerconfig;
