/**
 * Parse a GCP Discovery Document into structured method/schema data
 * suitable for Flows block generation.
 */

import fs from "fs";
import {
  DiscoveryDocument,
  DiscoveryMethod,
  DiscoveryParameter,
  DiscoveryResource,
  ParsedMethod,
} from "./types.ts";

/**
 * Load and parse a GCP Discovery Document JSON file.
 */
export function loadDiscoveryDocument(filePath: string): DiscoveryDocument {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as DiscoveryDocument;
}

/**
 * Extract all methods from a discovery document, recursively walking nested resources.
 * Returns ParsedMethod[] with parameters already classified by location.
 */
export function extractMethods(doc: DiscoveryDocument): ParsedMethod[] {
  const methods: ParsedMethod[] = [];

  function walkResource(
    resourceName: string,
    resource: DiscoveryResource,
  ): void {
    if (resource.methods) {
      for (const [methodName, method] of Object.entries(resource.methods)) {
        methods.push(parseMethod(resourceName, methodName, method));
      }
    }
    if (resource.resources) {
      for (const [childName, childResource] of Object.entries(
        resource.resources,
      )) {
        walkResource(childName, childResource);
      }
    }
  }

  if (doc.resources) {
    for (const [name, resource] of Object.entries(doc.resources)) {
      walkResource(name, resource);
    }
  }

  return methods;
}

/**
 * Parse a single discovery method into a ParsedMethod.
 */
function parseMethod(
  resourceName: string,
  methodName: string,
  method: DiscoveryMethod,
): ParsedMethod {
  const pathParams: DiscoveryParameter[] = [];
  const queryParams: DiscoveryParameter[] = [];

  if (method.parameters) {
    for (const [paramName, param] of Object.entries(method.parameters)) {
      const paramWithName = { ...param, name: paramName };
      if (param.location === "path") {
        // Skip project — always comes from app config
        if (paramName === "project") continue;
        pathParams.push(paramWithName);
      } else if (param.location === "query") {
        queryParams.push(paramWithName);
      }
    }
  }

  return {
    id: method.id,
    resourceName,
    methodName,
    httpMethod: method.httpMethod,
    path: method.path,
    description: method.description || "",
    pathParams,
    queryParams,
    requestSchemaRef: method.request?.$ref ?? null,
    responseSchemaRef: method.response?.$ref ?? null,
  };
}
