/**
 * Type definitions for the REST-based Compute Engine generator.
 * Re-exports shared types from the gRPC generator.
 */

export {
  FieldBehavior,
  type ParsedEnumValue,
  type ParsedEnum,
  type ParsedField,
  type ParsedOneofGroup,
  type ParsedMessage,
  type ParsedRPC,
  type ParsedService,
  type ParsedProtoResult,
  type GeneratedBlock,
} from "../grpc/types.ts";

export interface HttpAnnotation {
  /** HTTP method: "get", "post", "delete", "patch", "put" */
  method: string;
  /** URL path template, e.g. "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}" */
  pathTemplate: string;
  /** Body field name from proto (e.g. "instance_resource"), or null for no body */
  bodyField: string | null;
}

export interface ComputeAppConfig {
  /** Human-readable title (e.g. "Compute Engine - Instances") */
  title: string;
  /** Output directory (e.g. "generated/compute-instances") */
  outputDir: string;
  /** Proto service names to include in this app (e.g. ["Instances", "InstanceGroups"]) */
  services: string[];
}

export interface ComputeGeneratedBlock {
  blockName: string;
  humanName: string;
  category: string;
  categoryDir: string;
  fileName: string;
  serviceName: string;
  rpcName: string;
  rpc: import("../grpc/types.ts").ParsedRPC;
  httpAnnotation: HttpAnnotation;
  /** Path parameter names from URL template (e.g. ["project", "zone", "instance"]) */
  pathParams: string[];
  /** Query parameter field names (snake_case, from request message) */
  queryParams: string[];
  /** Body field name in request message (e.g. "instance_resource"), or null */
  bodyFieldName: string | null;
}
