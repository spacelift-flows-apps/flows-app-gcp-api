import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getUptimeCheckServiceClient,
  convertKeys,
} from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
};

const outputMapping = {
  uptime_check_ips: {
    name: "uptimeCheckIps",
    fields: {
      ip_address: "ipAddress",
    },
  },
  next_page_token: "nextPageToken",
};

const listUptimeCheckIps: AppBlock = {
  name: "List Uptime Check Ips",
  description: `Returns the list of IP addresses that checkers run from.`,
  category: "Uptime Checks",
  inputs: {
    default: {
      config: {
        pageSize: {
          name: "Page Size",
          description:
            "The maximum number of results to return in a single response. The server may further constrain the maximum number of results returned in a single page. If the page_size is <=0, the server will decide the number of results to be returned. NOTE: this field is not yet implemented",
          type: {
            type: "integer",
            description:
              "The maximum number of results to return in a single response. The server may further constrain the maximum number of results returned in a single page. If the page_size is <=0, the server will decide the number of results to be returned. NOTE: this field is not yet implemented",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return more results from the previous method call. NOTE: this field is not yet implemented",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `nextPageToken` value returned by a previous call to this method.  Using this field causes the method to return more results from the previous method call. NOTE: this field is not yet implemented",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getUptimeCheckServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listUptimeCheckIps(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
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
          uptimeCheckIps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                region: {
                  type: "string",
                  enum: [
                    "REGION_UNSPECIFIED",
                    "USA",
                    "EUROPE",
                    "SOUTH_AMERICA",
                    "ASIA_PACIFIC",
                    "USA_OREGON",
                    "USA_IOWA",
                    "USA_VIRGINIA",
                  ],
                  description:
                    "The regions from which an Uptime check can be run.",
                },
                location: {
                  type: "string",
                  description:
                    "A more specific location within the region that typically encodes a particular city/town/metro (and its containing state/province or country) within the broader umbrella region category.",
                },
                ipAddress: {
                  type: "string",
                  description:
                    "The IP address from which the Uptime check originates. This is a fully specified IP address (not an IP address range). Most IP addresses, as of this publication, are in IPv4 format; however, one should not rely on the IP addresses being in IPv4 format indefinitely, and should support interpreting this field in either IPv4 or IPv6 format.",
                },
              },
              description:
                "Contains the region, location, and list of IP addresses where checkers in the location run from.",
              additionalProperties: true,
            },
            description:
              "The returned list of IP addresses (including region and location) that the checkers run from.",
          },
          nextPageToken: {
            type: "string",
            description:
              "This field represents the pagination token to retrieve the next page of results. If the value is empty, it means no further results for the request. To retrieve the next page of results, the value of the next_page_token is passed to the subsequent List method call (in the request message's page_token field). NOTE: this field is not yet implemented",
          },
        },
        description: "The protocol for the `ListUptimeCheckIps` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listUptimeCheckIps;
