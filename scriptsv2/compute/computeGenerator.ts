#!/usr/bin/env node

/**
 * REST-based Compute Engine Flows App Generator
 *
 * Generates Flows apps from the GCP Compute Engine protobuf definitions.
 * Uses REST (fetch) for runtime API calls since Compute Engine has no gRPC endpoint.
 *
 * Usage:
 *   npx tsx scriptsv2/compute/computeGenerator.ts compute-instances
 *   npx tsx scriptsv2/compute/computeGenerator.ts          # generates all 5 apps
 */

import fs from "fs";
import path from "path";
import { parseProtoFiles } from "../grpc/protoParser.ts";
import {
  rpcToBlockName,
  humanizePascalCase,
  categoryToDirName,
} from "../grpc/naming.ts";
import { ParsedProtoResult, ParsedService } from "../grpc/types.ts";
import { parseHttpAnnotations, extractPathParams } from "./httpAnnotationParser.ts";
import { ComputeAppConfig, ComputeGeneratedBlock, HttpAnnotation } from "./types.ts";
import { generateRestBlockSource } from "./blockGenerator.ts";
import { writeComputeAppFiles } from "./appGenerator.ts";

const COMPUTE_PROTO = "local/googleapis/google/cloud/compute/v1/compute.proto";

/** App configurations — maps to the 5 existing compute app categories. */
const COMPUTE_APPS: Record<string, ComputeAppConfig> = {
  "compute-instances": {
    title: "Compute Engine - Instances",
    outputDir: "generatedv2/compute-instances",
    services: [
      "Instances",
      "InstanceGroups",
      "InstanceGroupManagers",
      "InstanceGroupManagerResizeRequests",
      "InstanceTemplates",
      "InstanceSettingsService",
      "MachineTypes",
      "MachineImages",
      "RegionInstanceGroups",
      "RegionInstanceGroupManagers",
      "RegionInstanceTemplates",
      "RegionInstances",
      "AcceleratorTypes",
      "Autoscalers",
      "RegionAutoscalers",
      "ZoneOperations",
    ],
  },
  "compute-load-balancing": {
    title: "Compute Engine - Load Balancing",
    outputDir: "generatedv2/compute-load-balancing",
    services: [
      "BackendBuckets",
      "BackendServices",
      "ForwardingRules",
      "GlobalForwardingRules",
      "HealthChecks",
      "RegionBackendServices",
      "RegionHealthChecks",
      "RegionTargetHttpProxies",
      "RegionTargetHttpsProxies",
      "RegionTargetTcpProxies",
      "RegionUrlMaps",
      "TargetHttpProxies",
      "TargetHttpsProxies",
      "TargetPools",
      "TargetSslProxies",
      "TargetTcpProxies",
      "TargetGrpcProxies",
      "TargetInstances",
      "UrlMaps",
    ],
  },
  "compute-networking": {
    title: "Compute Engine - Networking",
    outputDir: "generatedv2/compute-networking",
    services: [
      "Addresses",
      "GlobalAddresses",
      "ExternalVpnGateways",
      "InterconnectAttachments",
      "Interconnects",
      "InterconnectLocations",
      "InterconnectRemoteLocations",
      "Networks",
      "NetworkAttachments",
      "NetworkEndpointGroups",
      "GlobalNetworkEndpointGroups",
      "RegionNetworkEndpointGroups",
      "PacketMirrorings",
      "PublicAdvertisedPrefixes",
      "PublicDelegatedPrefixes",
      "GlobalPublicDelegatedPrefixes",
      "Routers",
      "Routes",
      "Subnetworks",
      "VpnGateways",
      "VpnTunnels",
      "ServiceAttachments",
    ],
  },
  "compute-security": {
    title: "Compute Engine - Security",
    outputDir: "generatedv2/compute-security",
    services: [
      "Firewalls",
      "FirewallPolicies",
      "NetworkFirewallPolicies",
      "RegionNetworkFirewallPolicies",
      "OrganizationSecurityPolicies",
      "SecurityPolicies",
      "RegionSecurityPolicies",
      "SslCertificates",
      "RegionSslCertificates",
      "SslPolicies",
      "RegionSslPolicies",
    ],
  },
  "compute-storage": {
    title: "Compute Engine - Storage",
    outputDir: "generatedv2/compute-storage",
    services: [
      "Disks",
      "DiskTypes",
      "RegionDisks",
      "RegionDiskTypes",
      "Images",
      "ImageFamilyViews",
      "Snapshots",
      "InstantSnapshots",
      "RegionInstantSnapshots",
      "ResourcePolicies",
      "StoragePools",
      "StoragePoolTypes",
      "SnapshotSettingsService",
    ],
  },
};

/**
 * Classify request message fields into path params, query params, and body field.
 */
function classifyFields(
  rpc: import("../grpc/types.ts").ParsedRPC,
  httpAnnotation: HttpAnnotation,
): { pathParams: string[]; queryParams: string[]; bodyFieldName: string | null } {
  const pathParams = extractPathParams(httpAnnotation.pathTemplate);
  const bodyFieldName = httpAnnotation.bodyField;

  // Query params: all request fields that are not path params and not the body field
  const pathParamSet = new Set(pathParams);
  const queryParams = rpc.requestType.fields
    .filter((f) => !pathParamSet.has(f.name) && f.name !== bodyFieldName)
    .map((f) => f.name);

  return { pathParams, queryParams, bodyFieldName };
}

async function generateApp(
  appName: string,
  config: ComputeAppConfig,
  allServices: ParsedService[],
  httpAnnotations: Map<string, HttpAnnotation>,
): Promise<void> {
  console.log(`\n📦 Generating ${config.title} (${appName})...`);

  // Filter services to those in this app's config
  const serviceSet = new Set(config.services);
  const services = allServices.filter((s) => serviceSet.has(s.name));

  // Check for services in config that weren't found
  const foundNames = new Set(services.map((s) => s.name));
  for (const name of config.services) {
    if (!foundNames.has(name)) {
      console.warn(`  ⚠ Service not found in proto: ${name}`);
    }
  }

  console.log(`  Found ${services.length} services`);

  // Generate blocks for each RPC
  const blocks: ComputeGeneratedBlock[] = [];

  for (const service of services) {
    const category = humanizePascalCase(service.name);
    const categoryDir = categoryToDirName(category);

    for (const rpc of service.rpcs) {
      // Skip streaming RPCs (shouldn't exist in compute, but just in case)
      if (rpc.requestStream || rpc.responseStream) {
        console.log(`  Skipping streaming RPC: ${rpc.name}`);
        continue;
      }

      // Skip IAM policy RPCs — these are injected into most services
      // and are not useful as standalone blocks.
      if (["GetIamPolicy", "SetIamPolicy", "TestIamPermissions"].includes(rpc.name)) {
        continue;
      }

      // Look up HTTP annotation by ServiceName.RPCName
      const annotation = httpAnnotations.get(`${service.name}.${rpc.name}`);
      if (!annotation) {
        console.log(`  Skipping RPC without HTTP annotation: ${service.name}.${rpc.name}`);
        continue;
      }

      const blockName = rpcToBlockName(rpc.name);
      const humanName = `${category} - ${humanizePascalCase(rpc.name)}`;
      const { pathParams, queryParams, bodyFieldName } = classifyFields(rpc, annotation);

      blocks.push({
        blockName,
        humanName,
        category,
        categoryDir,
        fileName: `${blockName}.ts`,
        serviceName: service.name,
        rpcName: rpc.name,
        rpcMethodName: rpc.name.charAt(0).toLowerCase() + rpc.name.slice(1),
        rpc,
        httpAnnotation: annotation,
        pathParams,
        queryParams,
        bodyFieldName,
      });
    }
  }

  // Disambiguate blocks with duplicate categoryDir/blockName
  const pathCounts = new Map<string, number>();
  for (const b of blocks) {
    const key = `${b.categoryDir}/${b.blockName}`;
    pathCounts.set(key, (pathCounts.get(key) ?? 0) + 1);
  }
  for (const b of blocks) {
    const key = `${b.categoryDir}/${b.blockName}`;
    if ((pathCounts.get(key) ?? 0) > 1) {
      const prefix =
        b.serviceName.charAt(0).toLowerCase() + b.serviceName.slice(1);
      const oldBlock = b.blockName;
      b.blockName =
        prefix + oldBlock.charAt(0).toUpperCase() + oldBlock.slice(1);
      b.fileName = `${b.blockName}.ts`;
      b.humanName = `${b.serviceName} - ${b.humanName}`;
    }
  }

  console.log(`  Generating ${blocks.length} blocks...`);

  // Generate block source code (keyed by categoryDir/blockName for uniqueness)
  const blockSources = new Map<string, string>();
  for (const block of blocks) {
    const source = generateRestBlockSource(block);
    blockSources.set(`${block.categoryDir}/${block.blockName}`, source);
  }

  // Write all files
  console.log("  Writing output files...");
  await writeComputeAppFiles(config, blocks, blockSources);

  console.log(
    `\n✅ Successfully generated ${config.title} in ${config.outputDir}`,
  );
  console.log(
    `   ${blocks.length} blocks across ${new Set(blocks.map((b) => b.category)).size} categories`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  const targetApp = args[0];

  // Step 1: Parse compute.proto once
  console.log("Parsing compute.proto...");
  const protoResult = await parseProtoFiles([COMPUTE_PROTO]);
  console.log(
    `Found ${protoResult.services.length} services, ${protoResult.messages.size} message types`,
  );

  // Step 2: Parse HTTP annotations from raw proto source
  console.log("Parsing HTTP annotations...");
  const httpAnnotations = parseHttpAnnotations([COMPUTE_PROTO]);
  console.log(`Found ${httpAnnotations.size} HTTP annotations`);

  // Filter to only .google.cloud.compute.v1. services
  const computeServices = protoResult.services.filter((s) =>
    s.fullName.startsWith(".google.cloud.compute.v1."),
  );
  console.log(`Filtered to ${computeServices.length} compute services`);

  if (targetApp) {
    const config = COMPUTE_APPS[targetApp];
    if (!config) {
      console.error(`❌ Unknown app: ${targetApp}`);
      console.log(
        `Available apps: ${Object.keys(COMPUTE_APPS).join(", ")}`,
      );
      process.exit(1);
    }
    await generateApp(targetApp, config, computeServices, httpAnnotations);
  } else {
    console.log(
      `\nGenerating ${Object.keys(COMPUTE_APPS).length} compute apps...`,
    );
    for (const [name, config] of Object.entries(COMPUTE_APPS)) {
      try {
        await generateApp(name, config, computeServices, httpAnnotations);
      } catch (error: any) {
        console.error(`❌ Failed to generate ${name}:`, error.message);
      }
    }
    console.log("\n🎉 Compute generation complete!");
  }
}

main().catch((error) => {
  console.error("❌ Generation failed:", error);
  process.exit(1);
});
