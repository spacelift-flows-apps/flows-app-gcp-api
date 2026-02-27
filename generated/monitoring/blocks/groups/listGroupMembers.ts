import { AppBlock, events } from "@slflows/sdk/v1";
import { getGroupServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  pageSize: "page_size",
  pageToken: "page_token",
  interval: {
    name: "interval",
    fields: {
      endTime: "end_time",
      startTime: "start_time",
    },
  },
};

const outputMapping = {
  next_page_token: "nextPageToken",
  total_size: "totalSize",
};

const listGroupMembers: AppBlock = {
  name: "List Group Members",
  description: `Lists the monitored resources that are members of a group.`,
  category: "Groups",
  inputs: {
    default: {
      config: {
        name: {
          name: "Name",
          description:
            "Required. The group whose members are listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]",
          type: {
            type: "string",
            description:
              "Required. The group whose members are listed. The format is:      projects/[PROJECT_ID_OR_NUMBER]/groups/[GROUP_ID]",
          },
          required: true,
        },
        pageSize: {
          name: "Page Size",
          description:
            "A positive number that is the maximum number of results to return.",
          type: {
            type: "integer",
            description:
              "A positive number that is the maximum number of results to return.",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "If this field is not empty then it must contain the `next_page_token` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          type: {
            type: "string",
            description:
              "If this field is not empty then it must contain the `next_page_token` value returned by a previous call to this method.  Using this field causes the method to return additional results from the previous method call.",
          },
          required: false,
        },
        filter: {
          name: "Filter",
          description:
            'An optional [list filter](https://cloud.google.com/monitoring/api/learn_more#filtering) describing the members to be returned.  The filter may reference the type, labels, and metadata of monitored resources that comprise the group. For example, to return only resources representing Compute Engine VM instances, use this filter:      `resource.type = "gce_instance"`',
          type: {
            type: "string",
            description:
              'An optional [list filter](https://cloud.google.com/monitoring/api/learn_more#filtering) describing the members to be returned.  The filter may reference the type, labels, and metadata of monitored resources that comprise the group. For example, to return only resources representing Compute Engine VM instances, use this filter:      `resource.type = "gce_instance"`',
          },
          required: false,
        },
        interval: {
          name: "Interval",
          description:
            "An optional time interval for which results should be returned. Only members that were part of the group during the specified interval are included in the response.  If no interval is provided then the group membership over the last minute is returned.",
          type: {
            type: "object",
            properties: {
              endTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
              startTime: {
                type: "string",
                description: "RFC3339 timestamp (e.g., '2024-01-15T10:30:00Z')",
              },
            },
            description:
              "Describes a time interval:    * Reads: A half-open time interval. It includes the end time but     excludes the start time: `(startTime, endTime]`. The start time     must be specified, must be earlier than the end time, and should be     no older than the data retention period for the metric.   * Writes: A closed time interval. It extends from the start time to the end   time,     and includes both: `[startTime, endTime]`. Valid time intervals     depend on the     [`MetricKind`](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.metricDescriptors#MetricKind)     of the metric value. The end time must not be earlier than the start     time, and the end time must not be more than 25 hours in the past or more     than five minutes in the future.     * For `GAUGE` metrics, the `startTime` value is technically optional; if       no value is specified, the start time defaults to the value of the       end time, and the interval represents a single point in time. If both       start and end times are specified, they must be identical. Such an       interval is valid only for `GAUGE` metrics, which are point-in-time       measurements. The end time of a new interval must be at least a       millisecond after the end time of the previous interval.     * For `DELTA` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying contiguous and       non-overlapping intervals. For `DELTA` metrics, the start time of       the next interval must be at least a millisecond after the end time       of the previous interval.     * For `CUMULATIVE` metrics, the start time and end time must specify a       non-zero interval, with subsequent points specifying the same       start time and increasing end times, until an event resets the       cumulative value to zero and sets a new start time for the following       points. The new start time must be at least a millisecond after the       end time of the previous interval.     * The start time of a new interval must be at least a millisecond after     the       end time of the previous interval because intervals are closed. If the       start time of a new interval is the same as the end time of the       previous interval, then data written at the new start time could       overwrite data written at the previous end time.",
            additionalProperties: true,
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getGroupServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.listGroupMembers(request, (err: any, response: any) => {
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
          members: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                },
                labels: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              additionalProperties: true,
            },
            description: "A set of monitored resources in the group.",
          },
          nextPageToken: {
            type: "string",
            description:
              "If there are more results than have been returned, then this field is set to a non-empty value.  To see the additional results, use that value as `page_token` in the next call to this method.",
          },
          totalSize: {
            type: "integer",
            description: "The total number of elements matching this request.",
          },
        },
        description: "The `ListGroupMembers` response.",
        additionalProperties: true,
      },
    },
  },
};

export default listGroupMembers;
