import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const connectGet: AppBlock = {
  name: "Connect - Get",
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
          },
          required: true,
        },
        readTime: {
          name: "Read Time",
          description:
            "Optional. Optional snapshot read timestamp to trade freshness for performance.",
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
              "https://www.googleapis.com/auth/sqlservice.admin",
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
        const baseUrl = "https://sqladmin.googleapis.com/";
        let path = `v1/projects/{project}/instances/{instance}/connectSettings`;

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
          kind: {
            type: "string",
            description: "This is always `sql#connectSettings`.",
          },
          serverCaCert: {
            type: "object",
            properties: {
              kind: {
                type: "string",
                description: "This is always `sql#sslCert`.",
              },
              certSerialNumber: {
                type: "string",
                description:
                  "Serial number, as extracted from the certificate.",
              },
              cert: {
                type: "string",
                description: "PEM representation.",
              },
              createTime: {
                type: "string",
                description:
                  "The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z` (Format: google-datetime)",
              },
              commonName: {
                type: "string",
                description:
                  "User supplied name. Constrained to [a-zA-Z.-_ ]+.",
              },
              expirationTime: {
                type: "string",
                description:
                  "The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. (Format: google-datetime)",
              },
              sha1Fingerprint: {
                type: "string",
                description: "Sha1 Fingerprint.",
              },
              instance: {
                type: "string",
                description: "Name of the database instance.",
              },
              selfLink: {
                type: "string",
                description: "The URI of this resource.",
              },
            },
            description: "SslCerts Resource",
            additionalProperties: true,
          },
          ipAddresses: {
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
                ipAddress: {
                  type: "string",
                  description: "The IP address assigned.",
                },
                timeToRetire: {
                  type: "string",
                  description:
                    "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired. (Format: google-datetime)",
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
          databaseVersion: {
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
            description:
              "The database engine type and version. The `databaseVersion` field cannot be changed after instance creation. MySQL instances: `MYSQL_8_0`, `MYSQL_5_7` (default), or `MYSQL_5_6`. PostgreSQL instances: `POSTGRES_9_6`, `POSTGRES_10`, `POSTGRES_11`, `POSTGRES_12` (default), `POSTGRES_13`, or `POSTGRES_14`. SQL Server instances: `SQLSERVER_2017_STANDARD` (default), `SQLSERVER_2017_ENTERPRISE`, `SQLSERVER_2017_EXPRESS`, `SQLSERVER_2017_WEB`, `SQLSERVER_2019_STANDARD`, `SQLSERVER_2019_ENTERPRISE`, `SQLSERVER_2019_EXPRESS`, or `SQLSERVER_2019_WEB`.",
          },
          backendType: {
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
          pscEnabled: {
            type: "boolean",
            description:
              "Whether PSC connectivity is enabled for this instance.",
          },
          dnsName: {
            type: "string",
            description: "The dns name of the instance.",
          },
          serverCaMode: {
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
          customSubjectAlternativeNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Custom subject alternative names for the server certificate.",
          },
          dnsNames: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The DNS name.",
                },
                connectionType: {
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
                dnsScope: {
                  type: "string",
                  enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE"],
                  description:
                    "Output only. The scope that the DNS name applies to.",
                },
              },
              description: "DNS metadata.",
              additionalProperties: true,
            },
            description:
              "Output only. The list of DNS names used by this instance.",
          },
          nodeCount: {
            type: "integer",
            description:
              "The number of read pool nodes in a read pool. (Format: int32)",
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
                ipAddresses: {
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
                      ipAddress: {
                        type: "string",
                        description: "The IP address assigned.",
                      },
                      timeToRetire: {
                        type: "string",
                        description:
                          "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired. (Format: google-datetime)",
                      },
                    },
                    description: "Database instance IP mapping",
                    additionalProperties: true,
                  },
                  description:
                    "Output only. Mappings containing IP addresses that can be used to connect to the read pool node.",
                },
                dnsName: {
                  type: "string",
                  description:
                    "Output only. The DNS name of the read pool node.",
                },
                dnsNames: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "The DNS name.",
                      },
                      connectionType: {
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
                      dnsScope: {
                        type: "string",
                        enum: ["DNS_SCOPE_UNSPECIFIED", "INSTANCE"],
                        description:
                          "Output only. The scope that the DNS name applies to.",
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
          mdxProtocolSupport: {
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

export default connectGet;
