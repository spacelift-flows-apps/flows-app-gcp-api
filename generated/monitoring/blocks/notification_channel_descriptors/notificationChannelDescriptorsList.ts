import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const notificationChannelDescriptorsList: AppBlock = {
  name: "Notification Channel Descriptors - List",
  description: `Lists the descriptors for supported channel types.`,
  category: "Notification Channel Descriptors",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The REST resource name of the parent from which to retrieve the notification channel descriptors. The expected syntax is: projects/[PROJECT_ID_OR_NUMBER] Note that this names (https://cloud.google.com/monitoring/api/v3#project_name) the parent container in which to look for the descriptors; to retrieve a single descriptor by name, use the GetNotificationChannelDescriptor operation, instead.",
          type: {
            type: "string",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of results to return in a single response. If not set to a positive number, a reasonable value will be chosen by the service.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If non-empty, page_token must contain a value returned as the next_page_token in a previous response to request the next set of results.",
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
              "https://www.googleapis.com/auth/monitoring",
              "https://www.googleapis.com/auth/monitoring.read",
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
        const baseUrl = "https://monitoring.googleapis.com/";
        let path = `v3/{+name}/notificationChannelDescriptors`;

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
          channelDescriptors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "The full REST resource name for this descriptor. The format is: projects/[PROJECT_ID_OR_NUMBER]/notificationChannelDescriptors/[TYPE] In the above, [TYPE] is the value of the type field.",
                },
                type: {
                  type: "string",
                  description:
                    'The type of notification channel, such as "email" and "sms". To view the full list of channels, see Channel descriptors (https://cloud.google.com/monitoring/alerts/using-channels-api#ncd). Notification channel types are globally unique.',
                },
                displayName: {
                  type: "string",
                  description:
                    "A human-readable name for the notification channel type. This form of the name is suitable for a user interface.",
                },
                description: {
                  type: "string",
                  description:
                    "A human-readable description of the notification channel type. The description may include a description of the properties of the channel and pointers to external documentation.",
                },
                labels: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      key: {
                        type: "string",
                        description:
                          "The key for this label. The key must meet the following criteria: Does not exceed 100 characters. Matches the following regular expression: [a-zA-Z][a-zA-Z0-9_]* The first character must be an upper- or lower-case letter. The remaining characters must be letters, digits, or underscores.",
                      },
                      valueType: {
                        type: "string",
                        enum: ["STRING", "BOOL", "INT64"],
                        description:
                          "The type of data that can be assigned to the label.",
                      },
                      description: {
                        type: "string",
                        description:
                          "A human-readable description for the label.",
                      },
                    },
                    description: "A description of a label.",
                    additionalProperties: true,
                  },
                  description:
                    "The set of labels that must be defined to identify a particular channel of the corresponding type. Each label includes a description for how that field should be populated.",
                },
                supportedTiers: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: [
                      "SERVICE_TIER_UNSPECIFIED",
                      "SERVICE_TIER_BASIC",
                      "SERVICE_TIER_PREMIUM",
                    ],
                  },
                  description:
                    "The tiers that support this notification channel; the project service tier must be one of the supported_tiers.",
                },
                launchStage: {
                  type: "string",
                  enum: [
                    "LAUNCH_STAGE_UNSPECIFIED",
                    "UNIMPLEMENTED",
                    "PRELAUNCH",
                    "EARLY_ACCESS",
                    "ALPHA",
                    "BETA",
                    "GA",
                    "DEPRECATED",
                  ],
                  description:
                    "The product launch stage for channels of this type.",
                },
              },
              description:
                "A description of a notification channel. The descriptor includes the properties of the channel and the set of labels or fields that must be specified to configure channels of a given type.",
              additionalProperties: true,
            },
            description:
              "The monitored resource descriptors supported for the specified project, optionally filtered.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If not empty, indicates that there may be more results that match the request. Use the value in the page_token field in a subsequent request to fetch the next set of results. If empty, all results have been returned.",
          },
        },
        description: "The ListNotificationChannelDescriptors response.",
        additionalProperties: true,
      },
    },
  },
};

export default notificationChannelDescriptorsList;
