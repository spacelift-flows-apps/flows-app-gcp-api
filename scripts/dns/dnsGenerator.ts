#!/usr/bin/env node

/**
 * REST-based Cloud DNS Flows App Generator
 *
 * Generates a Flows app from the GCP Cloud DNS Discovery Document.
 * Uses REST (fetch) for runtime API calls.
 *
 * Usage:
 *   npx tsx scripts/dns/dnsGenerator.ts
 */

import {
  rpcToBlockName,
  humanizePascalCase,
  categoryToDirName,
} from "../grpc/naming.ts";
import { loadDiscoveryDocument, extractMethods } from "./discoveryParser.ts";
import { generateDnsBlockSource } from "./blockGenerator.ts";
import { writeDnsAppFiles } from "./appGenerator.ts";
import { DnsAppConfig, DnsGeneratedBlock } from "./types.ts";

const DNS_CONFIG: DnsAppConfig = {
  title: "Cloud DNS",
  outputDir: "generated/dns",
  discoveryDocPath: "gcp-api-discovery/dns-v1.json",
};

/** Map discovery resource names to human-readable categories. */
function resourceToCategory(resourceName: string): string {
  const mapping: Record<string, string> = {
    changes: "Changes",
    dnsKeys: "DNS Keys",
    managedZoneOperations: "Managed Zone Operations",
    managedZones: "Managed Zones",
    policies: "Policies",
    projects: "Projects",
    resourceRecordSets: "Resource Record Sets",
    responsePolicies: "Response Policies",
    responsePolicyRules: "Response Policy Rules",
  };
  return mapping[resourceName] || humanizePascalCase(resourceName);
}

/** Build block name from resource + method: "managedZones" + "create" -> "managedZonesCreate" */
function buildBlockName(resourceName: string, methodName: string): string {
  const combined =
    resourceName + methodName.charAt(0).toUpperCase() + methodName.slice(1);
  return rpcToBlockName(combined);
}

async function main() {
  console.log("Loading DNS discovery document...");
  const doc = loadDiscoveryDocument(DNS_CONFIG.discoveryDocPath);
  console.log(`  Title: ${doc.title}`);
  console.log(`  Base URL: ${doc.baseUrl}`);

  console.log("Extracting methods...");
  const methods = extractMethods(doc);
  console.log(`  Found ${methods.length} methods`);

  // Build blocks
  const blocks: DnsGeneratedBlock[] = [];

  for (const method of methods) {
    const category = resourceToCategory(method.resourceName);
    const categoryDir = categoryToDirName(category);
    const blockName = buildBlockName(method.resourceName, method.methodName);
    const humanName = `${category} - ${humanizePascalCase(method.methodName.charAt(0).toUpperCase() + method.methodName.slice(1))}`;

    blocks.push({
      blockName,
      humanName,
      category,
      categoryDir,
      fileName: `${blockName}.ts`,
      method,
    });
  }

  // Sort blocks deterministically
  blocks.sort((a, b) =>
    `${a.categoryDir}/${a.blockName}`.localeCompare(
      `${b.categoryDir}/${b.blockName}`,
    ),
  );

  console.log(`\nGenerating ${blocks.length} blocks...`);

  // Generate block source code
  const allSchemas = doc.schemas || {};
  const blockSources = new Map<string, string>();
  for (const block of blocks) {
    const source = generateDnsBlockSource(block, allSchemas);
    blockSources.set(`${block.categoryDir}/${block.blockName}`, source);
  }

  // Write all files
  console.log("Writing output files...");
  await writeDnsAppFiles(DNS_CONFIG, blocks, blockSources, doc.baseUrl);

  console.log(
    `\n\u2705 Successfully generated ${DNS_CONFIG.title} in ${DNS_CONFIG.outputDir}`,
  );
  console.log(
    `   ${blocks.length} blocks across ${new Set(blocks.map((b) => b.category)).size} categories`,
  );
}

main().catch((error) => {
  console.error("\u274c Generation failed:", error);
  process.exit(1);
});
