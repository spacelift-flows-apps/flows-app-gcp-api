import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getCloudBuildClient,
  createRoutingMetadata,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  workerPool: {
    name: "worker_pool",
    fields: {
      displayName: "display_name",
      privatePoolV1Config: {
        name: "private_pool_v1_config",
        fields: {
          workerConfig: {
            name: "worker_config",
            fields: {
              machineType: "machine_type",
              diskSizeGb: "disk_size_gb",
              enableNestedVirtualization: "enable_nested_virtualization",
            },
          },
          networkConfig: {
            name: "network_config",
            fields: {
              peeredNetwork: "peered_network",
              egressOption: "egress_option",
              peeredNetworkIpRange: "peered_network_ip_range",
            },
          },
          privateServiceConnect: {
            name: "private_service_connect",
            fields: {
              networkAttachment: "network_attachment",
              publicIpAddressDisabled: "public_ip_address_disabled",
              routeAllTraffic: "route_all_traffic",
            },
          },
        },
      },
    },
  },
  workerPoolId: "worker_pool_id",
  validateOnly: "validate_only",
};

const outputMapping = {
  metadata: {
    name: "metadata",
    fields: {
      type_url: "typeUrl",
    },
  },
  error: {
    name: "error",
    fields: {
      details: {
        name: "details",
        fields: {
          type_url: "typeUrl",
        },
      },
    },
  },
  response: {
    name: "response",
    fields: {
      type_url: "typeUrl",
    },
  },
};

const createWorkerPool: AppBlock = {
  name: "Create Worker Pool",
  description: `Creates a 'WorkerPool'.`,
  category: "Worker Pools",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The parent resource where this worker pool will be created. Format: `projects/{project}/locations/{location}`.",
          type: {
            type: "string",
            description:
              "Required. The parent resource where this worker pool will be created. Format: `projects/{project}/locations/{location}`.",
          },
          required: true,
        },
        workerPool: {
          name: "Worker Pool",
          description: "Required. `WorkerPool` resource to create.",
          type: {
            type: "object",
            properties: {
              displayName: {
                type: "string",
                description:
                  "A user-specified, human-readable name for the `WorkerPool`. If provided, this value must be 1-63 characters.",
              },
              annotations: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "User specified annotations. See https://google.aip.dev/128#annotations for more details such as format and size limitations.",
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
                    required: ["networkAttachment", "publicIpAddressDisabled"],
                    description:
                      "Defines the Private Service Connect network configuration for the pool.",
                    additionalProperties: true,
                  },
                },
                description: "Configuration for a V1 `PrivatePool`.",
                additionalProperties: true,
              },
            },
            description:
              "Configuration for a `WorkerPool`.  Cloud Build owns and maintains a pool of workers for general use and have no access to a project's private network. By default, builds submitted to Cloud Build will use a worker from this pool.  If your build needs access to resources on a private network, create and use a `WorkerPool` to run your builds. Private `WorkerPool`s give your builds access to any single VPC network that you administer, including any on-prem resources connected to that VPC network. For an overview of private pools, see [Private pools overview](https://cloud.google.com/build/docs/private-pools/private-pools-overview).",
            additionalProperties: true,
          },
          required: true,
        },
        workerPoolId: {
          name: "Worker Pool Id",
          description:
            "Required. Immutable. The ID to use for the `WorkerPool`, which will become the final component of the resource name.  This value should be 1-63 characters, and valid characters are /[a-z][0-9]-/.",
          type: {
            type: "string",
            description:
              "Required. Immutable. The ID to use for the `WorkerPool`, which will become the final component of the resource name.  This value should be 1-63 characters, and valid characters are /[a-z][0-9]-/.",
          },
          required: true,
        },
        validateOnly: {
          name: "Validate Only",
          description:
            "If set, validate the request and preview the response, but do not actually post it.",
          type: {
            type: "boolean",
            description:
              "If set, validate the request and preview the response, but do not actually post it.",
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
          client.createWorkerPool(
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
          name: {
            type: "string",
          },
          metadata: {
            type: "object",
            properties: {
              typeUrl: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
          },
          done: {
            type: "boolean",
          },
          error: {
            type: "object",
            properties: {
              code: {
                type: "integer",
              },
              message: {
                type: "string",
              },
              details: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    typeUrl: {
                      type: "string",
                    },
                    value: {
                      type: "string",
                      description: "Base64-encoded bytes",
                    },
                  },
                  additionalProperties: true,
                },
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
          response: {
            type: "object",
            properties: {
              typeUrl: {
                type: "string",
              },
              value: {
                type: "string",
                description: "Base64-encoded bytes",
              },
            },
            additionalProperties: true,
            description:
              "(Part of 'result' - only one field in this group can be set)",
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default createWorkerPool;
