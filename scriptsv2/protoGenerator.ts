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

/** Service configurations. Add new services here to extend the generator. */
const SERVICES: Record<string, ServiceConfig> = {
  pubsub: {
    protoFiles: [
      "local/googleapis/google/pubsub/v1/pubsub.proto",
      "local/googleapis/google/pubsub/v1/schema.proto",
    ],
    host: "pubsub.googleapis.com",
    title: "Cloud Pub/Sub",
    outputDir: "generatedv2/pubsub",
  },
  iam: {
    protoFiles: ["local/googleapis/google/iam/admin/v1/iam.proto"],
    host: "iam.googleapis.com",
    title: "IAM Admin",
    outputDir: "generatedv2/iam",
  },
  storage: {
    protoFiles: [
      "local/googleapis/google/storage/v2/storage.proto",
    ],
    host: "storage.googleapis.com",
    title: "Cloud Storage",
    outputDir: "generatedv2/storage",
  },
};

async function generateService(
  serviceName: string,
  config: ServiceConfig,
): Promise<void> {
  console.log(`\n📦 Generating ${config.title} (${serviceName})...`);

  // Step 1: Parse proto files
  console.log("  Parsing proto files...");
  const protoResult = await parseProtoFiles(config.protoFiles);

  console.log(
    `  Found ${protoResult.services.length} services, ${protoResult.messages.size} message types`,
  );
  for (const svc of protoResult.services) {
    console.log(`    ${svc.name}: ${svc.rpcs.length} RPCs`);
  }

  // Step 2: Filter services to only those from the target proto package.
  // Imported dependencies (e.g. google.iam.v1.IAMPolicy) should be excluded.
  const targetPackages = config.protoFiles.map((f) => {
    // "local/googleapis/google/storage/v2/storage.proto" -> ".google.storage.v2"
    const parts = f.replace(/^local\/googleapis\//, "").replace(/\/[^/]+\.proto$/, "").split("/");
    return "." + parts.join(".");
  });
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

  console.log(`  Generating ${blocks.length} blocks...`);

  // Step 4: Generate block source code
  const blockSources = new Map<string, string>();
  for (const block of blocks) {
    const source = generateBlockSource(block);
    blockSources.set(block.blockName, source);
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
