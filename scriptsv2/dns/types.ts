/**
 * Type definitions for the DNS discovery document generator.
 */

/** GCP Discovery Document structure (subset relevant for generation). */
export interface DiscoveryDocument {
  name: string;
  version: string;
  title: string;
  description: string;
  baseUrl: string;
  rootUrl: string;
  servicePath: string;
  schemas?: Record<string, DiscoverySchema>;
  resources?: Record<string, DiscoveryResource>;
  parameters?: Record<string, DiscoveryParameter>;
}

export interface DiscoveryResource {
  methods?: Record<string, DiscoveryMethod>;
  resources?: Record<string, DiscoveryResource>;
}

export interface DiscoveryMethod {
  id: string;
  path: string;
  httpMethod: string;
  description?: string;
  parameters?: Record<string, DiscoveryParameter>;
  parameterOrder?: string[];
  request?: { $ref: string };
  response?: { $ref: string };
  scopes?: string[];
}

export interface DiscoveryParameter {
  type: string;
  description?: string;
  required?: boolean;
  location?: string;
  enum?: string[];
  enumDescriptions?: string[];
  default?: any;
  format?: string;
}

export interface DiscoverySchema {
  id?: string;
  type: string;
  description?: string;
  properties?: Record<string, DiscoverySchema>;
  items?: DiscoverySchema;
  required?: string[];
  additionalProperties?: boolean | DiscoverySchema;
  enum?: string[];
  enumDescriptions?: string[];
  $ref?: string;
  readOnly?: boolean;
  format?: string;
  default?: any;
}

/** Parsed method ready for block generation. */
export interface ParsedMethod {
  /** Discovery method ID (e.g. "dns.managedZones.create") */
  id: string;
  /** Resource name (e.g. "managedZones") */
  resourceName: string;
  /** Method name (e.g. "create") */
  methodName: string;
  /** HTTP method (e.g. "GET", "POST") */
  httpMethod: string;
  /** URL path template (e.g. "dns/v1/projects/{project}/managedZones") */
  path: string;
  /** Description of the method */
  description: string;
  /** Path parameters (location: "path") excluding project */
  pathParams: DiscoveryParameter[];
  /** Query parameters (location: "query") */
  queryParams: DiscoveryParameter[];
  /** Request body schema name ($ref), or null */
  requestSchemaRef: string | null;
  /** Response body schema name ($ref), or null */
  responseSchemaRef: string | null;
}

/** App configuration for the DNS generator. */
export interface DnsAppConfig {
  /** Human-readable title */
  title: string;
  /** Output directory */
  outputDir: string;
  /** Path to the discovery document JSON */
  discoveryDocPath: string;
}

/** Generated block metadata. */
export interface DnsGeneratedBlock {
  blockName: string;
  humanName: string;
  category: string;
  categoryDir: string;
  fileName: string;
  method: ParsedMethod;
}
