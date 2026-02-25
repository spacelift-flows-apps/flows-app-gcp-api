/**
 * Naming utilities for the proto-based GCP Flows app generator.
 */

/** Convert PascalCase RPC name to camelCase block name: "CreateTopic" -> "createTopic" */
export function rpcToBlockName(rpcName: string): string {
  const name = rpcName.charAt(0).toLowerCase() + rpcName.slice(1);

  // Handle reserved JS/TS keywords
  const reserved = new Set([
    "delete",
    "default",
    "export",
    "import",
    "return",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "do",
    "else",
    "enum",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "implements",
    "in",
    "instanceof",
    "interface",
    "let",
    "new",
    "null",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ]);

  if (reserved.has(name)) {
    return name + "Operation";
  }

  return name;
}

/** Convert PascalCase to spaced human-readable: "CreateTopic" -> "Create Topic" */
export function humanizePascalCase(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b(Iam)\b/g, "IAM")
    .replace(/\b(Ack)\b/g, "Ack");
}

/** Create the human-readable block name: "Topics", "CreateTopic" -> "Topics - Create Topic" */
export function rpcToHumanName(category: string, rpcName: string): string {
  return `${category} - ${humanizePascalCase(rpcName)}`;
}

/**
 * Derive the category for an RPC based on its service and the resource it operates on.
 *
 * For pubsub:
 * - Publisher RPCs that operate on topics -> "Topics"
 * - Publisher.DetachSubscription -> "Topics" (it's a Publisher method)
 * - Subscriber RPCs that operate on subscriptions -> "Subscriptions"
 * - Subscriber RPCs that operate on snapshots -> "Snapshots"
 * - SchemaService RPCs -> "Schemas"
 */
export function rpcToCategory(
  serviceName: string,
  rpcName: string,
  requestTypeName: string,
): string {
  // SchemaService -> always Schemas
  if (serviceName === "SchemaService") {
    return "Schemas";
  }

  // Check the request type name and RPC name for resource hints
  const rpcLower = rpcName.toLowerCase();
  const reqLower = requestTypeName.toLowerCase();

  if (rpcLower.includes("snapshot") || reqLower.includes("snapshot")) {
    return "Snapshots";
  }
  if (rpcLower.includes("subscription") || reqLower.includes("subscription")) {
    if (serviceName === "Publisher") {
      // DetachSubscription, ListTopicSubscriptions are Publisher methods but about subscriptions
      // Keep them in Topics since they're Publisher operations
      return "Topics";
    }
    return "Subscriptions";
  }
  if (rpcLower.includes("topic") || reqLower.includes("topic")) {
    return "Topics";
  }

  // Default based on service
  if (serviceName === "Publisher") return "Topics";
  if (serviceName === "Subscriber") return "Subscriptions";

  return "General";
}

/** Convert category name to directory name: "Topics" -> "topics" */
export function categoryToDirName(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/** Convert PascalCase RPC name to camelCase gRPC method name: "CreateTopic" -> "createTopic" */
export function rpcToGrpcMethodName(rpcName: string): string {
  return rpcName.charAt(0).toLowerCase() + rpcName.slice(1);
}

/** Clean proto comment for use as a description. Strips leading/trailing whitespace. */
export function cleanComment(comment: string | undefined): string {
  if (!comment) return "";
  return comment
    .replace(/^\s*\/?\*+\/?/gm, "") // Strip comment markers
    .replace(/\s+/g, " ")
    .trim();
}
