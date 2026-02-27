/**
 * Parse google.api.http annotations from raw proto source.
 *
 * Extracts HTTP method, URL path template, and body field for each RPC.
 */

import fs from "fs";
import path from "path";
import { HttpAnnotation } from "./types.ts";

const PROJECT_ROOT = path.resolve(".");

/**
 * Parse all google.api.http annotations from the given proto files.
 * Returns a map from "ServiceName.RPCName" -> HttpAnnotation.
 */
export function parseHttpAnnotations(
  protoFiles: string[],
): Map<string, HttpAnnotation> {
  const result = new Map<string, HttpAnnotation>();

  for (const filePath of protoFiles) {
    const absPath = path.resolve(PROJECT_ROOT, filePath);
    const content = fs.readFileSync(absPath, "utf8");

    // First pass: find all service blocks and their byte ranges
    const serviceBlocks: Array<{
      name: string;
      start: number;
      end: number;
    }> = [];
    const serviceRegex = /^service\s+(\w+)\s*\{/gm;
    let svcMatch;
    while ((svcMatch = serviceRegex.exec(content)) !== null) {
      const name = svcMatch[1];
      const startIdx = svcMatch.index + svcMatch[0].length;
      let depth = 1;
      let endIdx = startIdx;
      while (depth > 0 && endIdx < content.length) {
        if (content[endIdx] === "{") depth++;
        if (content[endIdx] === "}") depth--;
        endIdx++;
      }
      serviceBlocks.push({ name, start: svcMatch.index, end: endIdx });
    }

    // Second pass: find all RPCs and match to their service
    const rpcBlockRegex =
      /rpc\s+(\w+)\s*\([^)]*\)\s*returns\s*\([^)]*\)\s*\{/g;
    let match;
    while ((match = rpcBlockRegex.exec(content)) !== null) {
      const rpcName = match[1];
      const rpcPos = match.index;
      const startIdx = match.index + match[0].length;

      // Find the matching closing brace (handling nested braces)
      let depth = 1;
      let endIdx = startIdx;
      while (depth > 0 && endIdx < content.length) {
        if (content[endIdx] === "{") depth++;
        if (content[endIdx] === "}") depth--;
        endIdx++;
      }

      const rpcBody = content.substring(startIdx, endIdx - 1);

      // Find google.api.http annotation
      const httpMatch = rpcBody.match(
        /option\s*\(google\.api\.http\)\s*=\s*\{([\s\S]*?)\};/,
      );
      if (!httpMatch) continue;

      const httpBody = httpMatch[1];

      // Extract HTTP method and path
      const methodMatch = httpBody.match(
        /\b(get|post|delete|patch|put)\s*:\s*"([^"]+)"/,
      );
      if (!methodMatch) continue;

      const method = methodMatch[1];
      const pathTemplate = methodMatch[2];

      // Extract body field (optional)
      const bodyMatch = httpBody.match(/\bbody\s*:\s*"([^"]+)"/);
      const bodyField = bodyMatch ? bodyMatch[1] : null;

      // Find the enclosing service
      const service = serviceBlocks.find(
        (s) => rpcPos >= s.start && rpcPos < s.end,
      );
      const key = service ? `${service.name}.${rpcName}` : rpcName;

      result.set(key, { method, pathTemplate, bodyField });
    }
  }

  return result;
}

/**
 * Extract path parameter names from a URL template.
 * e.g. "/compute/v1/projects/{project}/zones/{zone}/instances/{instance}"
 *   -> ["project", "zone", "instance"]
 */
export function extractPathParams(pathTemplate: string): string[] {
  const params: string[] = [];
  const regex = /\{(\+?)(\w+)\}/g;
  let match;
  while ((match = regex.exec(pathTemplate)) !== null) {
    params.push(match[2]);
  }
  return params;
}
