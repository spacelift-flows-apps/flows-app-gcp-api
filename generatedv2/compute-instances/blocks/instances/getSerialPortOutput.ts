import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const getSerialPortOutput: AppBlock = {
  name: "Instances - Get Serial Port Output",
  description: `Returns the last 1 MB of serial port output from the specified instance.`,
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
          description: "Name of the instance for this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        port: {
          name: "Port",
          description:
            "Specifies which COM or serial port to retrieve data from.",
          type: {
            type: "string",
          },
          required: false,
        },
        start: {
          name: "Start",
          description:
            "Specifies the starting byte position of the output to return. To start with the first byte of output to the specified port, omit this field or set it to `0`.  If the output for that byte position is available, this field matches the `start` parameter sent with the request. If the amount of serial console output exceeds the size of the buffer (1 MB), the oldest output is discarded and is no longer available. If the requested start position refers to discarded output, the start position is adjusted to the oldest output still available, and the adjusted start position is returned as the `start` property value.  You can also provide a negative start position, which translates to the most recent number of bytes written to the serial port. For example, -3 is interpreted as the most recent 3 bytes written to the serial console. Note that the negative start is bounded by the retained buffer size, and the returned serial console output will not exceed the max buffer size.",
          type: {
            type: "string",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.zone !== undefined)
          pathParams["zone"] = String(input.event.inputConfig.zone);
        if (input.event.inputConfig.instance !== undefined)
          pathParams["instance"] = String(input.event.inputConfig.instance);

        const queryParams: Record<string, string> = {};
        if (input.event.inputConfig.port !== undefined)
          queryParams["port"] = String(input.event.inputConfig.port);
        if (input.event.inputConfig.start !== undefined)
          queryParams["start"] = String(input.event.inputConfig.start);

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}/serialPort",
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
          contents: {
            type: "string",
            description: "[Output Only] The contents of the console output.",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#serialPortOutput for serial port output.",
          },
          next: {
            type: "string",
            description: "64-bit integer as string",
          },
          selfLink: {
            type: "string",
            description:
              "Output only. [Output Only] Server-defined URL for this resource.",
          },
          start: {
            type: "string",
            description: "64-bit integer as string",
          },
        },
        description: "An instance serial console output.",
        additionalProperties: true,
      },
    },
  },
};

export default getSerialPortOutput;
