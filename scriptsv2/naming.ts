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
    .replace(/\b(Jwt)\b/g, "JWT")
    .replace(/\b(Ack)\b/g, "Ack");
}

/** Create the human-readable block name: "Topics", "CreateTopic" -> "Topics - Create Topic" */
export function rpcToHumanName(category: string, rpcName: string): string {
  return humanizePascalCase(rpcName);
}

/**
 * Known resource patterns to category mappings.
 * Order matters - first match wins. More specific patterns should come first.
 */
const RESOURCE_PATTERNS: Array<{ pattern: RegExp; category: string }> = [
  // Pubsub-specific
  { pattern: /snapshot/i, category: "Snapshots" },
  { pattern: /subscription/i, category: "Subscriptions" },
  { pattern: /topic/i, category: "Topics" },
  { pattern: /schema/i, category: "Schemas" },
  // Cloud Storage
  { pattern: /bucket/i, category: "Buckets" },
  { pattern: /object/i, category: "Objects" },
  { pattern: /resumablewrite/i, category: "Objects" },
  // IAM Admin
  { pattern: /serviceaccountkey/i, category: "Service Account Keys" },
  { pattern: /serviceaccount/i, category: "Service Accounts" },
  { pattern: /role/i, category: "Roles" },
  // IAM (used by multiple services)
  { pattern: /iampoli/i, category: "IAM" },
  { pattern: /iampermission/i, category: "IAM" },
];

/**
 * Service-level category defaults when no resource pattern matches.
 */
const SERVICE_DEFAULTS: Record<string, string> = {
  Publisher: "Topics",
  Subscriber: "Subscriptions",
  SchemaService: "Schemas",
  Storage: "Objects",
  IAM: "IAM",
};

/**
 * Derive the category for an RPC based on its service and the resource it operates on.
 *
 * Uses the RPC name and request type name to detect the resource, falling back
 * to service-level defaults.
 *
 * For pubsub:
 * - Publisher RPCs that operate on topics -> "Topics"
 * - Publisher.DetachSubscription -> "Topics" (it's a Publisher method)
 * - Subscriber RPCs that operate on subscriptions -> "Subscriptions"
 * - Subscriber RPCs that operate on snapshots -> "Snapshots"
 * - SchemaService RPCs -> "Schemas"
 *
 * For Cloud Storage:
 * - *Bucket* RPCs -> "Buckets"
 * - *Object* RPCs -> "Objects"
 * - *IamPolicy* / *IamPermissions* RPCs -> "IAM"
 * - *ResumableWrite* RPCs -> "Objects"
 */
export function rpcToCategory(
  serviceName: string,
  rpcName: string,
  requestTypeName: string,
): string {
  const rpcLower = rpcName.toLowerCase();
  const reqLower = requestTypeName.toLowerCase();
  const combined = rpcLower + " " + reqLower;

  for (const { pattern, category } of RESOURCE_PATTERNS) {
    if (pattern.test(combined)) {
      // Special case: Publisher methods about subscriptions stay in Topics
      if (
        serviceName === "Publisher" &&
        (category === "Subscriptions" || category === "Snapshots")
      ) {
        return "Topics";
      }
      return category;
    }
  }

  return SERVICE_DEFAULTS[serviceName] || "General";
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
