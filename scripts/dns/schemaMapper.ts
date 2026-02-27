/**
 * Discovery Document schema -> Flows input config / output JSON Schema conversion.
 *
 * Resolves $ref references, handles enums, arrays, nested objects,
 * readOnly fields, and additionalProperties.
 */

import { DiscoveryParameter, DiscoverySchema } from "./types.ts";

const MAX_DEPTH = 8;

/**
 * Convert a discovery schema (by $ref name) to a Flows block input config dict.
 * Excludes readOnly fields since they are output-only.
 */
export function schemaToInputConfig(
  schemaRef: string,
  allSchemas: Record<string, DiscoverySchema>,
): Record<string, any> {
  const schema = allSchemas[schemaRef];
  if (!schema?.properties) return {};

  const config: Record<string, any> = {};

  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    // Skip output-only fields for input config
    if (fieldSchema.readOnly) continue;
    // Skip "kind" field — it's a constant like "dns#managedZone"
    if (fieldName === "kind") continue;

    const fieldType = discoveryFieldToJsonSchema(
      fieldSchema,
      allSchemas,
      new Set(),
      0,
    );
    if (!fieldType) continue;

    const humanName = camelCaseToHumanName(fieldName);
    const isRequired = schema.required?.includes(fieldName) ?? false;

    config[fieldName] = {
      name: humanName,
      description: fieldSchema.description || `${humanName} field.`,
      type: fieldType,
      required: isRequired,
    };
  }

  return config;
}

/**
 * Convert a discovery schema (by $ref name) to a JSON Schema for output.
 * Includes all fields (including readOnly).
 */
export function schemaToOutputSchema(
  schemaRef: string,
  allSchemas: Record<string, DiscoverySchema>,
): any {
  const schema = allSchemas[schemaRef];
  if (!schema) {
    return { type: "object", properties: {}, additionalProperties: true };
  }

  return discoverySchemaToJsonSchema(schema, allSchemas, new Set(), 0);
}

/**
 * Convert a discovery parameter to a Flows input config entry.
 */
export function parameterToInputConfig(
  paramName: string,
  param: DiscoveryParameter,
): any {
  const humanName = camelCaseToHumanName(paramName);
  const schema: any = { type: param.type === "integer" ? "integer" : "string" };

  if (param.enum) {
    schema.enum = param.enum;
  }

  return {
    name: humanName,
    description: param.description || `${humanName} parameter.`,
    type: schema,
    required: param.required ?? false,
  };
}

/**
 * Convert a discovery schema object to a JSON Schema (for output types).
 */
function discoverySchemaToJsonSchema(
  schema: DiscoverySchema,
  allSchemas: Record<string, DiscoverySchema>,
  visited: Set<string>,
  depth: number,
): any {
  if (depth >= MAX_DEPTH) {
    return { type: "object", additionalProperties: true };
  }

  // $ref — resolve and recurse
  if (schema.$ref) {
    if (visited.has(schema.$ref)) {
      return { type: "object", additionalProperties: true };
    }
    const resolved = allSchemas[schema.$ref];
    if (!resolved) {
      return { type: "object", additionalProperties: true };
    }
    visited.add(schema.$ref);
    const result = discoverySchemaToJsonSchema(
      resolved,
      allSchemas,
      visited,
      depth + 1,
    );
    visited.delete(schema.$ref);
    return result;
  }

  // Array
  if (schema.type === "array" && schema.items) {
    return {
      type: "array",
      items: discoverySchemaToJsonSchema(
        schema.items,
        allSchemas,
        new Set(visited),
        depth + 1,
      ),
      ...(schema.description ? { description: schema.description } : {}),
    };
  }

  // Object with properties
  if (schema.type === "object" && schema.properties) {
    const properties: Record<string, any> = {};
    for (const [name, prop] of Object.entries(schema.properties)) {
      properties[name] = discoverySchemaToJsonSchema(
        prop,
        allSchemas,
        new Set(visited),
        depth + 1,
      );
    }

    const result: any = {
      type: "object",
      properties,
      additionalProperties: true,
    };

    if (schema.description) result.description = schema.description;
    if (schema.required && schema.required.length > 0) {
      result.required = schema.required;
    }

    return result;
  }

  // Object with additionalProperties (map type)
  if (schema.type === "object" && schema.additionalProperties) {
    const result: any = { type: "object" };
    if (typeof schema.additionalProperties === "object") {
      result.additionalProperties = discoverySchemaToJsonSchema(
        schema.additionalProperties,
        allSchemas,
        new Set(visited),
        depth + 1,
      );
    } else {
      result.additionalProperties = true;
    }
    if (schema.description) result.description = schema.description;
    return result;
  }

  // Plain object (no properties, no additionalProperties)
  if (schema.type === "object") {
    return {
      type: "object",
      additionalProperties: true,
      ...(schema.description ? { description: schema.description } : {}),
    };
  }

  // Enum
  if (schema.enum) {
    return {
      type: "string",
      enum: schema.enum,
      ...(schema.description ? { description: schema.description } : {}),
    };
  }

  // Scalar types
  const result: any = {};
  switch (schema.type) {
    case "string":
      result.type = "string";
      break;
    case "boolean":
      result.type = "boolean";
      break;
    case "integer":
      result.type = "integer";
      break;
    case "number":
      result.type = "number";
      break;
    default:
      result.type = schema.type || "string";
  }

  if (schema.description) result.description = schema.description;
  // Note: `format` is intentionally omitted — the Flows SDK JsonSchema type does not support it.

  return result;
}

/**
 * Convert a discovery field schema to a JSON Schema type (for input config).
 * Similar to output but excludes readOnly fields in nested objects.
 */
function discoveryFieldToJsonSchema(
  schema: DiscoverySchema,
  allSchemas: Record<string, DiscoverySchema>,
  visited: Set<string>,
  depth: number,
): any {
  if (depth >= MAX_DEPTH) {
    return { type: "object", additionalProperties: true };
  }

  // $ref — resolve and recurse
  if (schema.$ref) {
    if (visited.has(schema.$ref)) {
      return { type: "object", additionalProperties: true };
    }
    const resolved = allSchemas[schema.$ref];
    if (!resolved) {
      return { type: "object", additionalProperties: true };
    }
    visited.add(schema.$ref);
    const result = discoveryFieldToJsonSchema(
      resolved,
      allSchemas,
      visited,
      depth + 1,
    );
    visited.delete(schema.$ref);
    return result;
  }

  // Array
  if (schema.type === "array" && schema.items) {
    return {
      type: "array",
      items: discoveryFieldToJsonSchema(
        schema.items,
        allSchemas,
        new Set(visited),
        depth + 1,
      ),
    };
  }

  // Object with properties
  if (schema.type === "object" && schema.properties) {
    const properties: Record<string, any> = {};
    for (const [name, prop] of Object.entries(schema.properties)) {
      if (prop.readOnly) continue;
      if (name === "kind") continue;
      properties[name] = discoveryFieldToJsonSchema(
        prop,
        allSchemas,
        new Set(visited),
        depth + 1,
      );
    }

    const result: any = { type: "object", properties };
    if (schema.required && schema.required.length > 0) {
      result.required = schema.required;
    }
    result.additionalProperties = true;
    return result;
  }

  // Object with additionalProperties (map type)
  if (schema.type === "object" && schema.additionalProperties) {
    const result: any = { type: "object" };
    if (typeof schema.additionalProperties === "object") {
      result.additionalProperties = discoveryFieldToJsonSchema(
        schema.additionalProperties,
        allSchemas,
        new Set(visited),
        depth + 1,
      );
    } else {
      result.additionalProperties = true;
    }
    return result;
  }

  // Plain object
  if (schema.type === "object") {
    return { type: "object", additionalProperties: true };
  }

  // Enum
  if (schema.enum) {
    return { type: "string", enum: schema.enum };
  }

  // Scalar types
  switch (schema.type) {
    case "string":
      return { type: "string" };
    case "boolean":
      return { type: "boolean" };
    case "integer":
      return { type: "integer" };
    case "number":
      return { type: "number" };
    default:
      return { type: schema.type || "string" };
  }
}

/** Convert camelCase field name to human-readable: "managedZone" -> "Managed Zone" */
function camelCaseToHumanName(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}
