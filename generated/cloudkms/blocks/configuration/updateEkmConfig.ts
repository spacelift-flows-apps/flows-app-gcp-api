import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const updateEkmConfig: AppBlock = {
  name: "Configuration - Update EKM Config",
  description: `Updates the EkmConfig singleton resource for a given project and location.`,
  category: "Configuration",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Output only. The resource name for the EkmConfig in the format `projects/*/locations/*/ekmConfig`.",
          type: {
            type: "string",
          },
          required: true,
        },
        updateMask: {
          name: "Update Mask",
          description:
            "Required. List of fields to be updated in this request.",
          type: {
            type: "string",
          },
          required: false,
        },
        defaultEkmConnection: {
          name: "Default EKM Connection",
          description: "Optional.",
          type: {
            type: "string",
            description:
              "Optional. Resource name of the default EkmConnection. Setting this field to the empty string removes the default.",
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
              "https://www.googleapis.com/auth/cloudkms",
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
        const baseUrl = "https://cloudkms.googleapis.com/";
        let path = `v1/{+name}`;

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

        if (input.event.inputConfig.defaultEkmConnection !== undefined)
          requestBody.defaultEkmConnection =
            input.event.inputConfig.defaultEkmConnection;

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
          name: {
            type: "string",
            description:
              "Output only. The resource name for the EkmConfig in the format `projects/*/locations/*/ekmConfig`.",
          },
          defaultEkmConnection: {
            type: "string",
            description:
              "Optional. Resource name of the default EkmConnection. Setting this field to the empty string removes the default.",
          },
        },
        description:
          "An EkmConfig is a singleton resource that represents configuration parameters that apply to all CryptoKeys and CryptoKeyVersions with a ProtectionLevel of EXTERNAL_VPC in a given project and location.",
        additionalProperties: true,
      },
    },
  },
};

export default updateEkmConfig;
