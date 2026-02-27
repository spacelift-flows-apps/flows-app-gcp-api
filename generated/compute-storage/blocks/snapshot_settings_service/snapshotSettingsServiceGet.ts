import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const snapshotSettingsServiceGet: AppBlock = {
  name: "Snapshot Settings Service - Get",
  description: `Returns the specified Zone resource.`,
  category: "Snapshot Settings Service",
  inputs: {
    default: {
      config: {},
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/global/snapshotSettings",
          pathParams,
        });

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
          storageLocation: {
            type: "object",
            properties: {
              locations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "When the policy is SPECIFIC_LOCATIONS, snapshots will be stored in the locations listed in this field. Keys are Cloud Storage bucket locations. Only one location can be specified.",
              },
              policy: {
                type: "string",
                enum: [
                  "UNDEFINED_POLICY",
                  "LOCAL_REGION",
                  "NEAREST_MULTI_REGION",
                  "SPECIFIC_LOCATIONS",
                  "STORAGE_LOCATION_POLICY_UNSPECIFIED",
                ],
                description:
                  'An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources.   A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role.  For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).  **JSON example:**  ```     {       "bindings": [         {           "role": "roles/resourcemanager.organizationAdmin",           "members": [             "user:mike@example.com",             "group:admins@example.com",             "domain:google.com",             "serviceAccount:my-project-id@appspot.gserviceaccount.com"           ]         },         {           "role": "roles/resourcemanager.organizationViewer",           "members": [             "user:eve@example.com"           ],           "condition": {             "title": "expirable access",             "description": "Does not grant access after Sep 2020",             "expression": "request.time < timestamp(\'2020-10-01T00:00:00.000Z\')",           }         }       ],       "etag": "BwWWja0YfJA=",       "version": 3     } ```  **YAML example:**  ```     bindings:     - members:       - user:mike@example.com       - group:admins@example.com       - domain:google.com       - serviceAccount:my-project-id@appspot.gserviceaccount.com       role: roles/resourcemanager.organizationAdmin     - members:       - user:eve@example.com       role: roles/resourcemanager.organizationViewer       condition:         title: expirable access         description: Does not grant access after Sep 2020         expression: request.time < timestamp(\'2020-10-01T00:00:00.000Z\')     etag: BwWWja0YfJA=     version: 3 ```  For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).',
              },
            },
            additionalProperties: true,
            description:
              "Policy of which storage location is going to be resolved, and additional data that particularizes how the policy is going to be carried out.",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default snapshotSettingsServiceGet;
