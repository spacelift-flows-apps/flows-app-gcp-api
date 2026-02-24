import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const dnsKeysList: AppBlock = {
  name: "DNS Keys - List",
  description: `Enumerates DnsKeys to a ResourceRecordSet collection.`,
  category: "DNS Keys",
  inputs: {
    default: {
      config: {
        managedZone: {
          name: "Managed Zone",
          description:
            "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
          type: {
            type: "string",
          },
          required: true,
        },
        maxResults: {
          name: "Max Results",
          description:
            "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
          type: {
            type: "integer",
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
        pageToken: {
          name: "Page Token",
          description:
            "Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.",
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
        let path = `dns/v1/projects/{project}/managedZones/{managedZone}/dnsKeys`;

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
            description: "Type of resource.",
          },
          dnsKeys: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description:
                    "Unique identifier for the resource; defined by the server (output only).",
                },
                publicKey: {
                  type: "string",
                  description:
                    "Base64 encoded public half of this key. Output only.",
                },
                keyLength: {
                  type: "integer",
                  description:
                    "Length of the key in bits. Specified at creation time, and then immutable. (Format: uint32)",
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
                    "The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only. (Format: int32)",
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
              description: "A DNSSEC key pair.",
              additionalProperties: true,
            },
            description: "The requested resources.",
          },
          nextPageToken: {
            type: "string",
            description:
              "This field indicates that more results are available beyond the last page displayed. To fetch the results, make another list request and use this value as your page token. This lets you retrieve the complete contents of a very large collection one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You can't retrieve a consistent snapshot of a collection larger than the maximum page size.",
          },
        },
        description:
          "The response to a request to enumerate DnsKeys in a ManagedZone.",
        additionalProperties: true,
      },
    },
  },
};

export default dnsKeysList;
