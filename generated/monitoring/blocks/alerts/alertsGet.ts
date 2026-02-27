import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const alertsGet: AppBlock = {
  name: "Alerts - Get",
  description: `Gets a single alert.`,
  category: "Alerts",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The name of the alert.The format is: projects/[PROJECT_ID_OR_NUMBER]/alerts/[ALERT_ID] The [ALERT_ID] is a system-assigned unique identifier for the alert.",
          type: {
            type: "string",
          },
          required: true,
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
        let path = `v3/{+name}`;

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
          name: {
            type: "string",
            description:
              "Identifier. The name of the alert.The format is: projects/[PROJECT_ID_OR_NUMBER]/alerts/[ALERT_ID] The [ALERT_ID] is a system-assigned unique identifier for the alert.",
          },
          state: {
            type: "string",
            enum: ["STATE_UNSPECIFIED", "OPEN", "CLOSED"],
            description: "Output only. The current state of the alert.",
          },
          openTime: {
            type: "string",
            description:
              "The time when the alert was opened. (Format: google-datetime)",
          },
          closeTime: {
            type: "string",
            description:
              "The time when the alert was closed. (Format: google-datetime)",
          },
          resource: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description:
                  "Required. The monitored resource type. This field must match the type field of a MonitoredResourceDescriptor object. For example, the type of a Compute Engine VM instance is gce_instance. For a list of types, see Monitoring resource types (https://cloud.google.com/monitoring/api/resources) and Logging resource types (https://cloud.google.com/logging/docs/api/v2/resource-list).",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  'Required. Values for all of the labels listed in the associated monitored resource descriptor. For example, Compute Engine VM instances use the labels "project_id", "instance_id", and "zone".',
              },
            },
            description:
              'An object representing a resource that can be used for monitoring, logging, billing, or other purposes. Examples include virtual machine instances, databases, and storage devices such as disks. The type field identifies a MonitoredResourceDescriptor object that describes the resource\'s schema. Information in the labels field identifies the actual resource and its attributes according to the schema. For example, a particular Compute Engine VM instance could be represented by the following object, because the MonitoredResourceDescriptor for "gce_instance" has labels "project_id", "instance_id" and "zone": { "type": "gce_instance", "labels": { "project_id": "my-project", "instance_id": "12345678901234", "zone": "us-central1-a" }}',
            additionalProperties: true,
          },
          metadata: {
            type: "object",
            properties: {
              systemLabels: {
                type: "object",
                additionalProperties: true,
                description:
                  'Output only. Values for predefined system metadata labels. System labels are a kind of metadata extracted by Google, including "machine_image", "vpc", "subnet_id", "security_group", "name", etc. System label values can be only strings, Boolean values, or a list of strings. For example: { "name": "my-test-instance", "security_group": ["a", "b", "c"], "spot_instance": false }',
              },
              userLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Output only. A map of user-defined metadata labels.",
              },
            },
            description:
              "Auxiliary metadata for a MonitoredResource object. MonitoredResource objects contain the minimum set of information to uniquely identify a monitored resource instance. There is some other useful auxiliary metadata. Monitoring and Logging use an ingestion pipeline to extract metadata for cloud resources of all types, and store the metadata in this message.",
            additionalProperties: true,
          },
          metric: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description:
                  "An existing metric type, see google.api.MetricDescriptor. For example, custom.googleapis.com/invoice/paid/amount.",
              },
              labels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "The set of label values that uniquely identify this metric. All labels listed in the MetricDescriptor must be assigned values.",
              },
            },
            description:
              "A specific metric, identified by specifying values for all of the labels of a MetricDescriptor.",
            additionalProperties: true,
          },
          log: {
            type: "object",
            properties: {
              extractedLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "The labels extracted from the log.",
              },
            },
            description: "Information about the log for log-based alerts.",
            additionalProperties: true,
          },
          policy: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  'The name of the alert policy resource. In the form of "projects/PROJECT_ID_OR_NUMBER/alertPolicies/ALERT_POLICY_ID".',
              },
              displayName: {
                type: "string",
                description: "The display name of the alert policy.",
              },
              severity: {
                type: "string",
                enum: ["SEVERITY_UNSPECIFIED", "CRITICAL", "ERROR", "WARNING"],
                description: "The severity of the alert policy.",
              },
              userLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description: "The user labels for the alert policy.",
              },
            },
            description:
              "The state of the policy at the time the alert was generated.",
            additionalProperties: true,
          },
        },
        description:
          "An alert is the representation of a violation of an alert policy. It is a read-only resource that cannot be modified by the accompanied API.",
        additionalProperties: true,
      },
    },
  },
};

export default alertsGet;
