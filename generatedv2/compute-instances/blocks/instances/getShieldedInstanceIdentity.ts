import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getShieldedInstanceIdentity: AppBlock = {
  name: "Instances - Get Shielded Instance Identity",
  description: `Returns the Shielded Instance Identity of an instance`,
  category: "Instances",
  inputs: {
    default: {
      config: {
        zone: {
          name: "Zone",
          description: "The name of the zone for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        instance: {
          name: "Instance",
          description: "Name or id of the instance scoping this request.",
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
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/getShieldedInstanceIdentity",
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
          eccP256EncryptionKey: {
            type: "object",
            properties: {
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          eccP256SigningKey: {
            type: "object",
            properties: {
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          encryptionKey: {
            type: "object",
            properties: {
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#shieldedInstanceIdentity for shielded Instance identity entry.",
          },
          signingKey: {
            type: "object",
            properties: {
              ekCert: {
                type: "string",
                description:
                  "A PEM-encoded X.509 certificate. This field can be empty.",
              },
              ekPub: {
                type: "string",
                description: "A PEM-encoded public key.",
              },
            },
            description: "A Shielded Instance Identity Entry.",
            additionalProperties: true,
          },
        },
        description: "A Shielded Instance Identity.",
        additionalProperties: true,
      },
    },
  },
};

export default getShieldedInstanceIdentity;
