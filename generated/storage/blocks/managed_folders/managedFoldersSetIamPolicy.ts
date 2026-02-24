import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const managedFoldersSetIamPolicy: AppBlock = {
  name: "Managed Folders - Set IAM Policy",
  description: `Updates an IAM policy for the specified managed folder.`,
  category: "Managed Folders",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket containing the managed folder.",
          type: {
            type: "string",
          },
          required: true,
        },
        managedFolder: {
          name: "Managed Folder",
          description: "The managed folder name/path.",
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
        bindings: {
          name: "Bindings",
          description:
            "An association between a role, which comes with a set of permissions, and members who may assume that role.",
          type: {
            type: "array",
            items: {
              type: "object",
              properties: {
                condition: {
                  type: "object",
                  properties: {
                    description: {
                      type: "string",
                      description:
                        "An optional description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.",
                    },
                    expression: {
                      type: "string",
                      description:
                        "Textual representation of an expression in Common Expression Language syntax. The application context of the containing message determines which well-known feature set of CEL is supported.",
                    },
                    location: {
                      type: "string",
                      description:
                        "An optional string indicating the location of the expression for error reporting, e.g. a file name and a position in the file.",
                    },
                    title: {
                      type: "string",
                      description:
                        "An optional title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.",
                    },
                  },
                  description:
                    'Represents an expression text. Example: title: "User account presence" description: "Determines whether the request has a user account" expression: "size(request.user) > 0"',
                  additionalProperties: true,
                },
                members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A collection of identifiers for members who may assume the provided role. Recognized identifiers are as follows:  \n- allUsers - A special identifier that represents anyone on the internet; with or without a Google account.  \n- allAuthenticatedUsers - A special identifier that represents anyone who is authenticated with a Google account or a service account.  \n- user:emailid - An email address that represents a specific account. For example, user:alice@gmail.com or user:joe@example.com.  \n- serviceAccount:emailid - An email address that represents a service account. For example,  serviceAccount:my-other-app@appspot.gserviceaccount.com .  \n- group:emailid - An email address that represents a Google group. For example, group:admins@example.com.  \n- domain:domain - A Google Apps domain name that represents all the users of that domain. For example, domain:google.com or domain:example.com.  \n- projectOwner:projectid - Owners of the given project. For example, projectOwner:my-example-project  \n- projectEditor:projectid - Editors of the given project. For example, projectEditor:my-example-project  \n- projectViewer:projectid - Viewers of the given project. For example, projectViewer:my-example-project",
                },
                role: {
                  type: "string",
                  description:
                    "The role to which members belong. Two types of roles are supported: new IAM roles, which grant permissions that do not map directly to those provided by ACLs, and legacy IAM roles, which do map directly to ACL permissions. All roles are of the format roles/storage.specificRole.\nThe new IAM roles are:  \n- roles/storage.admin - Full control of Google Cloud Storage resources.  \n- roles/storage.objectViewer - Read-Only access to Google Cloud Storage objects.  \n- roles/storage.objectCreator - Access to create objects in Google Cloud Storage.  \n- roles/storage.objectAdmin - Full control of Google Cloud Storage objects.   The legacy IAM roles are:  \n- roles/storage.legacyObjectReader - Read-only access to objects without listing. Equivalent to an ACL entry on an object with the READER role.  \n- roles/storage.legacyObjectOwner - Read/write access to existing objects without listing. Equivalent to an ACL entry on an object with the OWNER role.  \n- roles/storage.legacyBucketReader - Read access to buckets with object listing. Equivalent to an ACL entry on a bucket with the READER role.  \n- roles/storage.legacyBucketWriter - Read access to buckets with object listing/creation/deletion. Equivalent to an ACL entry on a bucket with the WRITER role.  \n- roles/storage.legacyBucketOwner - Read and write access to existing buckets with object listing/creation/deletion. Equivalent to an ACL entry on a bucket with the OWNER role.",
                },
              },
              additionalProperties: true,
            },
            description:
              "An association between a role, which comes with a set of permissions, and members who may assume that role.",
          },
          required: false,
        },
        etag: {
          name: "Etag",
          description: "HTTP 1.",
          type: {
            type: "string",
            description: "HTTP 1.1  Entity tag for the policy. (Format: byte)",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description: "The kind of item this is.",
          type: {
            type: "string",
            description:
              "The kind of item this is. For policies, this is always storage#policy. This field is ignored on input.",
          },
          required: false,
        },
        resourceId: {
          name: "Resource ID",
          description: "The ID of the resource to which this policy belongs.",
          type: {
            type: "string",
            description:
              "The ID of the resource to which this policy belongs. Will be of the form projects/_/buckets/bucket for buckets, projects/_/buckets/bucket/objects/object for objects, and projects/_/buckets/bucket/managedFolders/managedFolder. A specific generation may be specified by appending #generationNumber to the end of the object name, e.g. projects/_/buckets/my-bucket/objects/data.txt#17. The current generation can be denoted with #0. This field is ignored on input.",
          },
          required: false,
        },
        version: {
          name: "Version",
          description: "The IAM policy format version.",
          type: {
            type: "integer",
            description: "The IAM policy format version. (Format: int32)",
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
        let path = `b/{bucket}/managedFolders/{managedFolder}/iam`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.bindings !== undefined)
          requestBody.bindings = input.event.inputConfig.bindings;
        if (input.event.inputConfig.etag !== undefined)
          requestBody.etag = input.event.inputConfig.etag;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.resourceId !== undefined)
          requestBody.resourceId = input.event.inputConfig.resourceId;
        if (input.event.inputConfig.version !== undefined)
          requestBody.version = input.event.inputConfig.version;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

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
          bindings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                condition: {
                  type: "object",
                  properties: {
                    description: {
                      type: "string",
                      description:
                        "An optional description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.",
                    },
                    expression: {
                      type: "string",
                      description:
                        "Textual representation of an expression in Common Expression Language syntax. The application context of the containing message determines which well-known feature set of CEL is supported.",
                    },
                    location: {
                      type: "string",
                      description:
                        "An optional string indicating the location of the expression for error reporting, e.g. a file name and a position in the file.",
                    },
                    title: {
                      type: "string",
                      description:
                        "An optional title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.",
                    },
                  },
                  description:
                    'Represents an expression text. Example: title: "User account presence" description: "Determines whether the request has a user account" expression: "size(request.user) > 0"',
                  additionalProperties: true,
                },
                members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "A collection of identifiers for members who may assume the provided role. Recognized identifiers are as follows:  \n- allUsers - A special identifier that represents anyone on the internet; with or without a Google account.  \n- allAuthenticatedUsers - A special identifier that represents anyone who is authenticated with a Google account or a service account.  \n- user:emailid - An email address that represents a specific account. For example, user:alice@gmail.com or user:joe@example.com.  \n- serviceAccount:emailid - An email address that represents a service account. For example,  serviceAccount:my-other-app@appspot.gserviceaccount.com .  \n- group:emailid - An email address that represents a Google group. For example, group:admins@example.com.  \n- domain:domain - A Google Apps domain name that represents all the users of that domain. For example, domain:google.com or domain:example.com.  \n- projectOwner:projectid - Owners of the given project. For example, projectOwner:my-example-project  \n- projectEditor:projectid - Editors of the given project. For example, projectEditor:my-example-project  \n- projectViewer:projectid - Viewers of the given project. For example, projectViewer:my-example-project",
                },
                role: {
                  type: "string",
                  description:
                    "The role to which members belong. Two types of roles are supported: new IAM roles, which grant permissions that do not map directly to those provided by ACLs, and legacy IAM roles, which do map directly to ACL permissions. All roles are of the format roles/storage.specificRole.\nThe new IAM roles are:  \n- roles/storage.admin - Full control of Google Cloud Storage resources.  \n- roles/storage.objectViewer - Read-Only access to Google Cloud Storage objects.  \n- roles/storage.objectCreator - Access to create objects in Google Cloud Storage.  \n- roles/storage.objectAdmin - Full control of Google Cloud Storage objects.   The legacy IAM roles are:  \n- roles/storage.legacyObjectReader - Read-only access to objects without listing. Equivalent to an ACL entry on an object with the READER role.  \n- roles/storage.legacyObjectOwner - Read/write access to existing objects without listing. Equivalent to an ACL entry on an object with the OWNER role.  \n- roles/storage.legacyBucketReader - Read access to buckets with object listing. Equivalent to an ACL entry on a bucket with the READER role.  \n- roles/storage.legacyBucketWriter - Read access to buckets with object listing/creation/deletion. Equivalent to an ACL entry on a bucket with the WRITER role.  \n- roles/storage.legacyBucketOwner - Read and write access to existing buckets with object listing/creation/deletion. Equivalent to an ACL entry on a bucket with the OWNER role.",
                },
              },
              additionalProperties: true,
            },
            description:
              "An association between a role, which comes with a set of permissions, and members who may assume that role.",
          },
          etag: {
            type: "string",
            description: "HTTP 1.1  Entity tag for the policy. (Format: byte)",
          },
          kind: {
            type: "string",
            description:
              "The kind of item this is. For policies, this is always storage#policy. This field is ignored on input.",
          },
          resourceId: {
            type: "string",
            description:
              "The ID of the resource to which this policy belongs. Will be of the form projects/_/buckets/bucket for buckets, projects/_/buckets/bucket/objects/object for objects, and projects/_/buckets/bucket/managedFolders/managedFolder. A specific generation may be specified by appending #generationNumber to the end of the object name, e.g. projects/_/buckets/my-bucket/objects/data.txt#17. The current generation can be denoted with #0. This field is ignored on input.",
          },
          version: {
            type: "integer",
            description: "The IAM policy format version. (Format: int32)",
          },
        },
        description: "A bucket/object/managedFolder IAM policy.",
        additionalProperties: true,
      },
    },
  },
};

export default managedFoldersSetIamPolicy;
