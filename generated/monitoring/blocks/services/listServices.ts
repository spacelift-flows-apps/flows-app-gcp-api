import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getServiceMonitoringServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  services: {
    name: "services",
    fields: {
      display_name: "displayName",
      app_engine: {
        name: "appEngine",
        fields: {
          module_id: "moduleId",
        },
      },
      cloud_endpoints: "cloudEndpoints",
      cluster_istio: {
        name: "clusterIstio",
        fields: {
          cluster_name: "clusterName",
          service_namespace: "serviceNamespace",
          service_name: "serviceName",
        },
      },
      mesh_istio: {
        name: "meshIstio",
        fields: {
          mesh_uid: "meshUid",
          service_namespace: "serviceNamespace",
          service_name: "serviceName",
        },
      },
      istio_canonical_service: {
        name: "istioCanonicalService",
        fields: {
          mesh_uid: "meshUid",
          canonical_service_namespace: "canonicalServiceNamespace",
          canonical_service: "canonicalService",
        },
      },
      cloud_run: {
        name: "cloudRun",
        fields: {
          service_name: "serviceName",
        },
      },
      gke_namespace: {
        name: "gkeNamespace",
        fields: {
          project_id: "projectId",
          cluster_name: "clusterName",
          namespace_name: "namespaceName",
        },
      },
      gke_workload: {
        name: "gkeWorkload",
        fields: {
          project_id: "projectId",
          cluster_name: "clusterName",
          namespace_name: "namespaceName",
          top_level_controller_type: "topLevelControllerType",
          top_level_controller_name: "topLevelControllerName",
        },
      },
      gke_service: {
        name: "gkeService",
        fields: {
          project_id: "projectId",
          cluster_name: "clusterName",
          namespace_name: "namespaceName",
          service_name: "serviceName",
        },
      },
      basic_service: {
        name: "basicService",
        fields: {
          service_type: "serviceType",
          service_labels: "serviceLabels",
        },
      },
      telemetry: {
        name: "telemetry",
        fields: {
          resource_name: "resourceName",
        },
      },
      user_labels: "userLabels",
    },
  },
  next_page_token: "nextPageToken",
};

const listServices: AppBlock = {
  name: "List Services",
  description: `List 'Service's for this Metrics Scope.`,
  category: "Services",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. Resource name of the parent containing the listed services, either a [project](https://cloud.google.com/monitoring/api/v3#project_name) or a Monitoring Metrics Scope. The formats are:      projects/[PROJECT_ID_OR_NUMBER]     workspaces/[HOST_PROJECT_ID_OR_NUMBER]",
          type: {
            type: "string",
            description:
              "Required. Resource name of the parent containing the listed services, either a [project](https://cloud.google.com/monitoring/api/v3#project_name) or a Monitoring Metrics Scope. The formats are:      projects/[PROJECT_ID_OR_NUMBER]     workspaces/[HOST_PROJECT_ID_OR_NUMBER]",
          },
          required: true,
        },
        filter: {
          name: "Filter",
          description:
            'A filter specifying what `Service`s to return. The filter supports filtering on a particular service-identifier type or one of its attributes.  To filter on a particular service-identifier type, the `identifier_case` refers to which option in the `identifier` field is populated. For example, the filter `identifier_case = "CUSTOM"` would match all services with a value for the `custom` field. Valid options include "CUSTOM", "APP_ENGINE", "MESH_ISTIO", and the other options listed at https://cloud.google.com/monitoring/api/ref_v3/rest/v3/services#Service  To filter on an attribute of a service-identifier type, apply the filter name by using the snake case of the service-identifier type and the attribute of that service-identifier type, and join the two with a period. For example, to filter by the `meshUid` field of the `MeshIstio` service-identifier type, you must filter on `mesh_istio.mesh_uid = "123"` to match all services with mesh UID "123". Service-identifier types and their attributes are described at https://cloud.google.com/monitoring/api/ref_v3/rest/v3/services#Service',
          type: {
            type: "string",
            description:
              'A filter specifying what `Service`s to return. The filter supports filtering on a particular service-identifier type or one of its attributes.  To filter on a particular service-identifier type, the `identifier_case` refers to which option in the `identifier` field is populated. For example, the filter `identifier_case = "CUSTOM"` would match all services with a value for the `custom` field. Valid options include "CUSTOM", "APP_ENGINE", "MESH_ISTIO", and the other options listed at https://cloud.google.com/monitoring/api/ref_v3/rest/v3/services#Service  To filter on an attribute of a service-identifier type, apply the filter name by using the snake case of the service-identifier type and the attribute of that service-identifier type, and join the two with a period. For example, to filter by the `meshUid` field of the `MeshIstio` service-identifier type, you must filter on `mesh_istio.mesh_uid = "123"` to match all services with mesh UID "123". Service-identifier types and their attributes are described at https://cloud.google.com/monitoring/api/ref_v3/rest/v3/services#Service',
          },
          required: false,
        },
        pageSize: {
          name: "Page Size",
          description:
            "A non-negative number that is the maximum number of results to return. When 0, use default page size.",
          type: {
            type: "integer",
            description:
              "A non-negative number that is the maximum number of results to return. When 0, use default page size.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getServiceMonitoringServiceClient(
          input.app.config,
        );

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listServices(request, (err: any, response: any) => {
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
          services: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Identifier. Resource name for this Service. The format is:      projects/[PROJECT_ID_OR_NUMBER]/services/[SERVICE_ID]",
                },
                displayName: {
                  type: "string",
                  description:
                    "Name used for UI elements listing this Service.",
                },
                custom: {
                  type: "object",
                  properties: {},
                  description:
                    "Use a custom service to designate a service that you want to monitor when none of the other service types (like App Engine, Cloud Run, or a GKE type) matches your intended service. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                appEngine: {
                  type: "object",
                  properties: {
                    moduleId: {
                      type: "string",
                      description:
                        "The ID of the App Engine module underlying this service. Corresponds to the `module_id` resource label in the [`gae_app` monitored resource](https://cloud.google.com/monitoring/api/resources#tag_gae_app).",
                    },
                  },
                  description:
                    "App Engine service. Learn more at https://cloud.google.com/appengine. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                cloudEndpoints: {
                  type: "object",
                  properties: {
                    service: {
                      type: "string",
                      description:
                        "The name of the Cloud Endpoints service underlying this service. Corresponds to the `service` resource label in the [`api` monitored resource](https://cloud.google.com/monitoring/api/resources#tag_api).",
                    },
                  },
                  description:
                    "Cloud Endpoints service. Learn more at https://cloud.google.com/endpoints. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                clusterIstio: {
                  type: "object",
                  properties: {
                    location: {
                      type: "string",
                      description:
                        "The location of the Kubernetes cluster in which this Istio service is defined. Corresponds to the `location` resource label in `k8s_cluster` resources.",
                    },
                    clusterName: {
                      type: "string",
                      description:
                        "The name of the Kubernetes cluster in which this Istio service is defined. Corresponds to the `cluster_name` resource label in `k8s_cluster` resources.",
                    },
                    serviceNamespace: {
                      type: "string",
                      description:
                        "The namespace of the Istio service underlying this service. Corresponds to the `destination_service_namespace` metric label in Istio metrics.",
                    },
                    serviceName: {
                      type: "string",
                      description:
                        "The name of the Istio service underlying this service. Corresponds to the `destination_service_name` metric label in Istio metrics.",
                    },
                  },
                  description:
                    "Istio service scoped to a single Kubernetes cluster. Learn more at https://istio.io. Clusters running OSS Istio will have their services ingested as this type. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                meshIstio: {
                  type: "object",
                  properties: {
                    meshUid: {
                      type: "string",
                      description:
                        "Identifier for the mesh in which this Istio service is defined. Corresponds to the `mesh_uid` metric label in Istio metrics.",
                    },
                    serviceNamespace: {
                      type: "string",
                      description:
                        "The namespace of the Istio service underlying this service. Corresponds to the `destination_service_namespace` metric label in Istio metrics.",
                    },
                    serviceName: {
                      type: "string",
                      description:
                        "The name of the Istio service underlying this service. Corresponds to the `destination_service_name` metric label in Istio metrics.",
                    },
                  },
                  description:
                    "Istio service scoped to an Istio mesh. Anthos clusters running ASM < 1.6.8 will have their services ingested as this type. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                istioCanonicalService: {
                  type: "object",
                  properties: {
                    meshUid: {
                      type: "string",
                      description:
                        "Identifier for the Istio mesh in which this canonical service is defined. Corresponds to the `mesh_uid` metric label in [Istio metrics](https://cloud.google.com/monitoring/api/metrics_istio).",
                    },
                    canonicalServiceNamespace: {
                      type: "string",
                      description:
                        "The namespace of the canonical service underlying this service. Corresponds to the `destination_canonical_service_namespace` metric label in [Istio metrics](https://cloud.google.com/monitoring/api/metrics_istio).",
                    },
                    canonicalService: {
                      type: "string",
                      description:
                        "The name of the canonical service underlying this service. Corresponds to the `destination_canonical_service_name` metric label in label in [Istio metrics](https://cloud.google.com/monitoring/api/metrics_istio).",
                    },
                  },
                  description:
                    "Canonical service scoped to an Istio mesh. Anthos clusters running ASM >= 1.6.8 will have their services ingested as this type. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                cloudRun: {
                  type: "object",
                  properties: {
                    serviceName: {
                      type: "string",
                      description:
                        "The name of the Cloud Run service. Corresponds to the `service_name` resource label in the [`cloud_run_revision` monitored resource](https://cloud.google.com/monitoring/api/resources#tag_cloud_run_revision).",
                    },
                    location: {
                      type: "string",
                      description:
                        "The location the service is run. Corresponds to the `location` resource label in the [`cloud_run_revision` monitored resource](https://cloud.google.com/monitoring/api/resources#tag_cloud_run_revision).",
                    },
                  },
                  description:
                    "Cloud Run service. Learn more at https://cloud.google.com/run. (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                gkeNamespace: {
                  type: "object",
                  properties: {
                    projectId: {
                      type: "string",
                      description:
                        "Output only. The project this resource lives in. For legacy services migrated from the `Custom` type, this may be a distinct project from the one parenting the service itself.",
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
                    "GKE Namespace. The field names correspond to the resource metadata labels on monitored resources that fall under a namespace (for example, `k8s_container` or `k8s_pod`). (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                gkeWorkload: {
                  type: "object",
                  properties: {
                    projectId: {
                      type: "string",
                      description:
                        "Output only. The project this resource lives in. For legacy services migrated from the `Custom` type, this may be a distinct project from the one parenting the service itself.",
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
                    "A GKE Workload (Deployment, StatefulSet, etc). The field names correspond to the metadata labels on monitored resources that fall under a workload (for example, `k8s_container` or `k8s_pod`). (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                gkeService: {
                  type: "object",
                  properties: {
                    projectId: {
                      type: "string",
                      description:
                        "Output only. The project this resource lives in. For legacy services migrated from the `Custom` type, this may be a distinct project from the one parenting the service itself.",
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
                    "GKE Service. The \"service\" here represents a [Kubernetes service object](https://kubernetes.io/docs/concepts/services-networking/service). The field names correspond to the resource labels on [`k8s_service` monitored resources](https://cloud.google.com/monitoring/api/resources#tag_k8s_service). (Part of 'identifier' - only one field in this group can be set)",
                  additionalProperties: true,
                },
                basicService: {
                  type: "object",
                  properties: {
                    serviceType: {
                      type: "string",
                      description:
                        "The type of service that this basic service defines, e.g. APP_ENGINE service type. Documentation and valid values [here](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
                    },
                    serviceLabels: {
                      type: "object",
                      additionalProperties: {
                        type: "string",
                      },
                      description:
                        "Labels that specify the resource that emits the monitoring data which is used for SLO reporting of this `Service`. Documentation and valid values for given service types [here](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
                    },
                  },
                  description:
                    "A well-known service type, defined by its service type and service labels. Documentation and examples [here](https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring/api/api-structures#basic-svc-w-basic-sli).",
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
                "A `Service` is a discrete, autonomous, and network-accessible unit, designed to solve an individual concern ([Wikipedia](https://en.wikipedia.org/wiki/Service-orientation)). In Cloud Monitoring, a `Service` acts as the root resource under which operational aspects of the service are accessible.",
              additionalProperties: true,
            },
            description: "The `Service`s matching the specified filter.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
        },
        description: "The `ListServices` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listServices;
