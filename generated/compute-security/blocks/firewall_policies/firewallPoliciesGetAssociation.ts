import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const firewallPoliciesGetAssociation: AppBlock = {
  name: "Firewall Policies - Get Association",
  description: `Gets an association with the specified name.`,
  category: "Firewall Policies",
  inputs: {
    default: {
      config: {
        firewallPolicy: {
          name: "Firewall Policy",
          description:
            "Name of the firewall policy to which the queried rule belongs.",
          type: {
            type: "string",
          },
          required: true,
        },
        name: {
          name: "Name",
          description:
            "The name of the association to get from the firewall policy.",
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
        let path = `locations/global/firewallPolicies/{firewallPolicy}/getAssociation`;

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
          displayName: {
            type: "string",
            description:
              "[Output Only] Deprecated, please use short name instead. The display name\nof the firewall policy of the association.",
          },
          name: {
            type: "string",
            description: "The name for an association.",
          },
          firewallPolicyId: {
            type: "string",
            description:
              "[Output Only] The firewall policy ID of the association.",
          },
          shortName: {
            type: "string",
            description:
              "[Output Only] The short name of the firewall policy of the association.",
          },
          attachmentTarget: {
            type: "string",
            description: "The target that the firewall policy is attached to.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default firewallPoliciesGetAssociation;
