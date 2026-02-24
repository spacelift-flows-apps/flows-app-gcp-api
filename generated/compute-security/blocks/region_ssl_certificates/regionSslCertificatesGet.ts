import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const regionSslCertificatesGet: AppBlock = {
  name: "Region SSL Certificates - Get",
  description: `Returns the specified SslCertificate resource in the specified region.`,
  category: "Region SSL Certificates",
  inputs: {
    default: {
      config: {
        region: {
          name: "Region",
          description: "Name of the region scoping this request.",
          type: {
            type: "string",
          },
          required: true,
        },
        sslCertificate: {
          name: "SSL Certificate",
          description: "Name of the SslCertificate resource to return.",
          type: {
            type: "string",
          },
          required: true,
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
              "https://www.googleapis.com/auth/compute",
              "https://www.googleapis.com/auth/compute.readonly",
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
        const baseUrl = "https://compute.googleapis.com/compute/v1/";
        let path = `projects/{project}/regions/{region}/sslCertificates/{sslCertificate}`;

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
          creationTimestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339\ntext format.",
          },
          type: {
            type: "string",
            enum: ["MANAGED", "SELF_MANAGED", "TYPE_UNSPECIFIED"],
            description:
              '(Optional) Specifies the type of SSL certificate, either "SELF_MANAGED" or\n"MANAGED". If not specified, the certificate is self-managed and the fieldscertificate and private_key are used.',
          },
          managed: {
            type: "object",
            properties: {
              status: {
                type: "string",
                enum: [
                  "ACTIVE",
                  "MANAGED_CERTIFICATE_STATUS_UNSPECIFIED",
                  "PROVISIONING",
                  "PROVISIONING_FAILED",
                  "PROVISIONING_FAILED_PERMANENTLY",
                  "RENEWAL_FAILED",
                ],
                description:
                  "[Output only] Status of the managed certificate resource.",
              },
              domains: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The domains for which a managed SSL certificate will be generated. Each\nGoogle-managed SSL certificate supports up to the [maximum number of\ndomains per Google-managed SSL\ncertificate](/load-balancing/docs/quotas#ssl_certificates).",
              },
              domainStatus: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "[Output only] Detailed statuses of the domains specified for managed\ncertificate resource.",
              },
            },
            description:
              "Configuration and status of a managed SSL certificate.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created.\nThe name must be 1-63 characters long, and comply withRFC1035.\nSpecifically, the name must be 1-63 characters long and match the regular\nexpression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first\ncharacter must be a lowercase letter, and all following characters must\nbe a dash, lowercase letter, or digit, except the last character, which\ncannot be a dash.",
          },
          subjectAlternativeNames: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "[Output Only] Domains associated with the certificate via Subject\nAlternative Name.",
          },
          expireTime: {
            type: "string",
            description:
              "[Output Only] Expire time of the certificate. RFC3339",
          },
          selfManaged: {
            type: "object",
            properties: {
              privateKey: {
                type: "string",
                description:
                  "A write-only private key in PEM format. Only insert\nrequests will include this field.",
              },
              certificate: {
                type: "string",
                description:
                  "A local certificate file. The certificate must be in\nPEM format. The certificate chain must be no greater than 5 certs\nlong. The chain must include at least one intermediate cert.",
              },
            },
            description:
              "Configuration and status of a self-managed SSL certificate.",
            additionalProperties: true,
          },
          kind: {
            type: "string",
            description:
              "[Output Only] Type of the resource. Alwayscompute#sslCertificate for SSL certificates.",
          },
          privateKey: {
            type: "string",
            description:
              "A value read into memory from a write-only private key file. The private\nkey file must be in PEM format. For security, only insert\nrequests include this field.",
          },
          region: {
            type: "string",
            description:
              "[Output Only] URL of the region where the regional SSL Certificate\nresides. This field is not applicable to global SSL Certificate.",
          },
          id: {
            type: "string",
            description:
              "[Output Only] The unique identifier for the resource. This identifier is\ndefined by the server. (Format: uint64)",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you\ncreate the resource.",
          },
          selfLink: {
            type: "string",
            description: "[Output only] Server-defined URL for the resource.",
          },
          certificate: {
            type: "string",
            description:
              "A value read into memory from a certificate file. The certificate file must\nbe in PEM format. The certificate chain must be no greater than 5 certs\nlong. The chain must include at least one intermediate cert.",
          },
        },
        description:
          "Represents an SSL certificate resource.\n\nGoogle Compute Engine has two SSL certificate resources:\n\n* [Global](/compute/docs/reference/rest/v1/sslCertificates)\n* [Regional](/compute/docs/reference/rest/v1/regionSslCertificates)\n\n\nThe global SSL certificates (sslCertificates) are used by:\n   \n   - Global external Application Load Balancers\n   - Classic Application Load Balancers\n   - Proxy Network Load Balancers (with target SSL proxies)\n\n\n\nThe regional SSL certificates (regionSslCertificates) are used\nby:\n   \n   - Regional external Application Load Balancers\n   - Regional internal Application Load Balancers\n\n\n\nOptionally, certificate file contents that you upload can contain a set of up\nto five PEM-encoded certificates.\nThe API call creates an object (sslCertificate) that holds this data.\nYou can use SSL keys and certificates to secure connections to a load\nbalancer.\nFor more information, read \nCreating and using SSL certificates,SSL certificates\nquotas and limits, and\nTroubleshooting SSL certificates.",
        additionalProperties: true,
      },
    },
  },
};

export default regionSslCertificatesGet;
