#!/usr/bin/env node

/**
 * Proto-based GCP Flows App Generator (v2)
 *
 * Generates Flows apps from GCP protobuf definitions.
 * Uses gRPC for runtime API calls.
 *
 * Usage:
 *   npx tsx scriptsv2/protoGenerator.ts pubsub
 *   npx tsx scriptsv2/protoGenerator.ts          # generates all configured services
 */

import fs from "fs";
import path from "path";
import { parseProtoFiles } from "./protoParser.ts";
import { generateBlockSource } from "./blockGenerator.ts";
import { writeAppFiles } from "./appGenerator.ts";
import {
  rpcToBlockName,
  rpcToHumanName,
  rpcToCategory,
  rpcToGrpcMethodName,
  categoryToDirName,
} from "./naming.ts";
import { GeneratedBlock, ServiceConfig } from "./types.ts";

const PROJECT_ROOT = path.resolve(".");

/**
 * Resolve all proto files from a ServiceConfig.
 * Expands protoDirs to individual .proto file paths.
 */
function resolveProtoFiles(config: ServiceConfig): string[] {
  const files = [...config.protoFiles];
  for (const dir of config.protoDirs ?? []) {
    const absDir = path.resolve(PROJECT_ROOT, dir);
    const entries = fs.readdirSync(absDir).filter((f) => f.endsWith(".proto"));
    files.push(...entries.map((f) => path.join(dir, f)));
  }
  return files;
}

/**
 * Derive target proto packages from a ServiceConfig.
 * Used to filter out imported services (e.g. google.iam.v1.IAMPolicy).
 */
function deriveTargetPackages(config: ServiceConfig): string[] {
  const packages = new Set<string>();

  // From individual proto files
  for (const f of config.protoFiles) {
    // "local/googleapis/google/storage/v2/storage.proto" -> ".google.storage.v2"
    const parts = f
      .replace(/^local\/googleapis\//, "")
      .replace(/\/[^/]+\.proto$/, "")
      .split("/");
    packages.add("." + parts.join("."));
  }

  // From proto directories
  for (const dir of config.protoDirs ?? []) {
    // "local/googleapis/google/monitoring/v3" -> ".google.monitoring.v3"
    const parts = dir.replace(/^local\/googleapis\//, "").split("/");
    packages.add("." + parts.join("."));
  }

  return [...packages];
}

/** Service configurations. Add new services here to extend the generator. */
const SERVICES: Record<string, ServiceConfig> = {
  pubsub: {
    protoFiles: [
      "local/googleapis/google/pubsub/v1/pubsub.proto",
      "local/googleapis/google/pubsub/v1/schema.proto",
    ],
    host: "pubsub.googleapis.com",
    title: "Cloud Pub/Sub API",
    outputDir: "generated/pubsub",
  },
  iam: {
    protoFiles: ["local/googleapis/google/iam/admin/v1/iam.proto"],
    host: "iam.googleapis.com",
    title: "IAM Admin API",
    outputDir: "generated/iam",
  },
  storage: {
    protoFiles: [
      "local/googleapis/google/storage/v2/storage.proto",
    ],
    host: "storage.googleapis.com",
    title: "Cloud Storage API",
    outputDir: "generated/storage",
  },
  cloudbuild: {
    protoFiles: [],
    protoDirs: [
      "local/googleapis/google/devtools/cloudbuild/v1",
      "local/googleapis/google/devtools/cloudbuild/v2",
    ],
    host: "cloudbuild.googleapis.com",
    title: "Cloud Build API",
    outputDir: "generated/cloudbuild",
  },
  cloudfunctions: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/functions/v2"],
    host: "cloudfunctions.googleapis.com",
    title: "Cloud Functions API",
    outputDir: "generated/cloudfunctions",
  },
  cloudkms: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/kms/v1"],
    host: "cloudkms.googleapis.com",
    title: "Cloud KMS API",
    outputDir: "generated/cloudkms",
  },
  cloudresourcemanager: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/resourcemanager/v3"],
    host: "cloudresourcemanager.googleapis.com",
    title: "Cloud Resource Manager API",
    outputDir: "generated/cloudresourcemanager",
  },
  container: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/container/v1"],
    host: "container.googleapis.com",
    title: "Google Kubernetes Engine API",
    outputDir: "generated/container",
  },
  monitoring: {
    protoFiles: [],
    protoDirs: [
      "local/googleapis/google/monitoring/v3",
    ],
    host: "monitoring.googleapis.com",
    title: "Cloud Monitoring API",
    outputDir: "generated/monitoring",
  },
  run: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/run/v2"],
    host: "run.googleapis.com",
    title: "Cloud Run API",
    outputDir: "generated/run",
  },
  secretmanager: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/secretmanager/v1"],
    host: "secretmanager.googleapis.com",
    title: "Secret Manager API",
    outputDir: "generated/secretmanager",
  },
  sqladmin: {
    protoFiles: [],
    protoDirs: ["local/googleapis/google/cloud/sql/v1"],
    host: "sqladmin.googleapis.com",
    title: "Cloud SQL Admin API",
    outputDir: "generated/sqladmin",
  },
  generativelanguage: {
    protoFiles: [
      "local/googleapis/google/ai/generativelanguage/v1beta/generative_service.proto",
      "local/googleapis/google/ai/generativelanguage/v1beta/model_service.proto",
      "local/googleapis/google/ai/generativelanguage/v1beta/cache_service.proto",
      "local/googleapis/google/ai/generativelanguage/v1beta/file_service.proto",
      "local/googleapis/google/ai/generativelanguage/v1beta/retriever_service.proto",
      "local/googleapis/google/ai/generativelanguage/v1beta/permission_service.proto",
    ],
    host: "generativelanguage.googleapis.com",
    title: "Generative Language API",
    outputDir: "generated/generativelanguage",
  },
};

async function generateService(
  serviceName: string,
  config: ServiceConfig,
): Promise<void> {
  console.log(`\n📦 Generating ${config.title} (${serviceName})...`);

  // Resolve proto files (expand directories)
  const protoFiles = resolveProtoFiles(config);

  // Step 1: Parse proto files
  console.log(`  Parsing ${protoFiles.length} proto files...`);
  const protoResult = await parseProtoFiles(protoFiles);

  console.log(
    `  Found ${protoResult.services.length} services, ${protoResult.messages.size} message types`,
  );
  for (const svc of protoResult.services) {
    console.log(`    ${svc.name}: ${svc.rpcs.length} RPCs`);
  }

  // Step 2: Filter services to only those from the target proto package.
  // Imported dependencies (e.g. google.iam.v1.IAMPolicy) should be excluded.
  const targetPackages = deriveTargetPackages(config);
  const filteredServices = protoResult.services.filter((svc) =>
    targetPackages.some((pkg) => svc.fullName.startsWith(pkg + ".")),
  );

  if (filteredServices.length < protoResult.services.length) {
    const skipped = protoResult.services.length - filteredServices.length;
    console.log(`  Filtered out ${skipped} imported service(s), keeping ${filteredServices.length}`);
  }

  // Step 3: Generate block metadata for each non-streaming RPC
  const blocks: GeneratedBlock[] = [];

  for (const service of filteredServices) {
    for (const rpc of service.rpcs) {
      // Skip streaming RPCs
      if (rpc.requestStream || rpc.responseStream) {
        console.log(`  Skipping streaming RPC: ${rpc.name}`);
        continue;
      }

      // Skip IAM policy RPCs — these are injected into most services
      // and are not useful as standalone blocks.
      if (["GetIamPolicy", "SetIamPolicy", "TestIamPermissions"].includes(rpc.name)) {
        continue;
      }

      const blockName = rpcToBlockName(rpc.name);
      const category = rpcToCategory(
        service.name,
        rpc.name,
        rpc.requestType.name,
      );
      const humanName = rpcToHumanName(category, rpc.name);
      const categoryDir = categoryToDirName(category);
      const rpcMethodName = rpcToGrpcMethodName(rpc.name);

      blocks.push({
        blockName,
        humanName,
        category,
        categoryDir,
        fileName: `${blockName}.ts`,
        serviceName: service.name,
        rpcMethodName,
        rpc,
      });
    }
  }

  // Step 3b: Disambiguate blocks with duplicate categoryDir/blockName.
  // This happens when multiple services share RPC names in the same category
  // (e.g. GetIamPolicy from Projects, Folders, Organizations all in "IAM").
  const pathCounts = new Map<string, number>();
  for (const b of blocks) {
    const key = `${b.categoryDir}/${b.blockName}`;
    pathCounts.set(key, (pathCounts.get(key) ?? 0) + 1);
  }
  for (const b of blocks) {
    const key = `${b.categoryDir}/${b.blockName}`;
    if ((pathCounts.get(key) ?? 0) > 1) {
      // Prefix with lowercased service name: "Projects" + "getIamPolicy" -> "projectsGetIamPolicy"
      const prefix = b.serviceName.charAt(0).toLowerCase() + b.serviceName.slice(1);
      const oldBlock = b.blockName;
      b.blockName = prefix + oldBlock.charAt(0).toUpperCase() + oldBlock.slice(1);
      b.fileName = `${b.blockName}.ts`;
      b.humanName = `${b.serviceName} - ${b.humanName}`;
    }
  }

  console.log(`  Generating ${blocks.length} blocks...`);

  // Sort blocks deterministically (protobufjs iteration order is not stable)
  blocks.sort((a, b) =>
    `${a.categoryDir}/${a.blockName}`.localeCompare(`${b.categoryDir}/${b.blockName}`),
  );

  // Step 4: Generate block source code
  const blockSources = new Map<string, string>();
  for (const block of blocks) {
    const source = generateBlockSource(block);
    blockSources.set(`${block.categoryDir}/${block.blockName}`, source);
  }

  // Step 5: Write all files
  console.log("  Writing output files...");
  await writeAppFiles(config, blocks, blockSources, protoResult);

  console.log(`\n✅ Successfully generated ${config.title} in ${config.outputDir}`);
  console.log(`   ${blocks.length} blocks across ${new Set(blocks.map((b) => b.category)).size} categories`);
}

async function main() {
  const args = process.argv.slice(2);
  const targetService = args[0];

  if (targetService) {
    const config = SERVICES[targetService];
    if (!config) {
      console.error(`❌ Unknown service: ${targetService}`);
      console.log(`Available services: ${Object.keys(SERVICES).join(", ")}`);
      process.exit(1);
    }
    await generateService(targetService, config);
  } else {
    console.log(
      `Generating apps for ${Object.keys(SERVICES).length} services...`,
    );
    for (const [name, config] of Object.entries(SERVICES)) {
      try {
        await generateService(name, config);
      } catch (error: any) {
        console.error(`❌ Failed to generate ${name}:`, error.message);
      }
    }
    console.log("\n🎉 Generation complete!");
  }
}

main().catch((error) => {
  console.error("❌ Generation failed:", error);
  process.exit(1);
});
