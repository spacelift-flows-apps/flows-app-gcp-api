import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const defaultObjectAccessControlsGet: AppBlock = {
  name: "Default Object Access Controls - Get",
  description: `Returns the default object ACL entry for the specified entity on the specified bucket.`,
  category: "Default Object Access Controls",
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
        entity: {
          name: "Entity",
          description:
            "The entity holding the permission. Can be user-userId, user-emailAddress, group-groupId, group-emailAddress, allUsers, or allAuthenticatedUsers.",
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
              "https://www.googleapis.com/auth/devstorage.full_control",
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
        let path = `b/{bucket}/defaultObjectAcl/{entity}`;

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
          bucket: {
            type: "string",
            description: "The name of the bucket.",
          },
          domain: {
            type: "string",
            description: "The domain associated with the entity, if any.",
          },
          email: {
            type: "string",
            description:
              "The email address associated with the entity, if any.",
          },
          entity: {
            type: "string",
            description:
              "The entity holding the permission, in one of the following forms: \n- user-userId \n- user-email \n- group-groupId \n- group-email \n- domain-domain \n- project-team-projectId \n- allUsers \n- allAuthenticatedUsers Examples: \n- The user liz@example.com would be user-liz@example.com. \n- The group example@googlegroups.com would be group-example@googlegroups.com. \n- To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.",
          },
          entityId: {
            type: "string",
            description: "The ID for the entity, if any.",
          },
          etag: {
            type: "string",
            description: "HTTP 1.1 Entity tag for the access-control entry.",
          },
          generation: {
            type: "string",
            description:
              "The content generation of the object, if applied to an object. (Format: int64)",
          },
          id: {
            type: "string",
            description: "The ID of the access-control entry.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For object access control entries, this is always storage#objectAccessControl.",
          },
          object: {
            type: "string",
            description: "The name of the object, if applied to an object.",
          },
          projectTeam: {
            type: "object",
            properties: {
              projectNumber: {
                type: "string",
                description: "The project number.",
              },
              team: {
                type: "string",
                description: "The team.",
              },
            },
            description: "The project team associated with the entity, if any.",
            additionalProperties: true,
          },
          role: {
            type: "string",
            description: "The access permission for the entity.",
          },
          selfLink: {
            type: "string",
            description: "The link to this access-control entry.",
          },
        },
        description: "An access-control entry.",
        additionalProperties: true,
      },
    },
  },
};

export default defaultObjectAccessControlsGet;
