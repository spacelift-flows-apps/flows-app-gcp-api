/**
 * App scaffolding generation for Compute Engine REST apps.
 *
 * Generates main.ts, blocks/index.ts, lib/restClient.ts,
 * package.json, tsconfig.json, and VERSION.
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { generateTsConfig } from "../grpc/appGenerator.ts";
import { ComputeAppConfig, ComputeGeneratedBlock } from "./types.ts";

/**
 * Generate the main.ts app definition file.
 */
function generateMainTs(config: ComputeAppConfig): string {
  return `import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index.ts";

export const app = defineApp({
  name: "${config.title}",
  installationInstructions: \`## Authentication Setup

You need to authenticate with GCP using **one** of these methods:

### Option 1: Service Account Key (Simple)

1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create or select a service account
3. Grant the **Compute Admin** role (or more specific roles as needed)
4. Click **Keys** → **Add Key** → **Create New Key** → **JSON**
5. Download the JSON file
6. Paste the entire JSON contents into the **Service Account Key** field below

### Option 2: Access Token (Recommended for Production)

For better security, use short-lived access tokens instead of long-lived keys:

1. Install the **GCP Workload Identity Federation** app in your Flows workspace
2. Configure it with your OIDC provider (GitHub, GitLab, etc.)
3. Use that app to generate access tokens
4. Pass the token to the **Access Token** field below\`,
  config: {
    projectId: {
      name: "Project ID",
      description: \`Your GCP project ID.

This is used for all Compute Engine API calls. You can find it in the
[GCP Console Dashboard](https://console.cloud.google.com/home/dashboard).\`,
      type: "string",
      required: true,
    },
    serviceAccountKey: {
      name: "Service Account Key",
      description: \`**Long-lived credentials** (optional if using Access Token below)

Provide your GCP Service Account JSON key file contents.

**Not required** if you're using the **Access Token** field below.\`,
      type: "string",
      required: false,
      sensitive: true,
    },
    accessToken: {
      name: "Access Token",
      description: \`**Short-lived token** (optional if using Service Account Key above)

Provide a pre-generated GCP access token for keyless authentication.

**Recommended approach:** Use the **GCP Workload Identity Federation** app to generate short-lived tokens via OIDC.

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
 * Generate lib/restClient.ts — shared REST client utility.
 */
function generateRestClient(): string {
  return `import { GoogleAuth } from "google-auth-library";

interface ComputeFetchOptions {
  config: Record<string, any>;
  method: string;
  pathTemplate: string;
  pathParams: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: Record<string, any>;
}

async function getAccessToken(config: Record<string, any>): Promise<string> {
  if (config.accessToken) {
    return config.accessToken as string;
  }

  if (config.serviceAccountKey) {
    const auth = new GoogleAuth({
      credentials: JSON.parse(config.serviceAccountKey as string),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token!;
  }

  throw new Error(
    "Either serviceAccountKey or accessToken must be provided in app configuration",
  );
}

export async function computeFetch(options: ComputeFetchOptions): Promise<any> {
  const { config, method, pathTemplate, pathParams, queryParams, body } =
    options;
  const accessToken = await getAccessToken(config);

  // Build URL by replacing path params in template
  let urlPath = pathTemplate;
  for (const [key, value] of Object.entries(pathParams)) {
    urlPath = urlPath.replace(\`{\${key}}\`, encodeURIComponent(value));
    urlPath = urlPath.replace(\`{+\${key}}\`, encodeURIComponent(value));
  }

  const url = new URL(\`https://compute.googleapis.com\${urlPath}\`);

  // Add query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
      "Content-Type": "application/json",
    },
  };

  if (body && Object.keys(body).length > 0) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      \`GCP Compute API error: \${response.status} \${response.statusText}: \${errorBody}\`,
    );
  }

  return response.json();
}
`;
}

/**
 * Generate blocks/index.ts with all block imports and exports.
 */
function generateBlocksIndex(blocks: ComputeGeneratedBlock[]): string {
  const importId = (b: ComputeGeneratedBlock) => b.blockName;

  const imports = blocks
    .map(
      (b) =>
        `import ${importId(b)} from "./${b.categoryDir}/${b.blockName}.ts";`,
    )
    .join("\n");

  const entries = blocks
    .map((b) => `  ${importId(b)}: ${importId(b)},`)
    .join("\n");

  return `${imports}

export const blocks = {
${entries}
};
`;
}

/**
 * Generate the package.json for a compute app.
 */
function generatePackageJson(): any {
  return {
    type: "module",
    scripts: {
      typecheck: "npx tsc --noEmit",
      format: "npx prettier --write .",
      bundle: "npx flowctl version bundle -e main.ts",
    },
    dependencies: {
      "@slflows/sdk": "^0.9.0",
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
 * Write all app files to the output directory.
 */
export async function writeComputeAppFiles(
  config: ComputeAppConfig,
  blocks: ComputeGeneratedBlock[],
  blockSources: Map<string, string>,
): Promise<void> {
  const outputDir = path.resolve(config.outputDir);

  // Wipe generated directories to remove stale files
  fs.rmSync(path.join(outputDir, "blocks"), { recursive: true, force: true });
  fs.rmSync(path.join(outputDir, "lib"), { recursive: true, force: true });

  // Create directory structure
  fs.mkdirSync(path.join(outputDir, "lib"), { recursive: true });
  fs.mkdirSync(path.join(outputDir, "blocks"), { recursive: true });

  // Create category directories
  const categories = new Set(blocks.map((b) => b.categoryDir));
  for (const cat of categories) {
    fs.mkdirSync(path.join(outputDir, "blocks", cat), { recursive: true });
  }

  // Write main.ts
  fs.writeFileSync(path.join(outputDir, "main.ts"), generateMainTs(config));
  console.log("  ✓ main.ts");

  // Write lib/restClient.ts
  fs.writeFileSync(
    path.join(outputDir, "lib", "restClient.ts"),
    generateRestClient(),
  );
  console.log("  ✓ lib/restClient.ts");

  // Write block files
  for (const block of blocks) {
    const source = blockSources.get(`${block.categoryDir}/${block.blockName}`);
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
        reject(
          new Error(
            `${cmd} ${args.join(" ")} failed (code ${code}):\n${output}`,
          ),
        );
      }
    });
  });
}
