import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const objectsWatchAll: AppBlock = {
  name: "Objects - Watch All",
  description: `Watch for changes on all objects in a bucket.`,
  category: "Objects",
  inputs: {
    default: {
      config: {
        bucket: {
          name: "Bucket",
          description: "Name of the bucket in which to look for objects.",
          type: {
            type: "string",
          },
          required: true,
        },
        delimiter: {
          name: "Delimiter",
          description:
            "Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.",
          type: {
            type: "string",
          },
          required: false,
        },
        endOffset: {
          name: "End Offset",
          description:
            "Filter results to objects whose names are lexicographically before endOffset. If startOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
          type: {
            type: "string",
          },
          required: false,
        },
        includeTrailingDelimiter: {
          name: "Include Trailing Delimiter",
          description:
            "If true, objects that end in exactly one instance of delimiter will have their metadata included in items in addition to prefixes.",
          type: {
            type: "boolean",
          },
          required: false,
        },
        maxResults: {
          name: "Max Results",
          description:
            "Maximum number of items plus prefixes to return in a single page of responses. As duplicate prefixes are omitted, fewer total results may be returned than requested. The service will use this parameter or 1,000 items, whichever is smaller.",
          type: {
            type: "integer",
          },
          required: false,
        },
        pageToken: {
          name: "Page Token",
          description:
            "A previously-returned page token representing part of the larger set of results to view.",
          type: {
            type: "string",
          },
          required: false,
        },
        prefix: {
          name: "Prefix",
          description:
            "Filter results to objects whose names begin with this prefix.",
          type: {
            type: "string",
          },
          required: false,
        },
        projection: {
          name: "Projection",
          description: "Set of properties to return. Defaults to noAcl.",
          type: {
            type: "string",
            enum: ["full", "noAcl"],
          },
          required: false,
        },
        startOffset: {
          name: "Start Offset",
          description:
            "Filter results to objects whose names are lexicographically equal to or after startOffset. If endOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
          type: {
            type: "string",
          },
          required: false,
        },
        userProject: {
          name: "User Project",
          description:
            "The project to be billed for this request. Required for Requester Pays buckets.",
          type: {
            type: "string",
          },
          required: false,
        },
        versions: {
          name: "Versions",
          description:
            "If true, lists all versions of an object as distinct results. The default is false. For more information, see [Object Versioning](https://cloud.google.com/storage/docs/object-versioning).",
          type: {
            type: "boolean",
          },
          required: false,
        },
        address: {
          name: "Address",
          description:
            "The address where notifications are delivered for this channel.",
          type: {
            type: "string",
            description:
              "The address where notifications are delivered for this channel.",
          },
          required: false,
        },
        expiration: {
          name: "Expiration",
          description:
            "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds.",
          type: {
            type: "string",
            description:
              "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional. (Format: int64)",
          },
          required: false,
        },
        id: {
          name: "ID",
          description:
            "A UUID or similar unique string that identifies this channel.",
          type: {
            type: "string",
            description:
              "A UUID or similar unique string that identifies this channel.",
          },
          required: false,
        },
        kind: {
          name: "Kind",
          description:
            'Identifies this as a notification channel used to watch for changes to a resource, which is "api#channel".',
          type: {
            type: "string",
            description:
              'Identifies this as a notification channel used to watch for changes to a resource, which is "api#channel".',
          },
          required: false,
        },
        params: {
          name: "Params",
          description:
            "Additional parameters controlling delivery channel behavior.",
          type: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Additional parameters controlling delivery channel behavior. Optional.",
          },
          required: false,
        },
        payload: {
          name: "Payload",
          description: "A Boolean value to indicate whether payload is wanted.",
          type: {
            type: "boolean",
            description:
              "A Boolean value to indicate whether payload is wanted. Optional.",
          },
          required: false,
        },
        resourceId: {
          name: "Resource ID",
          description:
            "An opaque ID that identifies the resource being watched on this channel.",
          type: {
            type: "string",
            description:
              "An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.",
          },
          required: false,
        },
        resourceUri: {
          name: "Resource Uri",
          description:
            "A version-specific identifier for the watched resource.",
          type: {
            type: "string",
            description:
              "A version-specific identifier for the watched resource.",
          },
          required: false,
        },
        token: {
          name: "Token",
          description:
            "An arbitrary string delivered to the target address with each notification delivered over this channel.",
          type: {
            type: "string",
            description:
              "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
          },
          required: false,
        },
        type: {
          name: "Type",
          description: "The type of delivery mechanism used for this channel.",
          type: {
            type: "string",
            description:
              "The type of delivery mechanism used for this channel.",
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
              "https://www.googleapis.com/auth/devstorage.full_control",
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/devstorage.read_write",
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
        const baseUrl = "https://storage.googleapis.com/storage/v1/";
        let path = `b/{bucket}/o/watch`;

        // Replace project placeholders with config value
        path = path.replace(
          /\{\+?project(s|Id)?\}/g,
          input.app.config.projectId,
        );

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        };

        // Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};

        if (input.event.inputConfig.address !== undefined)
          requestBody.address = input.event.inputConfig.address;
        if (input.event.inputConfig.expiration !== undefined)
          requestBody.expiration = input.event.inputConfig.expiration;
        if (input.event.inputConfig.id !== undefined)
          requestBody.id = input.event.inputConfig.id;
        if (input.event.inputConfig.kind !== undefined)
          requestBody.kind = input.event.inputConfig.kind;
        if (input.event.inputConfig.params !== undefined)
          requestBody.params = input.event.inputConfig.params;
        if (input.event.inputConfig.payload !== undefined)
          requestBody.payload = input.event.inputConfig.payload;
        if (input.event.inputConfig.resourceId !== undefined)
          requestBody.resourceId = input.event.inputConfig.resourceId;
        if (input.event.inputConfig.resourceUri !== undefined)
          requestBody.resourceUri = input.event.inputConfig.resourceUri;
        if (input.event.inputConfig.token !== undefined)
          requestBody.token = input.event.inputConfig.token;
        if (input.event.inputConfig.type !== undefined)
          requestBody.type = input.event.inputConfig.type;

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `GCP API error: ${response.status} ${response.statusText}: ${errorBody}`,
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
          address: {
            type: "string",
            description:
              "The address where notifications are delivered for this channel.",
          },
          expiration: {
            type: "string",
            description:
              "Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional. (Format: int64)",
          },
          id: {
            type: "string",
            description:
              "A UUID or similar unique string that identifies this channel.",
          },
          kind: {
            type: "string",
            description:
              'Identifies this as a notification channel used to watch for changes to a resource, which is "api#channel".',
          },
          params: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            description:
              "Additional parameters controlling delivery channel behavior. Optional.",
          },
          payload: {
            type: "boolean",
            description:
              "A Boolean value to indicate whether payload is wanted. Optional.",
          },
          resourceId: {
            type: "string",
            description:
              "An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.",
          },
          resourceUri: {
            type: "string",
            description:
              "A version-specific identifier for the watched resource.",
          },
          token: {
            type: "string",
            description:
              "An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.",
          },
          type: {
            type: "string",
            description:
              "The type of delivery mechanism used for this channel.",
          },
        },
        description:
          "An notification channel used to watch for resource changes.",
        additionalProperties: true,
      },
    },
  },
};

export default objectsWatchAll;
