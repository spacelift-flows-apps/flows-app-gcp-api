import { AppBlock, events } from "@slflows/sdk/v1";
import { dnsFetch } from "../../lib/restClient.ts";

const dnsKeysGet: AppBlock = {
  name: "DNS Keys - Get",
  description: `Fetches the representation of an existing DnsKey.`,
  category: "DNS Keys",
  inputs: {
    default: {
      config: {
        dnsKeyId: {
          name: "Dns Key Id",
          description: "The identifier of the requested DnsKey.",
          type: {
            type: "string",
          },
          required: true,
        },
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        clientOperationId: {
          name: "Client Operation Id",
          description:
            "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
          type: {
            type: "string",
          },
          required: false,
        },
        digestType: {
          name: "Digest Type",
          description:
            "An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type is computed and displayed.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.dnsKeyId !== undefined)
          pathParams["dnsKeyId"] = String(input.event.inputConfig.dnsKeyId);
        if (input.event.inputConfig.managedZone !== undefined)
          pathParams["managedZone"] = String(
            input.event.inputConfig.managedZone,
          );

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.clientOperationId !== undefined)
          queryParams["clientOperationId"] = String(
            input.event.inputConfig.clientOperationId,
          );
        if (input.event.inputConfig.digestType !== undefined)
          queryParams["digestType"] = String(
            input.event.inputConfig.digestType,
          );

        const result = await dnsFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "dns/v1/projects/{project}/managedZones/{managedZone}/dnsKeys/{dnsKeyId}",
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
          id: {
            type: "string",
            description:
              "Unique identifier for the resource; defined by the server (output only).",
          },
          publicKey: {
            type: "string",
            description: "Base64 encoded public half of this key. Output only.",
          },
          keyLength: {
            type: "integer",
            description:
              "Length of the key in bits. Specified at creation time, and then immutable.",
          },
          kind: {
            type: "string",
          },
          creationTime: {
            type: "string",
            description:
              "The time that this resource was created in the control plane. This is in RFC3339 text format. Output only.",
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
              "String mnemonic specifying the DNSSEC algorithm of this key. Immutable after creation time.",
          },
          description: {
            type: "string",
            description:
              "A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the resource's function.",
          },
          digests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                digest: {
                  type: "string",
                  description:
                    "The base-16 encoded bytes of this digest. Suitable for use in a DS resource record.",
                },
                type: {
                  type: "string",
                  enum: ["sha1", "sha256", "sha384"],
                  description:
                    "Specifies the algorithm used to calculate this digest.",
                },
              },
              additionalProperties: true,
            },
            description:
              "Cryptographic hashes of the DNSKEY resource record associated with this DnsKey. These digests are needed to construct a DS record that points at this DNS key. Output only.",
          },
          keyTag: {
            type: "integer",
            description:
              "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.",
          },
          isActive: {
            type: "boolean",
            description:
              "Active keys are used to sign subsequent changes to the ManagedZone. Inactive keys are still present as DNSKEY Resource Records for the use of resolvers validating existing signatures.",
          },
          type: {
            type: "string",
            enum: ["keySigning", "zoneSigning"],
            description:
              'One of "KEY_SIGNING" or "ZONE_SIGNING". Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, are used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag is cleared, and this key is used to sign only resource record sets of other types. Immutable after creation time.',
          },
        },
        additionalProperties: true,
        description: "A DNSSEC key pair.",
      },
    },
  },
};

export default dnsKeysGet;
