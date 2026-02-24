import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionDisksSetIamPolicy: AppBlock = {
  name: "Region Disks - Set IAM Policy",
  description: `Sets the access control policy on the specified resource.`,
  category: "Region Disks",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "The name of the region for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        resource: {
          name: "Resource",
          description: "Name or id of the resource for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        policy: {
          name: "Policy",
          description:
            "REQUIRED: The complete policy to be applied to the 'resource'.",
          type: {
            type: "object",
            properties: {
              etag: {
                type: "string",
                description:
                  "`etag` is used for optimistic concurrency control as a way to help\nprevent simultaneous updates of a policy from overwriting each other.\nIt is strongly suggested that systems make use of the `etag` in the\nread-modify-write cycle to perform policy updates in order to avoid race\nconditions: An `etag` is returned in the response to `getIamPolicy`, and\nsystems are expected to put that etag in the request to `setIamPolicy` to\nensure that their change will be applied to the same version of the policy.\n\n**Important:** If you use IAM Conditions, you must include the `etag` field\nwhenever you call `setIamPolicy`. If you omit this field, then IAM allows\nyou to overwrite a version `3` policy with a version `1` policy, and all of\nthe conditions in the version `3` policy are lost. (Format: byte)",
              },
              version: {
                type: "integer",
                description:
                  "Specifies the format of the policy.\n\nValid values are `0`, `1`, and `3`. Requests that specify an invalid value\nare rejected.\n\nAny operation that affects conditional role bindings must specify version\n`3`. This requirement applies to the following operations:\n\n* Getting a policy that includes a conditional role binding\n* Adding a conditional role binding to a policy\n* Changing a conditional role binding in a policy\n* Removing any role binding, with or without a condition, from a policy\n  that includes conditions\n\n**Important:** If you use IAM Conditions, you must include the `etag` field\nwhenever you call `setIamPolicy`. If you omit this field, then IAM allows\nyou to overwrite a version `3` policy with a version `1` policy, and all of\nthe conditions in the version `3` policy are lost.\n\nIf a policy does not include any conditions, operations on that policy may\nspecify any valid version or leave the field unset.\n\nTo learn which resources support conditions in their IAM policies, see the\n[IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). (Format: int32)",
              },
              auditConfigs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    auditLogConfigs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          logType: {
                            type: "string",
                            enum: [
                              "ADMIN_READ",
                              "DATA_READ",
                              "DATA_WRITE",
                              "LOG_TYPE_UNSPECIFIED",
                            ],
                            description:
                              "The log type that this config enables.",
                          },
                          exemptedMembers: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                            description:
                              "Specifies the identities that do not cause logging for this type of\npermission.\nFollows the same format of Binding.members.",
                          },
                        },
                        description:
                          'Provides the configuration for logging a type of permissions.\nExample:\n\n    {\n      "audit_log_configs": [\n        {\n          "log_type": "DATA_READ",\n          "exempted_members": [\n            "user:jose@example.com"\n          ]\n        },\n        {\n          "log_type": "DATA_WRITE"\n        }\n      ]\n    }\n\nThis enables \'DATA_READ\' and \'DATA_WRITE\' logging, while exempting\njose@example.com from DATA_READ logging.',
                        additionalProperties: true,
                      },
                      description:
                        "The configuration for logging of each type of permission.",
                    },
                    service: {
                      type: "string",
                      description:
                        "Specifies a service that will be enabled for audit logging.\nFor example, `storage.googleapis.com`, `cloudsql.googleapis.com`.\n`allServices` is a special value that covers all services.",
                    },
                  },
                  description:
                    'Specifies the audit configuration for a service.\nThe configuration determines which permission types are logged, and what\nidentities, if any, are exempted from logging.\nAn AuditConfig must have one or more AuditLogConfigs.\n\nIf there are AuditConfigs for both `allServices` and a specific service,\nthe union of the two AuditConfigs is used for that service: the log_types\nspecified in each AuditConfig are enabled, and the exempted_members in each\nAuditLogConfig are exempted.\n\nExample Policy with multiple AuditConfigs:\n\n    {\n      "audit_configs": [\n        {\n          "service": "allServices",\n          "audit_log_configs": [\n            {\n              "log_type": "DATA_READ",\n              "exempted_members": [\n                "user:jose@example.com"\n              ]\n            },\n            {\n              "log_type": "DATA_WRITE"\n            },\n            {\n              "log_type": "ADMIN_READ"\n            }\n          ]\n        },\n        {\n          "service": "sampleservice.googleapis.com",\n          "audit_log_configs": [\n            {\n              "log_type": "DATA_READ"\n            },\n            {\n              "log_type": "DATA_WRITE",\n              "exempted_members": [\n                "user:aliya@example.com"\n              ]\n            }\n          ]\n        }\n      ]\n    }\n\nFor sampleservice, this policy enables DATA_READ, DATA_WRITE and ADMIN_READ\nlogging. It also exempts `jose@example.com` from DATA_READ logging, and\n`aliya@example.com` from DATA_WRITE logging.',
                  additionalProperties: true,
                },
                description:
                  "Specifies cloud audit logging configuration for this policy.",
              },
              bindings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    members: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description:
                        "Specifies the principals requesting access for a Google Cloud resource.\n`members` can have the following values:\n\n* `allUsers`: A special identifier that represents anyone who is\n   on the internet; with or without a Google account.\n\n* `allAuthenticatedUsers`: A special identifier that represents anyone\n   who is authenticated with a Google account or a service account.\n   Does not include identities that come from external identity providers\n   (IdPs) through identity federation.\n\n* `user:{emailid}`: An email address that represents a specific Google\n   account. For example, `alice@example.com` .\n\n\n* `serviceAccount:{emailid}`: An email address that represents a Google\n   service account. For example,\n   `my-other-app@appspot.gserviceaccount.com`.\n\n* `serviceAccount:{projectid}.svc.id.goog[{namespace}/{kubernetes-sa}]`: An\n   identifier for a\n   [Kubernetes service\n   account](https://cloud.google.com/kubernetes-engine/docs/how-to/kubernetes-service-accounts).\n   For example, `my-project.svc.id.goog[my-namespace/my-kubernetes-sa]`.\n\n* `group:{emailid}`: An email address that represents a Google group.\n   For example, `admins@example.com`.\n\n\n* `domain:{domain}`: The G Suite domain (primary) that represents all the\n   users of that domain. For example, `google.com` or `example.com`.\n\n\n\n\n* `principal://iam.googleapis.com/locations/global/workforcePools/{pool_id}/subject/{subject_attribute_value}`:\n  A single identity in a workforce identity pool.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/group/{group_id}`:\n  All workforce identities in a group.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/attribute.{attribute_name}/{attribute_value}`:\n  All workforce identities with a specific attribute value.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/*`:\n  All identities in a workforce identity pool.\n\n* `principal://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/subject/{subject_attribute_value}`:\n  A single identity in a workload identity pool.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/group/{group_id}`:\n  A workload identity pool group.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/attribute.{attribute_name}/{attribute_value}`:\n  All identities in a workload identity pool with a certain attribute.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/*`:\n  All identities in a workload identity pool.\n\n* `deleted:user:{emailid}?uid={uniqueid}`: An email address (plus unique\n   identifier) representing a user that has been recently deleted. For\n   example, `alice@example.com?uid=123456789012345678901`. If the user is\n   recovered, this value reverts to `user:{emailid}` and the recovered user\n   retains the role in the binding.\n\n* `deleted:serviceAccount:{emailid}?uid={uniqueid}`: An email address (plus\n   unique identifier) representing a service account that has been recently\n   deleted. For example,\n   `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`.\n   If the service account is undeleted, this value reverts to\n   `serviceAccount:{emailid}` and the undeleted service account retains the\n   role in the binding.\n\n* `deleted:group:{emailid}?uid={uniqueid}`: An email address (plus unique\n   identifier) representing a Google group that has been recently\n   deleted. For example, `admins@example.com?uid=123456789012345678901`. If\n   the group is recovered, this value reverts to `group:{emailid}` and the\n   recovered group retains the role in the binding.\n\n* `deleted:principal://iam.googleapis.com/locations/global/workforcePools/{pool_id}/subject/{subject_attribute_value}`:\n  Deleted single identity in a workforce identity pool. For example,\n  `deleted:principal://iam.googleapis.com/locations/global/workforcePools/my-pool-id/subject/my-subject-attribute-value`.",
                    },
                    condition: {
                      type: "object",
                      properties: {
                        title: {
                          type: "string",
                          description:
                            "Optional. Title for the expression, i.e. a short string describing\nits purpose. This can be used e.g. in UIs which allow to enter the\nexpression.",
                        },
                        expression: {
                          type: "string",
                          description:
                            "Textual representation of an expression in Common Expression Language\nsyntax.",
                        },
                        location: {
                          type: "string",
                          description:
                            "Optional. String indicating the location of the expression for error\nreporting, e.g. a file name and a position in the file.",
                        },
                        description: {
                          type: "string",
                          description:
                            "Optional. Description of the expression. This is a longer text which\ndescribes the expression, e.g. when hovered over it in a UI.",
                        },
                      },
                      description:
                        'Represents a textual expression in the Common Expression Language (CEL)\nsyntax. CEL is a C-like expression language. The syntax and semantics of CEL\nare documented at https://github.com/google/cel-spec.\n\nExample (Comparison):\n\n    title: "Summary size limit"\n    description: "Determines if a summary is less than 100 chars"\n    expression: "document.summary.size() < 100"\n\nExample (Equality):\n\n    title: "Requestor is owner"\n    description: "Determines if requestor is the document owner"\n    expression: "document.owner == request.auth.claims.email"\n\nExample (Logic):\n\n    title: "Public documents"\n    description: "Determine whether the document should be publicly visible"\n    expression: "document.type != \'private\' && document.type != \'internal\'"\n\nExample (Data Manipulation):\n\n    title: "Notification string"\n    description: "Create a notification string with a timestamp."\n    expression: "\'New message received at \' + string(document.create_time)"\n\nThe exact variables and functions that may be referenced within an expression\nare determined by the service that evaluates it. See the service\ndocumentation for additional information.',
                      additionalProperties: true,
                    },
                    role: {
                      type: "string",
                      description:
                        "Role that is assigned to the list of `members`, or principals.\nFor example, `roles/viewer`, `roles/editor`, or `roles/owner`.\n\nFor an overview of the IAM roles and permissions, see the\n[IAM documentation](https://cloud.google.com/iam/docs/roles-overview). For\na list of the available pre-defined roles, see\n[here](https://cloud.google.com/iam/docs/understanding-roles).",
                    },
                  },
                  description:
                    "Associates `members`, or principals, with a `role`.",
                  additionalProperties: true,
                },
                description:
                  "Associates a list of `members`, or principals, with a `role`. Optionally,\nmay specify a `condition` that determines how and when the `bindings` are\napplied. Each of the `bindings` must contain at least one principal.\n\nThe `bindings` in a `Policy` can refer to up to 1,500 principals; up to 250\nof these principals can be Google groups. Each occurrence of a principal\ncounts towards these limits. For example, if the `bindings` grant 50\ndifferent roles to `user:alice@example.com`, and not to any other\nprincipal, then you can add another 1,450 principals to the `bindings` in\nthe `Policy`.",
              },
            },
            description:
              'An Identity and Access Management (IAM) policy, which specifies access\ncontrols for Google Cloud resources.\n\n\nA `Policy` is a collection of `bindings`. A `binding` binds one or more\n`members`, or principals, to a single `role`. Principals can be user\naccounts, service accounts, Google groups, and domains (such as G Suite). A\n`role` is a named list of permissions; each `role` can be an IAM predefined\nrole or a user-created custom role.\n\nFor some types of Google Cloud resources, a `binding` can also specify a\n`condition`, which is a logical expression that allows access to a resource\nonly if the expression evaluates to `true`. A condition can add constraints\nbased on attributes of the request, the resource, or both. To learn which\nresources support conditions in their IAM policies, see the\n[IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).\n\n**JSON example:**\n\n```\n    {\n      "bindings": [\n        {\n          "role": "roles/resourcemanager.organizationAdmin",\n          "members": [\n            "user:mike@example.com",\n            "group:admins@example.com",\n            "domain:google.com",\n            "serviceAccount:my-project-id@appspot.gserviceaccount.com"\n          ]\n        },\n        {\n          "role": "roles/resourcemanager.organizationViewer",\n          "members": [\n            "user:eve@example.com"\n          ],\n          "condition": {\n            "title": "expirable access",\n            "description": "Does not grant access after Sep 2020",\n            "expression": "request.time < timestamp(\'2020-10-01T00:00:00.000Z\')",\n          }\n        }\n      ],\n      "etag": "BwWWja0YfJA=",\n      "version": 3\n    }\n```\n\n**YAML example:**\n\n```\n    bindings:\n    - members:\n      - user:mike@example.com\n      - group:admins@example.com\n      - domain:google.com\n      - serviceAccount:my-project-id@appspot.gserviceaccount.com\n      role: roles/resourcemanager.organizationAdmin\n    - members:\n      - user:eve@example.com\n      role: roles/resourcemanager.organizationViewer\n      condition:\n        title: expirable access\n        description: Does not grant access after Sep 2020\n        expression: request.time < timestamp(\'2020-10-01T00:00:00.000Z\')\n    etag: BwWWja0YfJA=\n    version: 3\n```\n\nFor a description of IAM and its features, see the\n[IAM documentation](https://cloud.google.com/iam/docs/).',
            additionalProperties: true,
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
        let path = `projects/{project}/regions/{region}/disks/{resource}/setIamPolicy`;

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

        if (input.event.inputConfig.policy !== undefined)
          requestBody.policy = input.event.inputConfig.policy;

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
          etag: {
            type: "string",
            description:
              "`etag` is used for optimistic concurrency control as a way to help\nprevent simultaneous updates of a policy from overwriting each other.\nIt is strongly suggested that systems make use of the `etag` in the\nread-modify-write cycle to perform policy updates in order to avoid race\nconditions: An `etag` is returned in the response to `getIamPolicy`, and\nsystems are expected to put that etag in the request to `setIamPolicy` to\nensure that their change will be applied to the same version of the policy.\n\n**Important:** If you use IAM Conditions, you must include the `etag` field\nwhenever you call `setIamPolicy`. If you omit this field, then IAM allows\nyou to overwrite a version `3` policy with a version `1` policy, and all of\nthe conditions in the version `3` policy are lost. (Format: byte)",
          },
          version: {
            type: "integer",
            description:
              "Specifies the format of the policy.\n\nValid values are `0`, `1`, and `3`. Requests that specify an invalid value\nare rejected.\n\nAny operation that affects conditional role bindings must specify version\n`3`. This requirement applies to the following operations:\n\n* Getting a policy that includes a conditional role binding\n* Adding a conditional role binding to a policy\n* Changing a conditional role binding in a policy\n* Removing any role binding, with or without a condition, from a policy\n  that includes conditions\n\n**Important:** If you use IAM Conditions, you must include the `etag` field\nwhenever you call `setIamPolicy`. If you omit this field, then IAM allows\nyou to overwrite a version `3` policy with a version `1` policy, and all of\nthe conditions in the version `3` policy are lost.\n\nIf a policy does not include any conditions, operations on that policy may\nspecify any valid version or leave the field unset.\n\nTo learn which resources support conditions in their IAM policies, see the\n[IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). (Format: int32)",
          },
          auditConfigs: {
            type: "array",
            items: {
              type: "object",
              properties: {
                auditLogConfigs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      logType: {
                        type: "string",
                        enum: [
                          "ADMIN_READ",
                          "DATA_READ",
                          "DATA_WRITE",
                          "LOG_TYPE_UNSPECIFIED",
                        ],
                        description: "The log type that this config enables.",
                      },
                      exemptedMembers: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                        description:
                          "Specifies the identities that do not cause logging for this type of\npermission.\nFollows the same format of Binding.members.",
                      },
                    },
                    description:
                      'Provides the configuration for logging a type of permissions.\nExample:\n\n    {\n      "audit_log_configs": [\n        {\n          "log_type": "DATA_READ",\n          "exempted_members": [\n            "user:jose@example.com"\n          ]\n        },\n        {\n          "log_type": "DATA_WRITE"\n        }\n      ]\n    }\n\nThis enables \'DATA_READ\' and \'DATA_WRITE\' logging, while exempting\njose@example.com from DATA_READ logging.',
                    additionalProperties: true,
                  },
                  description:
                    "The configuration for logging of each type of permission.",
                },
                service: {
                  type: "string",
                  description:
                    "Specifies a service that will be enabled for audit logging.\nFor example, `storage.googleapis.com`, `cloudsql.googleapis.com`.\n`allServices` is a special value that covers all services.",
                },
              },
              description:
                'Specifies the audit configuration for a service.\nThe configuration determines which permission types are logged, and what\nidentities, if any, are exempted from logging.\nAn AuditConfig must have one or more AuditLogConfigs.\n\nIf there are AuditConfigs for both `allServices` and a specific service,\nthe union of the two AuditConfigs is used for that service: the log_types\nspecified in each AuditConfig are enabled, and the exempted_members in each\nAuditLogConfig are exempted.\n\nExample Policy with multiple AuditConfigs:\n\n    {\n      "audit_configs": [\n        {\n          "service": "allServices",\n          "audit_log_configs": [\n            {\n              "log_type": "DATA_READ",\n              "exempted_members": [\n                "user:jose@example.com"\n              ]\n            },\n            {\n              "log_type": "DATA_WRITE"\n            },\n            {\n              "log_type": "ADMIN_READ"\n            }\n          ]\n        },\n        {\n          "service": "sampleservice.googleapis.com",\n          "audit_log_configs": [\n            {\n              "log_type": "DATA_READ"\n            },\n            {\n              "log_type": "DATA_WRITE",\n              "exempted_members": [\n                "user:aliya@example.com"\n              ]\n            }\n          ]\n        }\n      ]\n    }\n\nFor sampleservice, this policy enables DATA_READ, DATA_WRITE and ADMIN_READ\nlogging. It also exempts `jose@example.com` from DATA_READ logging, and\n`aliya@example.com` from DATA_WRITE logging.',
              additionalProperties: true,
            },
            description:
              "Specifies cloud audit logging configuration for this policy.",
          },
          bindings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                members: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description:
                    "Specifies the principals requesting access for a Google Cloud resource.\n`members` can have the following values:\n\n* `allUsers`: A special identifier that represents anyone who is\n   on the internet; with or without a Google account.\n\n* `allAuthenticatedUsers`: A special identifier that represents anyone\n   who is authenticated with a Google account or a service account.\n   Does not include identities that come from external identity providers\n   (IdPs) through identity federation.\n\n* `user:{emailid}`: An email address that represents a specific Google\n   account. For example, `alice@example.com` .\n\n\n* `serviceAccount:{emailid}`: An email address that represents a Google\n   service account. For example,\n   `my-other-app@appspot.gserviceaccount.com`.\n\n* `serviceAccount:{projectid}.svc.id.goog[{namespace}/{kubernetes-sa}]`: An\n   identifier for a\n   [Kubernetes service\n   account](https://cloud.google.com/kubernetes-engine/docs/how-to/kubernetes-service-accounts).\n   For example, `my-project.svc.id.goog[my-namespace/my-kubernetes-sa]`.\n\n* `group:{emailid}`: An email address that represents a Google group.\n   For example, `admins@example.com`.\n\n\n* `domain:{domain}`: The G Suite domain (primary) that represents all the\n   users of that domain. For example, `google.com` or `example.com`.\n\n\n\n\n* `principal://iam.googleapis.com/locations/global/workforcePools/{pool_id}/subject/{subject_attribute_value}`:\n  A single identity in a workforce identity pool.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/group/{group_id}`:\n  All workforce identities in a group.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/attribute.{attribute_name}/{attribute_value}`:\n  All workforce identities with a specific attribute value.\n\n* `principalSet://iam.googleapis.com/locations/global/workforcePools/{pool_id}/*`:\n  All identities in a workforce identity pool.\n\n* `principal://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/subject/{subject_attribute_value}`:\n  A single identity in a workload identity pool.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/group/{group_id}`:\n  A workload identity pool group.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/attribute.{attribute_name}/{attribute_value}`:\n  All identities in a workload identity pool with a certain attribute.\n\n* `principalSet://iam.googleapis.com/projects/{project_number}/locations/global/workloadIdentityPools/{pool_id}/*`:\n  All identities in a workload identity pool.\n\n* `deleted:user:{emailid}?uid={uniqueid}`: An email address (plus unique\n   identifier) representing a user that has been recently deleted. For\n   example, `alice@example.com?uid=123456789012345678901`. If the user is\n   recovered, this value reverts to `user:{emailid}` and the recovered user\n   retains the role in the binding.\n\n* `deleted:serviceAccount:{emailid}?uid={uniqueid}`: An email address (plus\n   unique identifier) representing a service account that has been recently\n   deleted. For example,\n   `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`.\n   If the service account is undeleted, this value reverts to\n   `serviceAccount:{emailid}` and the undeleted service account retains the\n   role in the binding.\n\n* `deleted:group:{emailid}?uid={uniqueid}`: An email address (plus unique\n   identifier) representing a Google group that has been recently\n   deleted. For example, `admins@example.com?uid=123456789012345678901`. If\n   the group is recovered, this value reverts to `group:{emailid}` and the\n   recovered group retains the role in the binding.\n\n* `deleted:principal://iam.googleapis.com/locations/global/workforcePools/{pool_id}/subject/{subject_attribute_value}`:\n  Deleted single identity in a workforce identity pool. For example,\n  `deleted:principal://iam.googleapis.com/locations/global/workforcePools/my-pool-id/subject/my-subject-attribute-value`.",
                },
                condition: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description:
                        "Optional. Title for the expression, i.e. a short string describing\nits purpose. This can be used e.g. in UIs which allow to enter the\nexpression.",
                    },
                    expression: {
                      type: "string",
                      description:
                        "Textual representation of an expression in Common Expression Language\nsyntax.",
                    },
                    location: {
                      type: "string",
                      description:
                        "Optional. String indicating the location of the expression for error\nreporting, e.g. a file name and a position in the file.",
                    },
                    description: {
                      type: "string",
                      description:
                        "Optional. Description of the expression. This is a longer text which\ndescribes the expression, e.g. when hovered over it in a UI.",
                    },
                  },
                  description:
                    'Represents a textual expression in the Common Expression Language (CEL)\nsyntax. CEL is a C-like expression language. The syntax and semantics of CEL\nare documented at https://github.com/google/cel-spec.\n\nExample (Comparison):\n\n    title: "Summary size limit"\n    description: "Determines if a summary is less than 100 chars"\n    expression: "document.summary.size() < 100"\n\nExample (Equality):\n\n    title: "Requestor is owner"\n    description: "Determines if requestor is the document owner"\n    expression: "document.owner == request.auth.claims.email"\n\nExample (Logic):\n\n    title: "Public documents"\n    description: "Determine whether the document should be publicly visible"\n    expression: "document.type != \'private\' && document.type != \'internal\'"\n\nExample (Data Manipulation):\n\n    title: "Notification string"\n    description: "Create a notification string with a timestamp."\n    expression: "\'New message received at \' + string(document.create_time)"\n\nThe exact variables and functions that may be referenced within an expression\nare determined by the service that evaluates it. See the service\ndocumentation for additional information.',
                  additionalProperties: true,
                },
                role: {
                  type: "string",
                  description:
                    "Role that is assigned to the list of `members`, or principals.\nFor example, `roles/viewer`, `roles/editor`, or `roles/owner`.\n\nFor an overview of the IAM roles and permissions, see the\n[IAM documentation](https://cloud.google.com/iam/docs/roles-overview). For\na list of the available pre-defined roles, see\n[here](https://cloud.google.com/iam/docs/understanding-roles).",
                },
              },
              description:
                "Associates `members`, or principals, with a `role`.",
              additionalProperties: true,
            },
            description:
              "Associates a list of `members`, or principals, with a `role`. Optionally,\nmay specify a `condition` that determines how and when the `bindings` are\napplied. Each of the `bindings` must contain at least one principal.\n\nThe `bindings` in a `Policy` can refer to up to 1,500 principals; up to 250\nof these principals can be Google groups. Each occurrence of a principal\ncounts towards these limits. For example, if the `bindings` grant 50\ndifferent roles to `user:alice@example.com`, and not to any other\nprincipal, then you can add another 1,450 principals to the `bindings` in\nthe `Policy`.",
          },
        },
        description:
          'An Identity and Access Management (IAM) policy, which specifies access\ncontrols for Google Cloud resources.\n\n\nA `Policy` is a collection of `bindings`. A `binding` binds one or more\n`members`, or principals, to a single `role`. Principals can be user\naccounts, service accounts, Google groups, and domains (such as G Suite). A\n`role` is a named list of permissions; each `role` can be an IAM predefined\nrole or a user-created custom role.\n\nFor some types of Google Cloud resources, a `binding` can also specify a\n`condition`, which is a logical expression that allows access to a resource\nonly if the expression evaluates to `true`. A condition can add constraints\nbased on attributes of the request, the resource, or both. To learn which\nresources support conditions in their IAM policies, see the\n[IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).\n\n**JSON example:**\n\n```\n    {\n      "bindings": [\n        {\n          "role": "roles/resourcemanager.organizationAdmin",\n          "members": [\n            "user:mike@example.com",\n            "group:admins@example.com",\n            "domain:google.com",\n            "serviceAccount:my-project-id@appspot.gserviceaccount.com"\n          ]\n        },\n        {\n          "role": "roles/resourcemanager.organizationViewer",\n          "members": [\n            "user:eve@example.com"\n          ],\n          "condition": {\n            "title": "expirable access",\n            "description": "Does not grant access after Sep 2020",\n            "expression": "request.time < timestamp(\'2020-10-01T00:00:00.000Z\')",\n          }\n        }\n      ],\n      "etag": "BwWWja0YfJA=",\n      "version": 3\n    }\n```\n\n**YAML example:**\n\n```\n    bindings:\n    - members:\n      - user:mike@example.com\n      - group:admins@example.com\n      - domain:google.com\n      - serviceAccount:my-project-id@appspot.gserviceaccount.com\n      role: roles/resourcemanager.organizationAdmin\n    - members:\n      - user:eve@example.com\n      role: roles/resourcemanager.organizationViewer\n      condition:\n        title: expirable access\n        description: Does not grant access after Sep 2020\n        expression: request.time < timestamp(\'2020-10-01T00:00:00.000Z\')\n    etag: BwWWja0YfJA=\n    version: 3\n```\n\nFor a description of IAM and its features, see the\n[IAM documentation](https://cloud.google.com/iam/docs/).',
        additionalProperties: true,
      },
    },
  },
};

export default regionDisksSetIamPolicy;
