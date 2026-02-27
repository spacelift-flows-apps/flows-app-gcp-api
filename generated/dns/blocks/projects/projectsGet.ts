import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const projectsGet: AppBlock = {
  name: "Projects - Get",
  description: `Fetches the representation of an existing Project.`,
  category: "Projects",
  inputs: {
    default: {
      config: {
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate: "dns/v1/projects/{project}",
          pathParams,
          queryParams,
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
          quota: {
            type: "object",
            properties: {
              gkeClustersPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters to which a privately scoped zone can be attached.",
              },
              rrsetsPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets per zone in the project.",
              },
              networksPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of networks to which a privately scoped zone can be attached.",
              },
              rrsetDeletionsPerChange: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets to delete per ChangesCreateRequest.",
              },
              gkeClustersPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters per response policy.",
              },
              managedZones: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones in the project.",
              },
              responsePolicyRulesPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of rules per response policy.",
              },
              targetNameServersPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of target name servers per managed forwarding zone.",
              },
              rrsetAdditionsPerChange: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecordSets to add per ChangesCreateRequest.",
              },
              managedZonesPerGkeCluster: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones which can be attached to a GKE cluster.",
              },
              dnsKeysPerManagedZone: {
                type: "integer",
                description:
                  "Maximum allowed number of DnsKeys per ManagedZone.",
              },
              nameserversPerDelegation: {
                type: "integer",
                description:
                  "Maximum number of nameservers per delegation, meant to prevent abuse",
              },
              peeringZonesPerTargetNetwork: {
                type: "integer",
                description:
                  "Maximum allowed number of consumer peering zones per target network owned by this producer project",
              },
              resourceRecordsPerRrset: {
                type: "integer",
                description:
                  "Maximum allowed number of ResourceRecords per ResourceRecordSet.",
              },
              responsePolicies: {
                type: "integer",
                description:
                  "Maximum allowed number of response policies per project.",
              },
              networksPerPolicy: {
                type: "integer",
                description: "Maximum allowed number of networks per policy.",
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
                      description: "Length of the keys in bits.",
                    },
                  },
                  additionalProperties: true,
                  description:
                    "Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.",
                },
                description:
                  "DNSSEC algorithm and key length types that can be used for DnsKeys.",
              },
              gkeClustersPerPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of GKE clusters per policy.",
              },
              totalRrdataSizePerChange: {
                type: "integer",
                description:
                  "Maximum allowed size for total rrdata in one ChangesCreateRequest in bytes.",
              },
              itemsPerRoutingPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of items per routing policy.",
              },
              networksPerResponsePolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of networks per response policy.",
              },
              targetNameServersPerPolicy: {
                type: "integer",
                description:
                  "Maximum allowed number of alternative target name servers per policy.",
              },
              policies: {
                type: "integer",
                description: "Maximum allowed number of policies per project.",
              },
              managedZonesPerNetwork: {
                type: "integer",
                description:
                  "Maximum allowed number of managed zones which can be attached to a network.",
              },
              internetHealthChecksPerManagedZone: {
                type: "integer",
              },
              kind: {
                type: "string",
              },
            },
            additionalProperties: true,
            description: "Limits associated with a Project.",
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
              "Unique numeric identifier for the resource; defined by the server (output only).",
          },
        },
        additionalProperties: true,
        description:
          "A project resource. The project is a top level container for resources including Cloud DNS ManagedZones. Projects can be created only in the APIs console.",
      },
    },
  },
};

export default projectsGet;
