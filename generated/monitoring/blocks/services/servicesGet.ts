import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const servicesGet: AppBlock = {
  name: "Services - Get",
  description: `Get the named Service.`,
  category: "Services",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. Resource name of the Service. The format is: projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID] ",
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
          name: {
            type: "string",
            description:
              "Identifier. Resource name for this Service. The format is: projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
          },
          displayName: {
            type: "string",
            description: "Name used for UI elements listing this Service.",
          },
          custom: {
            type: "object",
            properties: {},
            description:
              "Use a custom service to designate a service that you want to monitor when none of the other service types (like App Engine, Cloud Run, or a GKE type) matches your intended service.",
            additionalProperties: true,
          },
          appEngine: {
            type: "object",
            properties: {
              moduleId: {
                type: "string",
                description:
                  "The ID of the App Engine module underlying this service. Corresponds to the module_id resource label in the gae_app monitored resource (https://cloud.google.com/monitoring/api/resources#tag_gae_app).",
              },
            },
            description:
              "App Engine service. Learn more at https://cloud.google.com/appengine.",
            additionalProperties: true,
          },
          cloudEndpoints: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  "The name of the Cloud Endpoints service underlying this service. Corresponds to the service resource label in the api monitored resource (https://cloud.google.com/monitoring/api/resources#tag_api).",
              },
            },
            description:
              "Cloud Endpoints service. Learn more at https://cloud.google.com/endpoints.",
            additionalProperties: true,
          },
          clusterIstio: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description:
                  "The location of the Kubernetes cluster in which this Istio service is defined. Corresponds to the location resource label in k8s_cluster resources.",
              },
              clusterName: {
                type: "string",
                description:
                  "The name of the Kubernetes cluster in which this Istio service is defined. Corresponds to the cluster_name resource label in k8s_cluster resources.",
              },
              serviceNamespace: {
                type: "string",
                description:
                  "The namespace of the Istio service underlying this service. Corresponds to the destination_service_namespace metric label in Istio metrics.",
              },
              serviceName: {
                type: "string",
                description:
                  "The name of the Istio service underlying this service. Corresponds to the destination_service_name metric label in Istio metrics.",
              },
            },
            description:
              "Istio service scoped to a single Kubernetes cluster. Learn more at https://istio.io. Clusters running OSS Istio will have their services ingested as this type.",
            additionalProperties: true,
          },
          meshIstio: {
            type: "object",
            properties: {
              meshUid: {
                type: "string",
                description:
                  "Identifier for the mesh in which this Istio service is defined. Corresponds to the mesh_uid metric label in Istio metrics.",
              },
              serviceNamespace: {
                type: "string",
                description:
                  "The namespace of the Istio service underlying this service. Corresponds to the destination_service_namespace metric label in Istio metrics.",
              },
              serviceName: {
                type: "string",
                description:
                  "The name of the Istio service underlying this service. Corresponds to the destination_service_name metric label in Istio metrics.",
              },
            },
            description:
              "Istio service scoped to an Istio mesh. Anthos clusters running ASM < 1.6.8 will have their services ingested as this type.",
            additionalProperties: true,
          },
          istioCanonicalService: {
            type: "object",
            properties: {
              meshUid: {
                type: "string",
                description:
                  "Identifier for the Istio mesh in which this canonical service is defined. Corresponds to the mesh_uid metric label in Istio metrics (https://cloud.google.com/monitoring/api/metrics_istio).",
              },
              canonicalServiceNamespace: {
                type: "string",
                description:
                  "The namespace of the canonical service underlying this service. Corresponds to the destination_canonical_service_namespace metric label in Istio metrics (https://cloud.google.com/monitoring/api/metrics_istio).",
              },
              canonicalService: {
                type: "string",
                description:
                  "The name of the canonical service underlying this service. Corresponds to the destination_canonical_service_name metric label in label in Istio metrics (https://cloud.google.com/monitoring/api/metrics_istio).",
              },
            },
            description:
              "Canonical service scoped to an Istio mesh. Anthos clusters running ASM >= 1.6.8 will have their services ingested as this type.",
            additionalProperties: true,
          },
          cloudRun: {
            type: "object",
            properties: {
              serviceName: {
                type: "string",
                description:
                  "The name of the Cloud Run service. Corresponds to the service_name resource label in the cloud_run_revision monitored resource (https://cloud.google.com/monitoring/api/resources#tag_cloud_run_revision).",
              },
              location: {
                type: "string",
                description:
                  "The location the service is run. Corresponds to the location resource label in the cloud_run_revision monitored resource (https://cloud.google.com/monitoring/api/resources#tag_cloud_run_revision).",
              },
            },
            description:
              "Cloud Run service. Learn more at https://cloud.google.com/run.",
            additionalProperties: true,
          },
          gkeNamespace: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description:
                  "Output only. The project this resource lives in. For legacy services migrated from the Custom type, this may be a distinct project from the one parenting the service itself.",
              },
              location: {
                type: "string",
                description:
                  "The location of the parent cluster. This may be a zone or region.",
              },
              clusterName: {
                type: "string",
                description: "The name of the parent cluster.",
              },
              namespaceName: {
                type: "string",
                description: "The name of this namespace.",
              },
            },
            description:
              "GKE Namespace. The field names correspond to the resource metadata labels on monitored resources that fall under a namespace (for example, k8s_container or k8s_pod).",
            additionalProperties: true,
          },
          gkeWorkload: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description:
                  "Output only. The project this resource lives in. For legacy services migrated from the Custom type, this may be a distinct project from the one parenting the service itself.",
              },
              location: {
                type: "string",
                description:
                  "The location of the parent cluster. This may be a zone or region.",
              },
              clusterName: {
                type: "string",
                description: "The name of the parent cluster.",
              },
              namespaceName: {
                type: "string",
                description: "The name of the parent namespace.",
              },
              topLevelControllerType: {
                type: "string",
                description:
                  'The type of this workload (for example, "Deployment" or "DaemonSet")',
              },
              topLevelControllerName: {
                type: "string",
                description: "The name of this workload.",
              },
            },
            description:
              "A GKE Workload (Deployment, StatefulSet, etc). The field names correspond to the metadata labels on monitored resources that fall under a workload (for example, k8s_container or k8s_pod).",
            additionalProperties: true,
          },
          gkeService: {
            type: "object",
            properties: {
              projectId: {
                type: "string",
                description:
                  "Output only. The project this resource lives in. For legacy services migrated from the Custom type, this may be a distinct project from the one parenting the service itself.",
              },
              location: {
                type: "string",
                description:
                  "The location of the parent cluster. This may be a zone or region.",
              },
              clusterName: {
                type: "string",
                description: "The name of the parent cluster.",
              },
              namespaceName: {
                type: "string",
                description: "The name of the parent namespace.",
              },
              serviceName: {
                type: "string",
                description: "The name of this service.",
              },
            },
            description:
              'GKE Service. The "service" here represents a Kubernetes service object (https://kubernetes.io/docs/concepts/services-networking/service). The field names correspond to the resource labels on k8s_service monitored resources (https://cloud.google.com/monitoring/api/resources#tag_k8s_service).',
            additionalProperties: true,
          },
          basicService: {
            type: "object",
            properties: {
              serviceType: {
                type: "string",
                description:
                  "The type of service that this basic service defines, e.g. APP_ENGINE service type. Documentation and valid values here (https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
              },
              serviceLabels: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Labels that specify the resource that emits the monitoring data which is used for SLO reporting of this Service. Documentation and valid values for given service types here (https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
              },
            },
            description:
              "A well-known service type, defined by its service type and service labels. Documentation and examples here (https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
            additionalProperties: true,
          },
          telemetry: {
            type: "object",
            properties: {
              resourceName: {
                type: "string",
                description:
                  "The full name of the resource that defines this service. Formatted as described in https://cloud.google.com/apis/design/resource_names.",
              },
            },
            description:
              "Configuration for how to query telemetry on a Service.",
            additionalProperties: true,
          },
          userLabels: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Labels which have been used to annotate the service. Label keys must start with a letter. Label keys and values may contain lowercase letters, numbers, underscores, and dashes. Label keys and values have a maximum length of 63 characters, and must be less than 128 bytes in size. Up to 64 label entries may be stored. For labels which do not have a semantic value, the empty string may be supplied for the label value.",
          },
        },
        description:
          "A Service is a discrete, autonomous, and network-accessible unit, designed to solve an individual concern (Wikipedia (https://en.wikipedia.org/wiki/Service-orientation)). In Cloud Monitoring, a Service acts as the root resource under which operational aspects of the service are accessible.",
        additionalProperties: true,
      },
    },
  },
};

export default servicesGet;
