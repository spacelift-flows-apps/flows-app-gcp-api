import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const get: AppBlock = {
  name: "Operations - Get",
  description: `Fetches the representation of an existing Project.`,
  category: "Operations",
  inputs: {
    default: {
      config: {
        clientOperationId: {
          name: "Client Operation ID",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
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
              "https://www.googleapis.com/auth/cloud-platform.read-only",
              "https://www.googleapis.com/auth/ndev.clouddns.readonly",
              "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
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
        const baseUrl = "https://dns.googleapis.com/";
        let path = `dns/v1/projects/{project}`;

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
          quota: {
            type: "object",
            properties: {
              gkeClustersPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters to which a privately scoped zone can be attached. (Format: int32)",
              },
              rrsetsPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets per zone in the project. (Format: int32)",
              },
              networksPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of networks to which a privately scoped zone can be attached. (Format: int32)",
              },
              rrsetDeletionsPerChange: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets to delete per ChangesCreateRequest. (Format: int32)",
              },
              gkeClustersPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters per response policy. (Format: int32)",
              },
              managedZones: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones in the project. (Format: int32)",
              },
              responsePolicyRulesPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of rules per response policy. (Format: int32)",
              },
              targetNameServersPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of target name servers per managed forwarding zone. (Format: int32)",
              },
              rrsetAdditionsPerChange: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets to add per ChangesCreateRequest. (Format: int32)",
              },
              managedZonesPerGkeCluster: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones which can be attached to a GKE cluster. (Format: int32)",
              },
              dnsKeysPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of DnsKeys per ManagedZone. (Format: int32)",
              },
              nameserversPerDelegation: {
                type: "integer",
                description:
                  "Maximum number of nameservers per delegation, meant to prevent abuse (Format: int32)",
              },
              peeringZonesPerTargetNetwork: {
                type: "integer",
                description:
                  "Maximum allowed number of consumer peering zones per target network owned by this producer project (Format: int32)",
              },
              resourceRecordsPerRrset: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecords per ResourceRecordSet. (Format: int32)",
              },
              responsePolicies: {
                type: "integer",
                description:
                  "Maximum allowed number of response policies per project. (Format: int32)",
              },
              networksPerPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of networks per policy. (Format: int32)",
              },
              whitelistedKeySpecs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                    },
                    keyType: {
                      type: "string",
                      enum: ["keySigning", "zoneSigning"],
                      description:
                        "Specifies whether this is a key signing key (KSK) or a zone signing key (ZSK). Key signing keys have the Secure Entry Point flag set and, when active, are only used to sign resource record sets of type DNSKEY. Zone signing keys do not have the Secure Entry Point flag set and are used to sign all other types of resource record sets.",
                    },
                    algorithm: {
                      type: "string",
                      enum: [
                        "rsasha1",
                        "rsasha256",
                        "rsasha512",
                        "ecdsap256sha256",
                        "ecdsap384sha384",
                      ],
                      description:
                        "String mnemonic specifying the DNSSEC algorithm of this key.",
                    },
                    keyLength: {
                      type: "integer",
                      description:
                        "Length of the keys in bits. (Format: uint32)",
                    },
                  },
                  description:
                    "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
                  additionalProperties: true,
                },
                description:
                  "DNSSEC algorithm and key length types that can be used for DnsKeys.",
              },
              gkeClustersPerPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters per policy. (Format: int32)",
              },
              totalRrdataSizePerChange: {
                type: "integer",
                description:
                  "Maximum allowed size for total rrdata in one ChangesCreateRequest in bytes. (Format: int32)",
              },
              itemsPerRoutingPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of items per routing policy. (Format: int32)",
              },
              networksPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of networks per response policy. (Format: int32)",
              },
              targetNameServersPerPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of alternative target name servers per policy. (Format: int32)",
              },
              policies: {
                type: "integer",
                description:
                  "Maximum allowed number of policies per project. (Format: int32)",
              },
              managedZonesPerNetwork: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones which can be attached to a network. (Format: int32)",
              },
              internetHealthChecksPerManagedZone: {
                type: "integer",
                description: "Format: int32",
              },
              kind: {
                type: "string",
              },
            },
            description: "Limits associated with a Project.",
            additionalProperties: true,
          },
          id: {
            type: "string",
            description:
              "User assigned unique identifier for the resource (output only).",
          },
          kind: {
            type: "string",
          },
          number: {
            type: "string",
            description:
              "Unique numeric identifier for the resource; defined by the server (output only). (Format: uint64)",
          },
        },
        description:
          "A project resource. The project is a top level container for resources including Cloud DNS ManagedZones. Projects can be created only in the APIs console.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
