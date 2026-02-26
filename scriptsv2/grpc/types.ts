/**
 * Internal type definitions for the proto-based GCP Flows app generator.
 */

export enum FieldBehavior {
  OPTIONAL = "OPTIONAL",
  REQUIRED = "REQUIRED",
  OUTPUT_ONLY = "OUTPUT_ONLY",
  INPUT_ONLY = "INPUT_ONLY",
  IMMUTABLE = "IMMUTABLE",
}

export interface ParsedEnumValue {
  name: string;
  number: number;
  comment?: string;
}

export interface ParsedEnum {
  name: string;
  fullName: string;
  values: ParsedEnumValue[];
  comment?: string;
}

export interface ParsedField {
  name: string;
  /** JSON-friendly camelCase name */
  jsonName: string;
  /** Proto type string (e.g. "string", "int32", "google.pubsub.v1.Topic") */
  protoType: string;
  /** True if this is a message type (not scalar/enum) */
  isMessage: boolean;
  /** True if this is an enum type */
  isEnum: boolean;
  /** True if repeated */
  isRepeated: boolean;
  /** True if this is a map field */
  isMap: boolean;
  /** For map fields: key type */
  mapKeyType?: string;
  /** For map fields: value type (proto type string) */
  mapValueType?: string;
  /** For map fields: whether value is a message */
  mapValueIsMessage?: boolean;
  /** Field behaviors from google.api.field_behavior */
  behaviors: FieldBehavior[];
  /** Proto field comment */
  comment?: string;
  /** The oneof group this field belongs to, if any */
  oneofGroup?: string;
  /** Resolved message type (if isMessage) */
  resolvedType?: ParsedMessage;
  /** Resolved enum type (if isEnum) */
  resolvedEnum?: ParsedEnum;
}

export interface ParsedOneofGroup {
  name: string;
  fields: string[];
}

export interface ParsedMessage {
  name: string;
  fullName: string;
  fields: ParsedField[];
  oneofs: ParsedOneofGroup[];
  comment?: string;
  /** Nested message types */
  nestedMessages: ParsedMessage[];
  /** Nested enum types */
  nestedEnums: ParsedEnum[];
}

export interface RoutingParameter {
  /** The routing header key (e.g., "project", "bucket") */
  key: string;
  /** The request field path in proto snake_case (e.g., "parent", "bucket.project") */
  fieldPath: string;
  /** Optional extraction pattern (e.g., "projects/*/buckets/*"). Absent means use entire value. */
  extractPattern?: string;
}

export interface ParsedRPC {
  name: string;
  /** Fully qualified name (e.g. "google.pubsub.v1.Publisher.CreateTopic") */
  fullName: string;
  /** Service this RPC belongs to */
  serviceName: string;
  /** Request message type */
  requestType: ParsedMessage;
  /** Response message type */
  responseType: ParsedMessage;
  /** True if client-streaming */
  requestStream: boolean;
  /** True if server-streaming */
  responseStream: boolean;
  /** RPC comment/description */
  comment?: string;
  /** Routing parameters for x-goog-request-params header */
  routingParameters: RoutingParameter[];
}

export interface ParsedService {
  name: string;
  fullName: string;
  /** gRPC host (e.g. "pubsub.googleapis.com") */
  host?: string;
  /** OAuth scopes */
  scopes?: string[];
  /** All RPCs in this service */
  rpcs: ParsedRPC[];
  comment?: string;
}

export interface ParsedProtoResult {
  /** All services found */
  services: ParsedService[];
  /** All message types (by full name) */
  messages: Map<string, ParsedMessage>;
  /** All enum types (by full name) */
  enums: Map<string, ParsedEnum>;
  /** Compiled FileDescriptorSet JSON for runtime proto loading */
  descriptorSetJson: any;
}

export interface ServiceConfig {
  /** Proto files to load (relative to project root) */
  protoFiles: string[];
  /** Proto directories — all .proto files in these dirs will be included */
  protoDirs?: string[];
  /** gRPC host (e.g. "pubsub.googleapis.com") */
  host: string;
  /** App title (e.g. "Cloud Pub/Sub") */
  title: string;
  /** Output directory (e.g. "generatedv2/pubsub") */
  outputDir: string;
}

export interface GeneratedBlock {
  /** Block variable name (e.g. "createTopic") */
  blockName: string;
  /** Human-readable name (e.g. "Topics - Create Topic") */
  humanName: string;
  /** Category (e.g. "Topics") */
  category: string;
  /** Category directory name (e.g. "topics") */
  categoryDir: string;
  /** File name (e.g. "createTopic.ts") */
  fileName: string;
  /** Service name this block calls (e.g. "Publisher") */
  serviceName: string;
  /** RPC method name (e.g. "createTopic" - camelCase for gRPC client) */
  rpcMethodName: string;
  /** The parsed RPC definition */
  rpc: ParsedRPC;
}
