import { AppBlock, events } from "@slflows/sdk/v1";
import { computeFetch } from "../../lib/restClient.ts";

const get: AppBlock = {
  name: "Region Ssl Certificates - Get",
  description: `Returns the specified Zone resource.`,
  category: "Region Ssl Certificates",
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
        ssl_certificate: {
          name: "Ssl Certificate",
          description: "Name of the SslCertificate resource to return.",
          type: {
            type: "string",
          },
          required: true,
        },
      },
      onEvent: async (input) => {
        const pathParams: Record<string, string> = {};
        pathParams.project = input.app.config.projectId as string;
        if (input.event.inputConfig.region !== undefined)
          pathParams["region"] = String(input.event.inputConfig.region);
        if (input.event.inputConfig.ssl_certificate !== undefined)
          pathParams["ssl_certificate"] = String(
            input.event.inputConfig.ssl_certificate,
          );

        const result = await computeFetch({
          config: input.app.config,
          method: "GET",
          pathTemplate:
            "/compute/v1/projects/{project}/regions/{region}/sslCertificates/{ssl_certificate}",
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
          certificate: {
            type: "string",
            description:
              "A value read into memory from a certificate file. The certificate file must be in PEM format. The certificate chain must be no greater than 5 certs long. The chain must include at least one intermediate cert.",
          },
          creation_timestamp: {
            type: "string",
            description:
              "[Output Only] Creation timestamp inRFC3339 text format.",
          },
          description: {
            type: "string",
            description:
              "An optional description of this resource. Provide this property when you create the resource.",
          },
          expire_time: {
            type: "string",
            description:
              "Output only. [Output Only] Expire time of the certificate. RFC3339",
          },
          id: {
            type: "string",
            description: "64-bit integer as string",
          },
          kind: {
            type: "string",
            description:
              "Output only. [Output Only] Type of the resource. Alwayscompute#sslCertificate for SSL certificates.",
          },
          managed: {
            type: "object",
            properties: {
              domain_status: {
                type: "object",
                additionalProperties: {
                  type: "string",
                },
                description:
                  "Output only. [Output only] Detailed statuses of the domains specified for managed certificate resource.",
              },
              domains: {
                type: "array",
                items: {
                  type: "string",
                },
                description:
                  "The domains for which a managed SSL certificate will be generated. Each Google-managed SSL certificate supports up to the [maximum number of domains per Google-managed SSL certificate](/load-balancing/docs/quotas#ssl_certificates).",
              },
              status: {
                type: "string",
                description:
                  "Output only. [Output only] Status of the managed certificate resource. Check the Status enum for the list of possible values.",
              },
            },
            description:
              "Configuration and status of a managed SSL certificate.",
            additionalProperties: true,
          },
          name: {
            type: "string",
            description:
              "Name of the resource. Provided by the client when the resource is created. The name must be 1-63 characters long, and comply withRFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
          },
          private_key: {
            type: "string",
            description:
              "A value read into memory from a write-only private key file. The private key file must be in PEM format. For security, only insert requests include this field.",
          },
          region: {
            type: "string",
            description:
              "Output only. [Output Only] URL of the region where the regional SSL Certificate resides. This field is not applicable to global SSL Certificate.",
          },
          self_link: {
            type: "string",
            description: "[Output only] Server-defined URL for the resource.",
          },
          self_managed: {
            type: "object",
            properties: {
              certificate: {
                type: "string",
                description:
                  "A local certificate file. The certificate must be in PEM format. The certificate chain must be no greater than 5 certs long. The chain must include at least one intermediate cert.",
              },
              private_key: {
                type: "string",
                description:
                  "A write-only private key in PEM format. Only insert requests will include this field.",
              },
            },
            description:
              "Configuration and status of a self-managed SSL certificate.",
            additionalProperties: true,
          },
          subject_alternative_names: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Output only. [Output Only] Domains associated with the certificate via Subject Alternative Name.",
          },
          type: {
            type: "string",
            description:
              '(Optional) Specifies the type of SSL certificate, either "SELF_MANAGED" or "MANAGED". If not specified, the certificate is self-managed and the fieldscertificate and private_key are used. Check the Type enum for the list of possible values.',
          },
        },
        description:
          "Represents an SSL certificate resource.  Google Compute Engine has two SSL certificate resources:  * [Global](/compute/docs/reference/rest/v1/sslCertificates) * [Regional](/compute/docs/reference/rest/v1/regionSslCertificates)   The global SSL certificates (sslCertificates) are used by:     - Global external Application Load Balancers    - Classic Application Load Balancers    - Proxy Network Load Balancers (with target SSL proxies)    The regional SSL certificates (regionSslCertificates) are used by:     - Regional external Application Load Balancers    - Regional internal Application Load Balancers    Optionally, certificate file contents that you upload can contain a set of up to five PEM-encoded certificates. The API call creates an object (sslCertificate) that holds this data. You can use SSL keys and certificates to secure connections to a load balancer. For more information, read Creating and using SSL certificates,SSL certificates quotas and limits, and Troubleshooting SSL certificates.",
        additionalProperties: true,
      },
    },
  },
};

export default get;
