import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const bucketAccessControlsPatch: AppBlock = {
  name: "Bucket Access Controls - Patch",
  description: `Patches an ACL entry on the specified bucket.`,
  category: "Bucket Access Controls",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "The name of the bucket.",
          type: {
            type: "string",
            description: "The name of the bucket.",
          },
          required: false,
        },
        entity: {
          name: "Entity",
          description:
            "The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.",
          type: {
            type: "string",
            description:
              "The entity holding the permission, in one of the following forms: \n- user-userId \n- user-email \n- group-groupId \n- group-email \n- domain-domain \n- project-team-projectId \n- allUsers \n- allAuthenticatedUsers Examples: \n- The user liz@example.com would be user-liz@example.com. \n- The group example@googlegroups.com would be group-example@googlegroups.com. \n- To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.",
          },
          required: false,
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
        domain: {
          name: "Domain",
          description: "The domain associated with the entity, if any.",
          type: {
            type: "string",
            description: "The domain associated with the entity, if any.",
          },
          required: false,
        },
        email: {
          name: "Email",
          description: "The email address associated with the entity, if any.",
          type: {
            type: "string",
            description:
              "The email address associated with the entity, if any.",
          },
          required: false,
        },
        entityId: {
          name: "Entity ID",
          description: "The ID for the entity, if any.",
          type: {
            type: "string",
            description: "The ID for the entity, if any.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "HTTP 1.",
          type: {
            type: "string",
            description: "HTTP 1.1 Entity tag for the access-control entry.",
          },
          required: false,
        },
        id: {
          name: "ID",
          description: "The ID of the access-control entry.",
          type: {
            type: "string",
            description: "The ID of the access-control entry.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.",
          },
          required: false,
        },
        projectTeam: {
          name: "Project Team",
          description: "The project team associated with the entity, if any.",
          type: {
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
          required: false,
        },
        role: {
          name: "Role",
          description: "The access permission for the entity.",
          type: {
            type: "string",
            description: "The access permission for the entity.",
          },
          required: false,
        },
        selfLink: {
          name: "Self Link",
          description: "The link to this access-control entry.",
          type: {
            type: "string",
            description: "The link to this access-control entry.",
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
        let path = `b/{bucket}/acl/{entity}`;

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

        if (input.event.inputConfig.bucket !== undefined)
          requestBody.bucket = input.event.inputConfig.bucket;
        if (input.event.inputConfig.domain !== undefined)
          requestBody.domain = input.event.inputConfig.domain;
        if (input.event.inputConfig.email !== undefined)
          requestBody.email = input.event.inputConfig.email;
        if (input.event.inputConfig.entity !== undefined)
          requestBody.entity = input.event.inputConfig.entity;
        if (input.event.inputConfig.entityId !== undefined)
          requestBody.entityId = input.event.inputConfig.entityId;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.projectTeam !== undefined)
          requestBody.projectTeam = input.event.inputConfig.projectTeam;
        if (input.event.inputConfig.role !== undefined)
          requestBody.role = input.event.inputConfig.role;
        if (input.event.inputConfig.selfLink !== undefined)
          requestBody.selfLink = input.event.inputConfig.selfLink;

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
          id: {
            type: "string",
            description: "The ID of the access-control entry.",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For bucket access control entries, this is always storage#bucketAccessControl.",
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

export default bucketAccessControlsPatch;
