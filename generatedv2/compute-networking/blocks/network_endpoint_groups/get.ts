import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Network Endpoint Groups - Get",
  description: `Returns the specified Zone resource.`,
  category: "Network Endpoint Groups",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description:
            "The name of the zone where the network endpoint group is located. It should comply with RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
        network_endpoint_group: {
          name: "Network Endpoint Group",
          description:
            "The name of the network endpoint group. It should comply with RFC1035.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.network_endpoint_group !== undefined)
          pathParams["network_endpoint_group"] = String(
            input.event.inputConfig.network_endpoint_group,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/networkEndpointGroups/{network_endpoint_group}",
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
          annotations: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Optional. Metadata defined as annotations on the network endpoint group.",
          },
          app_engine: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  "Optional serving service.  The service name is case-sensitive and must be 1-63 characters long.  Example value: default, my-service.",
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse service and version fields from a request URL. URL mask allows for routing to multiple App Engine services without having to create multiple Network Endpoint Groups and backend services.  For example, the request URLsfoo1-dot-appname.appspot.com/v1 andfoo1-dot-appname.appspot.com/v2 can be backed by the same Serverless NEG with URL mask<service>-dot-appname.appspot.com/<version>. The URL mask will parse them to { service = "foo1", version = "v1" } and { service = "foo1", version = "v2" } respectively.',
              },
              version: {
                type: "string",
                description:
                  "Optional serving version.  The version name is case-sensitive and must be 1-100 characters long.  Example value: v1, v2.",
              },
            },
            description:
              "Configuration for an App Engine network endpoint group (NEG). The service is optional, may be provided explicitly or in the URL mask. The version is optional and can only be provided explicitly or in the URL mask when service is present.  Note: App Engine service must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
          },
          cloud_function: {
            type: "object",
            properties: {
              function: {
                type: "string",
                description:
                  "A user-defined name of the Cloud Function.  The function name is case-sensitive and must be 1-63 characters long.  Example value: func1.",
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse function field from a request URL. URL mask allows for routing to multiple Cloud Functions without having to create multiple Network Endpoint Groups and backend services.  For example, request URLs mydomain.com/function1 andmydomain.com/function2 can be backed by the same Serverless NEG with URL mask /<function>. The URL mask will parse them to { function = "function1" } and{ function = "function2" } respectively.',
              },
            },
            description:
              "Configuration for a Cloud Function network endpoint group (NEG). The function must be provided explicitly or in the URL mask.  Note: Cloud Function must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
          },
          cloud_run: {
            type: "object",
            properties: {
              service: {
                type: "string",
                description:
                  'Cloud Run service is the main resource of Cloud Run.  The service must be 1-63 characters long, and comply withRFC1035.  Example value: "run-service".',
              },
              tag: {
                type: "string",
                description:
                  'Optional Cloud Run tag represents the "named-revision" to provide additional fine-grained traffic routing information.  The tag must be 1-63 characters long, and comply withRFC1035.  Example value: "revision-0010".',
              },
              url_mask: {
                type: "string",
                description:
                  'An URL mask is one of the main components of the Cloud Function.  A template to parse <service> and<tag> fields from a request URL. URL mask allows for routing to multiple Run services without having to create multiple network endpoint groups and backend services.  For example, request URLs foo1.domain.com/bar1 andfoo1.domain.com/bar2 can be backed by the same Serverless Network Endpoint Group (NEG) with URL mask<tag>.domain.com/<service>. The URL mask will parse them to { service="bar1", tag="foo1" } and { service="bar2", tag="foo2" } respectively.',
              },
            },
            description:
              "Configuration for a Cloud Run network endpoint group (NEG). The service must be provided explicitly or in the URL mask. The tag is optional, may be provided explicitly or in the URL mask.  Note: Cloud Run service must be in the same project and located in the same region as the Serverless NEG.",
            additionalProperties: true,
          },
          creation_timestamp: {
            type: "string",
            description:
              "Output only. [Output Only] Creation timestamp inRFC3339 text format.",
          },
          default_port: {
            type: "integer",
            description:
              "The default port used if the port number is not specified in the network endpoint.  Optional. If the network endpoint type is either GCE_VM_IP,SERVERLESS or PRIVATE_SERVICE_CONNECT, this field must not be specified.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#networkEndpointGroup for network endpoint group.",
          },
          name: {
            type: "string",
            description:
              "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          network: {
            type: "string",
            description:
              "The URL of the network to which all network endpoints in the NEG belong. Uses default project network if unspecified.",
          },
          network_endpoint_type: {
            type: "string",
            description:
              "Type of network endpoints in this network endpoint group. Can be one ofGCE_VM_IP, GCE_VM_IP_PORT,NON_GCP_PRIVATE_IP_PORT, INTERNET_FQDN_PORT,INTERNET_IP_PORT, SERVERLESS,PRIVATE_SERVICE_CONNECT, GCE_VM_IP_PORTMAP. Check the NetworkEndpointType enum for the list of possible values.",
          },
          psc_data: {
            type: "object",
            properties: {
              consumer_psc_address: {
                type: "string",
                description:
                  "Output only. [Output Only] Address allocated from given subnetwork for PSC. This IP address acts as a VIP for a PSC NEG, allowing it to act as an endpoint in L7 PSC-XLB.",
              },
              producer_port: {
                type: "integer",
                description:
                  "The psc producer port is used to connect PSC NEG with specific port on the PSC Producer side; should only be used for the PRIVATE_SERVICE_CONNECT NEG type",
              },
              psc_connection_id: {
                type: "string",
                description: "64-bit integer as string",
              },
              psc_connection_status: {
                type: "string",
                description:
                  "Output only. [Output Only] The connection status of the PSC Forwarding Rule. Check the PscConnectionStatus enum for the list of possible values.",
              },
            },
            description:
              "All data that is specifically relevant to only network endpoint groups of type PRIVATE_SERVICE_CONNECT.",
            additionalProperties: true,
          },
          psc_target_service: {
            type: "string",
            description:
              "The target service url used to set up private service connection to a Google API or a PSC Producer Service Attachment. An example value is: asia-northeast3-cloudkms.googleapis.com.  Optional. Only valid when networkEndpointType isPRIVATE_SERVICE_CONNECT.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of theregion where the network endpoint group is located.",
          },
          self_link: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for the resource.",
          },
          size: {
            type: "integer",
            description:
              "Output only. [Output only] Number of network endpoints in the network endpoint group.",
          },
          subnetwork: {
            type: "string",
            description:
              "Optional URL of the subnetwork to which all network endpoints in the NEG belong.",
          },
          zone: {
            type: "string",
            description:
              "Output only. [Output Only] The URL of thezone where the network endpoint group is located.",
          },
        },
        description:
          "Represents a collection of network endpoints.  A network endpoint group (NEG) defines how a set of endpoints should be reached, whether they are reachable, and where they are located. For more information about using NEGs for different use cases, seeNetwork endpoint groups overview.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
