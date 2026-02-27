import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const bucketsTestIamPermissions: AppBlock = {
  name: "Buckets - Test IAM Permissions",
  description: `Tests a set of permissions on the given bucket to see which, if any, are held by the caller.`,
  category: "Buckets",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of a bucket.",
          type: {
            type: "string",
          },
          required: true,
        },
        permissions: {
          name: "Permissions",
          description: "Permissions to test.",
          type: {
            type: "string",
          },
          required: true,
        },
        userProject: {
          name: "User Project",
          description:
            "The project to be billed for this request. Required for Requester Pays buckets.",
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
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/devstorage.read_write",
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
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/iam/testPermissions`;

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
          kind: {
            type: "string",
            description: "The kind of item this is.",
          },
          permissions: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "The permissions held by the caller. Permissions are always of the format storage.resource.capability, where resource is one of buckets, objects, or managedFolders. The supported permissions are as follows:  \n- storage.buckets.delete - Delete bucket.  \n- storage.buckets.get - Read bucket metadata.  \n- storage.buckets.getIamPolicy - Read bucket IAM policy.  \n- storage.buckets.create - Create bucket.  \n- storage.buckets.list - List buckets.  \n- storage.buckets.setIamPolicy - Update bucket IAM policy.  \n- storage.buckets.update - Update bucket metadata.  \n- storage.objects.delete - Delete object.  \n- storage.objects.get - Read object data and metadata.  \n- storage.objects.getIamPolicy - Read object IAM policy.  \n- storage.objects.create - Create object.  \n- storage.objects.list - List objects.  \n- storage.objects.setIamPolicy - Update object IAM policy.  \n- storage.objects.update - Update object metadata. \n- storage.managedFolders.delete - Delete managed folder.  \n- storage.managedFolders.get - Read managed folder metadata.  \n- storage.managedFolders.getIamPolicy - Read managed folder IAM policy.  \n- storage.managedFolders.create - Create managed folder.  \n- storage.managedFolders.list - List managed folders.  \n- storage.managedFolders.setIamPolicy - Update managed folder IAM policy.",
          },
        },
        description:
          "A storage.(buckets|objects|managedFolders).testIamPermissions response.",
        additionalProperties: true,
      },
    },
  },
};

export default bucketsTestIamPermissions;
