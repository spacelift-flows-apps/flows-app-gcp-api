import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const organizationSecurityPoliciesGetAssociation: AppBlock = {
  name: "Organization Security Policies - Get Association",
  description: `Gets an association with the specified name.`,
  category: "Organization Security Policies",
  inputs: {
    default: {
      config: {
        securityPolicy: {
          name: "Security Policy",
          description:
            "Name of the security policy to which the queried rule belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name of the association to get from the security policy.",
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
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `locations/global/securityPolicies/{securityPolicy}/getAssociation`;

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
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}`,
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
          securityPolicyId: {
            type: "string",
            description:
              "[Output Only] The security policy ID of the association.",
          },
          name: {
            type: "string",
            description: "The name for an association.",
          },
          attachmentId: {
            type: "string",
            description:
              "The resource that the security policy is attached to.",
          },
          shortName: {
            type: "string",
            description:
              "[Output Only] The short name of the security policy of the association.",
          },
          excludedProjects: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of projects to exclude from the security policy.",
          },
          excludedFolders: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "A list of folders to exclude from the security policy.",
          },
          displayName: {
            type: "string",
            description:
              "[Output Only] The display name of the security policy of the association.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default organizationSecurityPoliciesGetAssociation;
