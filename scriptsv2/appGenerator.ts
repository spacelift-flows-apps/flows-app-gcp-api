/**
 * App scaffolding generation.
 *
 * Generates main.ts, blocks/index.ts, lib/grpcClient.ts, protos.json,
 * package.json, tsconfig.json, and VERSION for the output app.
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import {
  GeneratedBlock,
  ParsedProtoResult,
  ServiceConfig,
} from "./types.ts";

/**
 * Generate the main.ts app definition file.
 */
export function generateMainTs(config: ServiceConfig): string {
  return `import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index.ts";

export const app = defineApp({
  name: "${config.title}",
  installationInstructions: \`## Authentication Setup

You need to authenticate with GCP using **one** of these methods:

### Option 1: Service Account Key (Simple)

1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create or select a service account
3. Grant necessary permissions (varies by service - see GCP documentation)
4. Click **Keys** → **Add Key** → **Create New Key** → **JSON**
5. Download the JSON file
6. Paste the entire JSON contents into the **Service Account Key** field below

### Option 2: Access Token (Recommended for Production)

For better security, use short-lived access tokens instead of long-lived keys:

1. Install the **GCP Workload Identity Federation** app in your Flows workspace
2. Configure it with your OIDC provider (GitHub, GitLab, etc.)
3. Use that app to generate access tokens
4. Pass the token to the **Access Token** field below

This approach eliminates the need for long-lived credentials and provides better audit trails.\`,
  config: {
    serviceAccountKey: {
      name: "Service Account Key",
      description: \`**Long-lived credentials** (optional if using Access Token below)

Provide your GCP Service Account JSON key file contents.

**To create:**
1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create or select a service account with appropriate permissions
3. Click **Keys** → **Add Key** → **Create New Key** → **JSON**
4. Download the JSON file and paste its entire contents here

**Not required** if you're using the **Access Token** field below.\`,
      type: "string",
      required: false,
      sensitive: true,
    },
    accessToken: {
      name: "Access Token",
      description: \`**Short-lived token** (optional if using Service Account Key above)

Provide a pre-generated GCP access token for keyless authentication.

**Recommended approach:** Use the **GCP Workload Identity Federation** app to generate short-lived tokens via OIDC. This is more secure than long-lived service account keys.

**Not required** if you're using the **Service Account Key** field above.\`,
      type: "string",
      required: false,
      sensitive: true,
    },
  },
  blocks,
});
`;
}

/**
 * Generate the lib/grpcClient.ts shared utility.
 */
export function generateGrpcClient(
  serviceNames: string[],
  host: string,
  protoPackage: string,
): string {
  const clientFactories = serviceNames
    .map((name) => {
      const funcName = `get${name}Client`;
      return `export async function ${funcName}(config: Record<string, any>): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("${protoPackage}", "${name}");
  return new Service("${host}:443", credentials);
}`;
    })
    .join("\n\n");

  return `import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { GoogleAuth } from "google-auth-library";
import descriptorSetJson from "../protos.json" with { type: "json" };

// Load the proto package definition once
const packageDefinition = protoLoader.loadFileDescriptorSetFromObject(
  descriptorSetJson as any,
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

function getService(packagePath: string, serviceName: string): any {
  const parts = packagePath.split(".");
  let current: any = grpcObject;
  for (const part of parts) {
    current = current[part];
    if (!current) throw new Error(\`Package path not found: \${packagePath} (failed at '\${part}')\`);
  }
  const service = current[serviceName];
  if (!service) throw new Error(\`Service not found: \${serviceName} in \${packagePath}\`);
  return service;
}

async function createCredentials(
  config: Record<string, any>,
): Promise<grpc.ChannelCredentials> {
  if (config.accessToken) {
    const callCreds = grpc.credentials.createFromMetadataGenerator(
      (_params, callback) => {
        const metadata = new grpc.Metadata();
        metadata.set("authorization", \`Bearer \${config.accessToken}\`);
        callback(null, metadata);
      },
    );
    return grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      callCreds,
    );
  }

  if (config.serviceAccountKey) {
    const auth = new GoogleAuth({
      credentials: JSON.parse(config.serviceAccountKey as string),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const callCreds = grpc.credentials.createFromGoogleCredential(auth);
    return grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      callCreds,
    );
  }

  throw new Error(
    "Either serviceAccountKey or accessToken must be provided in app configuration",
  );
}

export function createRoutingMetadata(params: Record<string, string>): grpc.Metadata {
  const metadata = new grpc.Metadata();
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => \`\${k}=\${encodeURIComponent(v)}\`)
    .join("&");
  if (parts) {
    metadata.set("x-goog-request-params", parts);
  }
  return metadata;
}

${clientFactories}
`;
}

/**
 * Generate the blocks/index.ts file with all block imports and exports.
 */
export function generateBlocksIndex(blocks: GeneratedBlock[]): string {
  const imports = blocks
    .map(
      (b) => `import ${b.blockName} from "./${b.categoryDir}/${b.blockName}.ts";`,
    )
    .join("\n");

  const entries = blocks
    .map((b) => `  ${b.categoryDir}_${b.blockName}: ${b.blockName},`)
    .join("\n");

  return `${imports}

export const blocks = {
${entries}
};
`;
}

/**
 * Generate the package.json for the output app.
 */
export function generatePackageJson(): any {
  return {
    type: "module",
    scripts: {
      typecheck: "npx tsc --noEmit",
      format: "npx prettier --write .",
      bundle: "npx flowctl version bundle -e main.ts",
    },
    dependencies: {
      "@slflows/sdk": "^0.9.0",
      "@grpc/grpc-js": "^1.12.0",
      "@grpc/proto-loader": "^0.7.0",
      "google-auth-library": "^9.0.0",
    },
    devDependencies: {
      typescript: "^5.0.0",
      prettier: "^3.0.0",
      "@types/node": "^20.0.0",
      "@useflows/flowctl": "^0.1.1",
    },
    peerDependencies: {
      "@slflows/sdk": "^0.9.0",
    },
  };
}

/**
 * Generate the tsconfig.json.
 */
export function generateTsConfig(): any {
  return {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    },
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules"],
  };
}

/**
 * Write all app files to the output directory.
 */
export async function writeAppFiles(
  config: ServiceConfig,
  blocks: GeneratedBlock[],
  blockSources: Map<string, string>,
  protoResult: ParsedProtoResult,
): Promise<void> {
  const outputDir = path.resolve(config.outputDir);

  // Create directory structure
  fs.mkdirSync(path.join(outputDir, "lib"), { recursive: true });
  fs.mkdirSync(path.join(outputDir, "blocks"), { recursive: true });

  // Create category directories
  const categories = new Set(blocks.map((b) => b.categoryDir));
  for (const cat of categories) {
    fs.mkdirSync(path.join(outputDir, "blocks", cat), { recursive: true });
  }

  // Collect service names for grpcClient generation
  const serviceNames = [...new Set(blocks.map((b) => b.serviceName))];

  // Determine the proto package path (e.g. "google.pubsub.v1")
  const protoPackage = protoResult.services[0]?.fullName
    .replace(/^\./, "")
    .replace(/\.[^.]+$/, "") || "google.pubsub.v1";

  // Write main.ts
  fs.writeFileSync(path.join(outputDir, "main.ts"), generateMainTs(config));
  console.log("  ✓ main.ts");

  // Write lib/grpcClient.ts
  fs.writeFileSync(
    path.join(outputDir, "lib", "grpcClient.ts"),
    generateGrpcClient(serviceNames, config.host, protoPackage),
  );
  console.log("  ✓ lib/grpcClient.ts");

  // Write protos.json (FileDescriptorSet for runtime)
  fs.writeFileSync(
    path.join(outputDir, "protos.json"),
    JSON.stringify(protoResult.descriptorSetJson, null, 2),
  );
  console.log("  ✓ protos.json");

  // Write block files
  for (const block of blocks) {
    const source = blockSources.get(block.blockName);
    if (source) {
      const filePath = path.join(
        outputDir,
        "blocks",
        block.categoryDir,
        block.fileName,
      );
      fs.writeFileSync(filePath, source);
    }
  }
  console.log(`  ✓ ${blocks.length} block files`);

  // Write blocks/index.ts
  fs.writeFileSync(
    path.join(outputDir, "blocks", "index.ts"),
    generateBlocksIndex(blocks),
  );
  console.log("  ✓ blocks/index.ts");

  // Write package.json
  fs.writeFileSync(
    path.join(outputDir, "package.json"),
    JSON.stringify(generatePackageJson(), null, 2),
  );
  console.log("  ✓ package.json");

  // Write tsconfig.json
  fs.writeFileSync(
    path.join(outputDir, "tsconfig.json"),
    JSON.stringify(generateTsConfig(), null, 2),
  );
  console.log("  ✓ tsconfig.json");

  // Write VERSION (only if it doesn't exist)
  const versionFile = path.join(outputDir, "VERSION");
  if (!fs.existsSync(versionFile)) {
    fs.writeFileSync(versionFile, "0.1.0\n");
    console.log("  ✓ VERSION");
  }

  // npm install
  console.log("  Installing dependencies...");
  await runCommand("npm", ["install"], outputDir);
  console.log("  ✓ Dependencies installed");

  // Format code
  console.log("  Formatting code...");
  await runCommand("npm", ["run", "format"], outputDir).catch(() => {
    console.warn("  ⚠ Formatting failed (non-fatal)");
  });
  console.log("  ✓ Code formatted");
}

function runCommand(
  cmd: string,
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, stdio: "pipe" });

    let output = "";
    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (data) => (output += data.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(" ")} failed (code ${code}):\n${output}`));
      }
    });
  });
}
