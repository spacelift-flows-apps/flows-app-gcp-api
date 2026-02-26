import { AppBlock, events } from "@slflows/sdk/v1";
import { getSqlConnectServiceClient } from "../../lib/grpcClient.ts";

const getConnectSettings: AppBlock = {
  name: "Get Connect Settings",
  description: `Retrieves connect settings about a Cloud SQL instance.`,
  category: "Connect",
  inputs: {
    default: {
      config: {
        instance: {
          name: "Instance",
          description:
            "Cloud SQL instance ID. This does not include the project ID.",
          type: {
            type: "string",
            description:
              "Cloud SQL instance ID. This does not include the project ID.",
          },
          required: false,
        },
        project: {
          name: "Project",
          description: "Project ID of the project that contains the instance.",
          type: {
            type: "string",
            description:
              "Project ID of the project that contains the instance.",
          },
          required: false,
        },
        read_time: {
          name: "Read Time",
          description:
            "Optional. Optional snapshot read timestamp to trade freshness for performance.",
          type: {
            type: "string",
            description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getSqlConnectServiceClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.instance !== undefined)
          request.instance = input.event.inputConfig.instance;
        if (input.event.inputConfig.project !== undefined)
          request.project = input.event.inputConfig.project;
        if (input.event.inputConfig.read_time !== undefined)
          request.read_time = input.event.inputConfig.read_time;

        const result = await new Promise<any>((resolve, reject) => {
          client.getConnectSettings(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          kind: {
            type: "string",
            description: "This is always `sql#connectSettings`.",
          },
          server_ca_cert: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#sslCert`.",
              },
              cert_serial_number: {
                type: "string",
                description:
                  "Serial number, as extracted from the certificate.",
              },
              cert: {
                type: "string",
                description: "PEM representation.",
              },
              create_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              common_name: {
                type: "string",
                description:
                  "User supplied name.  Constrained to [a-zA-Z.-_ ]+.",
              },
              expiration_time: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              sha1_fingerprint: {
                type: "string",
                description: "Sha1 Fingerprint.",
              },
              instance: {
                type: "string",
                description: "Name of the database instance.",
              },
              self_link: {
                type: "string",
                description: "The URI of this resource.",
              },
            },
            description: "SslCerts Resource",
            additionalProperties: true,
          },
          ip_addresses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "SQL_IP_ADDRESS_TYPE_UNSPECIFIED",
                    "PRIMARY",
                    "OUTGOING",
                    "PRIVATE",
                    "MIGRATED_1ST_GEN",
                  ],
                  description:
                    "The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.",
                },
                ip_address: {
                  type: "string",
                  description: "The IP address assigned.",
                },
                time_to_retire: {
                  type: "string",
                  description:
                    "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                },
              },
              description: "Database instance IP mapping",
              additionalProperties: true,
            },
            description: "The assigned IP addresses for the instance.",
          },
          region: {
            type: "string",
            description:
              "The cloud region for the instance. For example, `us-central1`, `europe-west1`. The region cannot be changed after instance creation.",
          },
          database_version: {
            type: "string",
            enum: [
              "SQL_DATABASE_VERSION_UNSPECIFIED",
              "MYSQL_5_1",
              "MYSQL_5_5",
              "MYSQL_5_6",
              "MYSQL_5_7",
              "MYSQL_8_0",
              "MYSQL_8_0_18",
              "MYSQL_8_0_26",
              "MYSQL_8_0_27",
              "MYSQL_8_0_28",
              "MYSQL_8_0_29",
              "MYSQL_8_0_30",
              "MYSQL_8_0_31",
              "MYSQL_8_0_32",
              "MYSQL_8_0_33",
              "MYSQL_8_0_34",
              "MYSQL_8_0_35",
              "MYSQL_8_0_36",
              "MYSQL_8_0_37",
              "MYSQL_8_0_39",
              "MYSQL_8_0_40",
              "MYSQL_8_0_41",
              "MYSQL_8_0_42",
              "MYSQL_8_0_43",
              "MYSQL_8_0_44",
              "MYSQL_8_0_45",
              "MYSQL_8_0_46",
              "MYSQL_8_4",
              "MYSQL_9_7",
              "SQLSERVER_2017_STANDARD",
              "SQLSERVER_2017_ENTERPRISE",
              "SQLSERVER_2017_EXPRESS",
              "SQLSERVER_2017_WEB",
              "POSTGRES_9_6",
              "POSTGRES_10",
              "POSTGRES_11",
              "POSTGRES_12",
              "POSTGRES_13",
              "POSTGRES_14",
              "POSTGRES_15",
              "POSTGRES_16",
              "POSTGRES_17",
              "POSTGRES_18",
              "SQLSERVER_2019_STANDARD",
              "SQLSERVER_2019_ENTERPRISE",
              "SQLSERVER_2019_EXPRESS",
              "SQLSERVER_2019_WEB",
              "SQLSERVER_2022_STANDARD",
              "SQLSERVER_2022_ENTERPRISE",
              "SQLSERVER_2022_EXPRESS",
              "SQLSERVER_2022_WEB",
            ],
            description: "The database engine type and version.",
          },
          backend_type: {
            type: "string",
            enum: [
              "SQL_BACKEND_TYPE_UNSPECIFIED",
              "FIRST_GEN",
              "SECOND_GEN",
              "EXTERNAL",
            ],
            description:
              "`SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.",
          },
          psc_enabled: {
            type: "boolean",
            description:
              "Whether PSC connectivity is enabled for this instance.",
          },
          dns_name: {
            type: "string",
            description: "The dns name of the instance.",
          },
          server_ca_mode: {
            type: "string",
            enum: [
              "CA_MODE_UNSPECIFIED",
              "GOOGLE_MANAGED_INTERNAL_CA",
              "GOOGLE_MANAGED_CAS_CA",
              "CUSTOMER_MANAGED_CAS_CA",
            ],
            description:
              "Specify what type of CA is used for the server certificate.",
          },
          custom_subject_alternative_names: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Custom subject alternative names for the server certificate.",
          },
          dns_names: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Output only. The DNS name.",
                },
                connection_type: {
                  type: "string",
                  enum: [
                    "CONNECTION_TYPE_UNSPECIFIED",
                    "PUBLIC",
                    "PRIVATE_SERVICES_ACCESS",
                    "PRIVATE_SERVICE_CONNECT",
                  ],
                  description:
                    "Output only. The connection type of the DNS name.",
                },
                dns_scope: {
                  type: "string",
                  enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE", "CLUSTER"],
                  description:
                    "Output only. The scope that the DNS name applies to.",
                },
                record_manager: {
                  type: "string",
                  enum: [
                    "RECORD_MANAGER_UNSPECIFIED",
                    "CUSTOMER",
                    "CLOUD_SQL_AUTOMATION",
                  ],
                  description: "Output only. The manager for this DNS record.",
                },
              },
              description: "DNS metadata.",
              additionalProperties: true,
            },
            description:
              "Output only. The list of DNS names used by this instance.",
          },
          node_count: {
            type: "integer",
            description: "The number of read pool nodes in a read pool.",
          },
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Output only. The name of the read pool node. Doesn't include the project ID.",
                },
                ip_addresses: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string",
                        enum: [
                          "SQL_IP_ADDRESS_TYPE_UNSPECIFIED",
                          "PRIMARY",
                          "OUTGOING",
                          "PRIVATE",
                          "MIGRATED_1ST_GEN",
                        ],
                        description:
                          "The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.",
                      },
                      ip_address: {
                        type: "string",
                        description: "The IP address assigned.",
                      },
                      time_to_retire: {
                        type: "string",
                        description:
                          "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
                      },
                    },
                    description: "Database instance IP mapping",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. Mappings containing IP addresses that can be used to connect to the read pool node.",
                },
                dns_name: {
                  type: "string",
                  description:
                    "Output only. The DNS name of the read pool node.",
                },
                dns_names: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Output only. The DNS name.",
                      },
                      connection_type: {
                        type: "string",
                        enum: [
                          "CONNECTION_TYPE_UNSPECIFIED",
                          "PUBLIC",
                          "PRIVATE_SERVICES_ACCESS",
                          "PRIVATE_SERVICE_CONNECT",
                        ],
                        description:
                          "Output only. The connection type of the DNS name.",
                      },
                      dns_scope: {
                        type: "string",
                        enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE", "CLUSTER"],
                        description:
                          "Output only. The scope that the DNS name applies to.",
                      },
                      record_manager: {
                        type: "string",
                        enum: [
                          "RECORD_MANAGER_UNSPECIFIED",
                          "CUSTOMER",
                          "CLOUD_SQL_AUTOMATION",
                        ],
                        description:
                          "Output only. The manager for this DNS record.",
                      },
                    },
                    description: "DNS metadata.",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. The list of DNS names used by this read pool node.",
                },
              },
              description: "Details of a single read pool node of a read pool.",
              additionalProperties: true,
            },
            description:
              "Output only. Entries containing information about each read pool node of the read pool.",
          },
          mdx_protocol_support: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "MDX_PROTOCOL_SUPPORT_UNSPECIFIED",
                "CLIENT_PROTOCOL_TYPE",
              ],
            },
            description:
              "Optional. Output only. mdx_protocol_support controls how the client uses metadata exchange when connecting to the instance. The values in the list representing parts of the MDX protocol that are supported by this instance. When the list is empty, the instance does not support MDX, so the client must not send an MDX request. The default is empty.",
          },
        },
        description: "Connect settings retrieval response.",
        additionalProperties: true,
      },
    },
  },
};

export default getConnectSettings;
