import { AppBlock, events } from "@slflows/sdk/v1";
import { getIAMClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  fullResourceName: "full_resource_name",
};

const outputMapping = {
  lint_results: {
    name: "lintResults",
    fields: {
      validation_unit_name: "validationUnitName",
      field_name: "fieldName",
      location_offset: "locationOffset",
      debug_message: "debugMessage",
    },
  },
};

const lintPolicy: AppBlock = {
  name: "Lint Policy",
  description: `Lints, or validates, an IAM policy. Currently checks the [google.iam.v1.Binding.condition][google.iam.v1.Binding.condition] field, which contains a condition expression for a role binding. Successful calls to this method always return an HTTP '200 OK' status code, even if the linter detects an issue in the IAM policy.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        fullResourceName: {
          name: "Full Resource Name",
          description:
            "The full resource name of the policy this lint request is about.  The name follows the Google Cloud Platform (GCP) resource format. For example, a GCP project with ID `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.  The resource name is not used to read the policy instance from the Cloud IAM database. The candidate policy for lint has to be provided in the same request object.",
          type: {
            type: "string",
            description:
              "The full resource name of the policy this lint request is about.  The name follows the Google Cloud Platform (GCP) resource format. For example, a GCP project with ID `my-project` will be named `//cloudresourcemanager.googleapis.com/projects/my-project`.  The resource name is not used to read the policy instance from the Cloud IAM database. The candidate policy for lint has to be provided in the same request object.",
          },
          required: false,
        },
        condition: {
          name: "Condition",
          description:
            "[google.iam.v1.Binding.condition] [google.iam.v1.Binding.condition] object to be linted.",
          type: {
            type: "object",
            properties: {
              expression: {
                type: "string",
              },
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
              location: {
                type: "string",
              },
            },
            additionalProperties: true,
            description:
              "[google.iam.v1.Binding.condition] [google.iam.v1.Binding.condition] object to be linted.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getIAMClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.lintPolicy(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          lintResults: {
            type: "array",
            items: {
              type: "object",
              properties: {
                level: {
                  type: "string",
                  enum: ["LEVEL_UNSPECIFIED", "CONDITION"],
                  description: "The validation unit level.",
                },
                validationUnitName: {
                  type: "string",
                  description:
                    'The validation unit name, for instance "lintValidationUnits/ConditionComplexityCheck".',
                },
                severity: {
                  type: "string",
                  enum: [
                    "SEVERITY_UNSPECIFIED",
                    "ERROR",
                    "WARNING",
                    "NOTICE",
                    "INFO",
                    "DEPRECATED",
                  ],
                  description: "The validation unit severity.",
                },
                fieldName: {
                  type: "string",
                  description:
                    "The name of the field for which this lint result is about.  For nested messages `field_name` consists of names of the embedded fields separated by period character. The top-level qualifier is the input object to lint in the request. For example, the `field_name` value `condition.expression` identifies a lint result for the `expression` field of the provided condition.",
                },
                locationOffset: {
                  type: "integer",
                  description:
                    "0-based character position of problematic construct within the object identified by `field_name`. Currently, this is populated only for condition expression.",
                },
                debugMessage: {
                  type: "string",
                  description:
                    "Human readable debug message associated with the issue.",
                },
              },
              description: "Structured response of a single validation unit.",
              additionalProperties: true,
            },
            description:
              "List of lint results sorted by `severity` in descending order.",
          },
        },
        description:
          "The response of a lint operation. An empty response indicates the operation was able to fully execute and no lint issue was found.",
        additionalProperties: true,
      },
    },
  },
};

export default lintPolicy;
