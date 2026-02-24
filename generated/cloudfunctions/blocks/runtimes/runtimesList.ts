import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const runtimesList: AppBlock = {
  name: "Runtimes - List",
  description: `Returns a list of runtimes that are supported for the requested project.`,
  category: "Runtimes",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project and location from which the runtimes should be listed, specified in the format `projects/*/locations/*`",
          type: {
            type: "string",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            "The filter for Runtimes that match the filter expression, following the syntax outlined in https://google.aip.dev/160.",
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
        let path = `v2/{+parent}/runtimes`;

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
          runtimes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The name of the runtime, e.g., 'go113', 'nodejs12', etc.",
                },
                displayName: {
                  type: "string",
                  description:
                    "The user facing name, eg 'Go 1.13', 'Node.js 12', etc.",
                },
                stage: {
                  type: "string",
                  enum: [
                    "RUNTIME_STAGE_UNSPECIFIED",
                    "DEVELOPMENT",
                    "ALPHA",
                    "BETA",
                    "GA",
                    "DEPRECATED",
                    "DECOMMISSIONED",
                  ],
                  description:
                    "The stage of life this runtime is in, e.g., BETA, GA, etc.",
                },
                warnings: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Warning messages, e.g., a deprecation warning.",
                },
                environment: {
                  type: "string",
                  enum: ["ENVIRONMENT_UNSPECIFIED", "GEN_1", "GEN_2"],
                  description: "The environment for the runtime.",
                },
                deprecationDate: {
                  type: "object",
                  properties: {
                    year: {
                      type: "integer",
                      description:
                        "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year. (Format: int32)",
                    },
                    month: {
                      type: "integer",
                      description:
                        "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day. (Format: int32)",
                    },
                    day: {
                      type: "integer",
                      description:
                        "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant. (Format: int32)",
                    },
                  },
                  description:
                    "Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp",
                  additionalProperties: true,
                },
                decommissionDate: {
                  type: "object",
                  properties: {
                    year: {
                      type: "integer",
                      description:
                        "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year. (Format: int32)",
                    },
                    month: {
                      type: "integer",
                      description:
                        "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day. (Format: int32)",
                    },
                    day: {
                      type: "integer",
                      description:
                        "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant. (Format: int32)",
                    },
                  },
                  description:
                    "Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp",
                  additionalProperties: true,
                },
              },
              description:
                "Describes a runtime and any special information (e.g., deprecation status) related to it.",
              additionalProperties: true,
            },
            description: "The runtimes that match the request.",
          },
        },
        description: "Response for the `ListRuntimes` method.",
        additionalProperties: true,
      },
    },
  },
};

export default runtimesList;
