import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const functionsGenerateUploadUrl: AppBlock = {
  name: "Functions - Generate Upload URL",
  description: `Returns a signed URL for uploading a function source code.`,
  category: "Functions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project and location in which the Google Cloud Storage signed URL should be generated, specified in the format `projects/*/locations/*`.",
          type: {
            type: "string",
          },
          required: true,
        },
        kmsKeyName: {
          name: "KMS Key Name",
          description:
            "Resource name of a KMS crypto key (managed by the user) used to encrypt/decrypt function source code objects in intermediate Cloud Storage buckets.",
          type: {
            type: "string",
            description:
              "Resource name of a KMS crypto key (managed by the user) used to encrypt/decrypt function source code objects in intermediate Cloud Storage buckets. When you generate an upload url and upload your source code, it gets copied to an intermediate Cloud Storage bucket. The source code is then copied to a versioned directory in the sources bucket in the consumer project during the function deployment. It must match the pattern `projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}`. The Google Cloud Functions service account (service-{project_number}@gcf-admin-robot.iam.gserviceaccount.com) must be granted the role 'Cloud KMS CryptoKey Encrypter/Decrypter (roles/cloudkms.cryptoKeyEncrypterDecrypter)' on the Key/KeyRing/Project/Organization (least access preferred).",
          },
          required: false,
        },
        environment: {
          name: "Environment",
          description:
            "The function environment the generated upload url will be used for.",
          type: {
            type: "string",
            enum: ["ENVIRONMENT_UNSPECIFIED", "GEN_1", "GEN_2"],
            description:
              "The function environment the generated upload url will be used for. The upload url for 2nd Gen functions can also be used for 1st gen functions, but not vice versa. If not specified, 2nd generation-style upload URLs are generated.",
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
        const baseUrl = "https://cloudfunctions.googleapis.com/";
        let path = `v2/{+parent}/functions:generateUploadUrl`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.kmsKeyName !== undefined)
          requestBody.kmsKeyName = input.event.inputConfig.kmsKeyName;
        if (input.event.inputConfig.environment !== undefined)
          requestBody.environment = input.event.inputConfig.environment;

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
          uploadUrl: {
            type: "string",
            description:
              "The generated Google Cloud Storage signed URL that should be used for a function source code upload. The uploaded file should be a zip archive which contains a function.",
          },
          storageSource: {
            type: "object",
            properties: {
              bucket: {
                type: "string",
                description:
                  "Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
              },
              object: {
                type: "string",
                description:
                  "Google Cloud Storage object containing the source. This object must be a gzipped archive file (`.tar.gz`) containing source to build.",
              },
              generation: {
                type: "string",
                description:
                  "Google Cloud Storage generation for the object. If the generation is omitted, the latest generation will be used. (Format: int64)",
              },
              sourceUploadUrl: {
                type: "string",
                description:
                  "When the specified storage bucket is a 1st gen function uploard url bucket, this field should be set as the generated upload url for 1st gen deployment.",
              },
            },
            description:
              "Location of the source in an archive file in Google Cloud Storage.",
            additionalProperties: true,
          },
        },
        description: "Response of `GenerateSourceUploadUrl` method.",
        additionalProperties: true,
      },
    },
  },
};

export default functionsGenerateUploadUrl;
