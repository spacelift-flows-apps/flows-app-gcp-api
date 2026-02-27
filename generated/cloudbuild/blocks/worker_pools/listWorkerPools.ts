import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  worker_pools: {
    name: "workerPools",
    fields: {
      display_name: "displayName",
      create_time: "createTime",
      update_time: "updateTime",
      delete_time: "deleteTime",
      private_pool_v1_config: {
        name: "privatePoolV1Config",
        fields: {
          worker_config: {
            name: "workerConfig",
            fields: {
              machine_type: "machineType",
              disk_size_gb: "diskSizeGb",
              enable_nested_virtualization: "enableNestedVirtualization",
            },
          },
          network_config: {
            name: "networkConfig",
            fields: {
              peered_network: "peeredNetwork",
              egress_option: "egressOption",
              peered_network_ip_range: "peeredNetworkIpRange",
            },
          },
          private_service_connect: {
            name: "privateServiceConnect",
            fields: {
              network_attachment: "networkAttachment",
              public_ip_address_disabled: "publicIpAddressDisabled",
              route_all_traffic: "routeAllTraffic",
            },
          },
        },
      },
    },
  },
  next_page_token: "nextPageToken",
};

const listWorkerPools: AppBlock = {
  name: "List Worker Pools",
  description: `Lists 'WorkerPool's.`,
  category: "Worker Pools",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent of the collection of `WorkerPools`. Format: `projects/{project}/locations/{location}`.",
          type: {
            type: "string",
            description:
              "Required. The parent of the collection of `WorkerPools`. Format: `projects/{project}/locations/{location}`.",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of `WorkerPool`s to return. The service may return fewer than this value. If omitted, the server will use a sensible default.",
          type: {
            type: "integer",
            description:
              "The maximum number of `WorkerPool`s to return. The service may return fewer than this value. If omitted, the server will use a sensible default.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A page token, received from a previous `ListWorkerPools` call. Provide this to retrieve the subsequent page.",
          type: {
            type: "string",
            description:
              "A page token, received from a previous `ListWorkerPools` call. Provide this to retrieve the subsequent page.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getCloudBuildClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const routingParams: Record<string, string> = {};
        if (request.parent !== undefined) {
          const m = String(request.parent).match(/^([^/]+)/);
          if (m) routingParams["location"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.listWorkerPools(
            request,
            metadata,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
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
          workerPools: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The resource name of the `WorkerPool`, with format `projects/{project}/locations/{location}/workerPools/{worker_pool}`. The value of `{worker_pool}` is provided by `worker_pool_id` in `CreateWorkerPool` request and the value of `{location}` is determined by the endpoint accessed.",
                },
                displayName: {
                  type: "string",
                  description:
                    "A user-specified, human-readable name for the `WorkerPool`. If provided, this value must be 1-63 characters.",
                },
                uid: {
                  type: "string",
                  description:
                    "Output only. A unique identifier for the `WorkerPool`.",
                },
                annotations: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                  description:
                    "User specified annotations. See https://google.aip.dev/128#annotations for more details such as format and size limitations.",
                },
                createTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                updateTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                deleteTime: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
                state: {
                  type: "string",
                  enum: [
                    "STATE_UNSPECIFIED",
                    "CREATING",
                    "RUNNING",
                    "DELETING",
                    "DELETED",
                    "UPDATING",
                  ],
                  description: "Output only. `WorkerPool` state.",
                },
                privatePoolV1Config: {
                  type: "object",
                  properties: {
                    workerConfig: {
                      type: "object",
                      properties: {
                        machineType: {
                          type: "string",
                          description:
                            "Optional. Machine type of a worker, such as `e2-medium`. See [Worker pool config file](https://cloud.google.com/build/docs/private-pools/worker-pool-config-file-schema). If left blank, Cloud Build will use a sensible default.",
                        },
                        diskSizeGb: {
                          type: "string",
                          description: "64-bit integer as string",
                        },
                        enableNestedVirtualization: {
                          type: "boolean",
                          description:
                            "Optional. Enable nested virtualization on the worker, if supported by the machine type. By default, nested virtualization is disabled.",
                        },
                      },
                      description:
                        "Defines the configuration to be used for creating workers in the pool.",
                      additionalProperties: true,
                    },
                    networkConfig: {
                      type: "object",
                      properties: {
                        peeredNetwork: {
                          type: "string",
                          description:
                            "Required. Immutable. The network definition that the workers are peered to. If this section is left empty, the workers will be peered to `WorkerPool.project_id` on the service producer network. Must be in the format `projects/{project}/global/networks/{network}`, where `{project}` is a project number, such as `12345`, and `{network}` is the name of a VPC network in the project. See [Understanding network configuration options](https://cloud.google.com/build/docs/private-pools/set-up-private-pool-environment)",
                        },
                        egressOption: {
                          type: "string",
                          enum: [
                            "EGRESS_OPTION_UNSPECIFIED",
                            "NO_PUBLIC_EGRESS",
                            "PUBLIC_EGRESS",
                          ],
                          description:
                            "Option to configure network egress for the workers.",
                        },
                        peeredNetworkIpRange: {
                          type: "string",
                          description:
                            "Immutable. Subnet IP range within the peered network. This is specified in CIDR notation with a slash and the subnet prefix size. You can optionally specify an IP address before the subnet prefix value. e.g. `192.168.0.0/29` would specify an IP range starting at 192.168.0.0 with a prefix size of 29 bits. `/16` would specify a prefix size of 16 bits, with an automatically determined IP within the peered VPC. If unspecified, a value of `/24` will be used.",
                        },
                      },
                      required: ["peeredNetwork"],
                      description:
                        "Defines the network configuration for the pool.",
                      additionalProperties: true,
                    },
                    privateServiceConnect: {
                      type: "object",
                      properties: {
                        networkAttachment: {
                          type: "string",
                          description:
                            "Required. Immutable. The network attachment that the worker network interface is peered to. Must be in the format `projects/{project}/regions/{region}/networkAttachments/{networkAttachment}`. The region of network attachment must be the same as the worker pool. See [Network Attachments](https://cloud.google.com/vpc/docs/about-network-attachments)",
                        },
                        publicIpAddressDisabled: {
                          type: "boolean",
                          description:
                            "Required. Immutable. Disable public IP on the primary network interface.  If true, workers are created without any public address, which prevents network egress to public IPs unless a network proxy is configured. If false, workers are created with a public address which allows for public internet egress. The public address only applies to traffic through the primary network interface. If `route_all_traffic` is set to true, all traffic will go through the non-primary network interface, this boolean has no effect.",
                        },
                        routeAllTraffic: {
                          type: "boolean",
                          description:
                            "Immutable. Route all traffic through PSC interface. Enable this if you want full control of traffic in the private pool. Configure Cloud NAT for the subnet of network attachment if you need to access public Internet.  If false, Only route RFC 1918 (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16) and RFC 6598 (100.64.0.0/10) through PSC interface.",
                        },
                      },
                      required: [
                        "networkAttachment",
                        "publicIpAddressDisabled",
                      ],
                      description:
                        "Defines the Private Service Connect network configuration for the pool.",
                      additionalProperties: true,
                    },
                  },
                  description: "Configuration for a V1 `PrivatePool`.",
                  additionalProperties: true,
                },
                etag: {
                  type: "string",
                  description:
                    "Output only. Checksum computed by the server. May be sent on update and delete requests to ensure that the client has an up-to-date value before proceeding.",
                },
              },
              description:
                "Configuration for a `WorkerPool`.  Cloud Build owns and maintains a pool of workers for general use and have no access to a project's private network. By default, builds submitted to Cloud Build will use a worker from this pool.  If your build needs access to resources on a private network, create and use a `WorkerPool` to run your builds. Private `WorkerPool`s give your builds access to any single VPC network that you administer, including any on-prem resources connected to that VPC network. For an overview of private pools, see [Private pools overview](https://cloud.google.com/build/docs/private-pools/private-pools-overview).",
              additionalProperties: true,
            },
            description: "`WorkerPools` for the specified project.",
          },
          nextPageToken: {
            type: "string",
            description:
              "Continuation token used to page through large result sets. Provide this value in a subsequent ListWorkerPoolsRequest to return the next page of results.",
          },
        },
        description: "Response containing existing `WorkerPools`.",
        additionalProperties: true,
      },
    },
  },
};

export default listWorkerPools;
