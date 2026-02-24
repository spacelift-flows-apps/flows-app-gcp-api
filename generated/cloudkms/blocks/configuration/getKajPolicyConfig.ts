import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const getKajPolicyConfig: AppBlock = {
  name: "Configuration - Get KAJ Policy Config",
  description: `Gets the KeyAccessJustificationsPolicyConfig for a given organization, folder, or project.`,
  category: "Configuration",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the KeyAccessJustificationsPolicyConfig to get.",
          type: {
            type: "string",
          },
          required: true,
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
          name: {
            type: "string",
            description:
              'Identifier. The resource name for this KeyAccessJustificationsPolicyConfig in the format of "{organizations|folders|projects}/*/kajPolicyConfig".',
          },
          defaultKeyAccessJustificationPolicy: {
            type: "object",
            properties: {
              allowedAccessReasons: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "REASON_UNSPECIFIED",
                    "CUSTOMER_INITIATED_SUPPORT",
                    "GOOGLE_INITIATED_SERVICE",
                    "THIRD_PARTY_DATA_REQUEST",
                    "GOOGLE_INITIATED_REVIEW",
                    "CUSTOMER_INITIATED_ACCESS",
                    "GOOGLE_INITIATED_SYSTEM_OPERATION",
                    "REASON_NOT_EXPECTED",
                    "MODIFIED_CUSTOMER_INITIATED_ACCESS",
                    "MODIFIED_GOOGLE_INITIATED_SYSTEM_OPERATION",
                    "GOOGLE_RESPONSE_TO_PRODUCTION_ALERT",
                    "CUSTOMER_AUTHORIZED_WORKFLOW_SERVICING",
                  ],
                },
                description:
                  "The list of allowed reasons for access to a CryptoKey. Zero allowed access reasons means all encrypt, decrypt, and sign operations for the CryptoKey associated with this policy will fail.",
              },
            },
            description:
              "A KeyAccessJustificationsPolicy specifies zero or more allowed AccessReason values for encrypt, decrypt, and sign operations on a CryptoKey.",
            additionalProperties: true,
          },
        },
        description:
          "A singleton configuration for Key Access Justifications policies.",
        additionalProperties: true,
      },
    },
  },
};

export default getKajPolicyConfig;
