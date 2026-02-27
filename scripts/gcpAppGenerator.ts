#!/usr/bin/env node

/**
 * GCP Flows App Generator
 *
 * Generates Flows apps from GCP API Discovery Documents (OpenAPI-based)
 * This mirrors the AWS generator pattern but for GCP services
 */

import fs from "fs";
import path from "path";
import { spawn } from "child_process";

// Types for GCP Discovery Document structure
interface DiscoveryDocument {
  kind: string;
  discoveryVersion: string;
  id: string;
  name: string;
  version: string;
  title: string;
  description: string;
  documentationLink?: string;
  protocol: string;
  baseUrl: string;
  basePath: string;
  rootUrl: string;
  servicePath: string;
  parameters?: Record<string, Parameter>;
  auth?: AuthConfig;
  schemas?: Record<string, Schema>;
  resources?: Record<string, Resource>;
  methods?: Record<string, Method>;
}

interface Parameter {
  type: string;
  description?: string;
  required?: boolean;
  location?: string;
  enum?: string[];
  default?: any;
}

interface Schema {
  id?: string;
  type: string;
  description?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  additionalProperties?: boolean | Schema;
  enum?: string[];
  enumDescriptions?: string[];
  $ref?: string;
  readOnly?: boolean;
  format?: string;
}

interface Method {
  id: string;
  path: string;
  httpMethod: string;
  description?: string;
  parameters?: Record<string, Parameter>;
  request?: { $ref: string };
  response?: { $ref: string };
  scopes?: string[];
}

interface Resource {
  methods?: Record<string, Method>;
  resources?: Record<string, Resource>;
}

interface AuthConfig {
  oauth2?: {
    scopes?: Record<string, { description: string }>;
  };
}

interface ServiceMetadata {
  name: string;
  version: string;
  title: string;
  description: string;
  baseUrl: string;
  packageName: string;
}

interface ParsedService {
  metadata: ServiceMetadata;
  methods: Record<string, Method>;
  schemas: Record<string, Schema>;
}

interface ServiceBreakdown {
  service: string;
  description: string;
  apps: Record<
    string,
    {
      name: string;
      description: string;
      methods: string[];
    }
  >;
}

class GCPAppGenerator {
  private services: Map<string, ParsedService> = new Map();
  private breakdowns: Map<string, ServiceBreakdown> = new Map();

  /**
   * Load GCP Discovery Documents from a directory
   */
  async loadDiscoveryDocuments(discoveryPath: string) {
    console.log(`Loading GCP Discovery Documents from ${discoveryPath}...`);

    if (!fs.existsSync(discoveryPath)) {
      throw new Error(`Discovery directory not found: ${discoveryPath}`);
    }

    const files = fs
      .readdirSync(discoveryPath)
      .filter((file) => file.endsWith(".json"));

    console.log(`Found ${files.length} discovery documents`);

    for (const file of files) {
      try {
        const filePath = path.join(discoveryPath, file);
        const service = await this.loadDiscoveryDocument(filePath);
        if (service) {
          this.services.set(service.metadata.name, service);
          console.log(`✓ Loaded ${service.metadata.title}`);
        }
      } catch (error: any) {
        console.warn(`⚠ Failed to load ${file}:`, error.message);
      }
    }

    console.log(`Successfully loaded ${this.services.size} services`);

    // Load service breakdown configurations
    await this.loadBreakdownConfigurations();
  }

  /**
   * Load service breakdown configurations from JSON files
   */
  private async loadBreakdownConfigurations() {
    console.log("Loading service breakdown configurations...");

    const breakdownsDir = path.resolve("./breakdowns");

    try {
      if (!fs.existsSync(breakdownsDir)) {
        console.log(
          "No breakdowns directory found, proceeding without breakdowns"
        );
        return;
      }

      const breakdownFiles = fs
        .readdirSync(breakdownsDir)
        .filter((file: string) => file.endsWith("-breakdown.json"));

      for (const file of breakdownFiles) {
        try {
          const filePath = path.join(breakdownsDir, file);
          const content = fs.readFileSync(filePath, "utf8");
          const breakdown: ServiceBreakdown = JSON.parse(content);
          this.breakdowns.set(breakdown.service, breakdown);
          console.log(
            `✓ Loaded breakdown configuration for ${breakdown.service}`
          );
        } catch (error: any) {
          console.warn(
            `⚠ Failed to load breakdown file ${file}:`,
            error.message
          );
        }
      }
    } catch (error: any) {
      console.log(
        "Error reading breakdowns directory, proceeding without breakdowns"
      );
    }
  }

  private async loadDiscoveryDocument(
    filePath: string
  ): Promise<ParsedService | null> {
    const content = fs.readFileSync(filePath, "utf8");
    const doc: DiscoveryDocument = JSON.parse(content);

    // Extract all methods from resources
    const methods: Record<string, Method> = {};
    this.extractMethods(doc.resources || {}, methods, "");

    // Also check for top-level methods
    if (doc.methods) {
      Object.entries(doc.methods).forEach(([name, method]) => {
        methods[name] = method;
      });
    }

    return {
      metadata: {
        name: doc.name,
        version: doc.version,
        title: doc.title,
        description: doc.description,
        baseUrl: doc.rootUrl + doc.servicePath,
        packageName: this.getGCPPackageName(doc.name),
      },
      methods,
      schemas: doc.schemas || {},
    };
  }

  /**
   * Recursively extract methods from nested resources
   */
  private extractMethods(
    resources: Record<string, Resource>,
    methods: Record<string, Method>,
    prefix: string
  ) {
    for (const [resourceName, resource] of Object.entries(resources)) {
      const resourcePrefix = prefix ? `${prefix}.${resourceName}` : resourceName;

      if (resource.methods) {
        for (const [methodName, method] of Object.entries(resource.methods)) {
          const fullMethodName = `${resourcePrefix}.${methodName}`;
          methods[fullMethodName] = method;
        }
      }

      if (resource.resources) {
        this.extractMethods(resource.resources, methods, resourcePrefix);
      }
    }
  }

  /**
   * Generate Flows app for a specific GCP service
   */
  async generateServiceApp(serviceName: string, outputDir: string) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service not loaded: ${serviceName}`);
    }

    const breakdown = this.breakdowns.get(serviceName);

    if (breakdown) {
      console.log(
        `Found breakdown configuration for ${serviceName}, generating ${
          Object.keys(breakdown.apps).length
        } separate apps...`
      );

      for (const [appKey, appConfig] of Object.entries(breakdown.apps)) {
        await this.generateBreakdownApp(
          service,
          breakdown,
          appKey,
          appConfig,
          outputDir
        );
      }

      console.log(
        `✓ Generated ${
          Object.keys(breakdown.apps).length
        } separate apps for ${serviceName}`
      );
    } else {
      console.log(
        `Generating single app for ${service.metadata.title}...`
      );

      const appDir = path.join(outputDir, serviceName);
      fs.mkdirSync(appDir, { recursive: true });

      await this.generateMainApp(service, appDir);
      const blocksDir = path.join(appDir, "blocks");
      fs.mkdirSync(blocksDir, { recursive: true });

      await this.generateActionBlocks(service, blocksDir);
      await this.generatePackageJson(service, appDir);
      await this.generateConfigs(appDir);
      await this.generateVersionFile(appDir);
      await this.formatCode(service, appDir);

      console.log(`✓ Generated ${serviceName} app in ${appDir}`);
    }
  }

  /**
   * Generate a separate app directory for a breakdown category
   */
  private async generateBreakdownApp(
    service: ParsedService,
    breakdown: ServiceBreakdown,
    appKey: string,
    appConfig: { name: string; description: string; methods: string[] },
    outputDir: string
  ) {
    console.log(`Generating ${appConfig.name} app...`);

    const appDir = path.join(outputDir, appKey);
    fs.mkdirSync(appDir, { recursive: true });

    // Filter methods for this breakdown app
    const filteredMethods: Record<string, Method> = {};
    const filteredBlocks: string[] = [];

    for (const methodName of appConfig.methods) {
      if (service.methods[methodName]) {
        filteredMethods[methodName] = service.methods[methodName];
        filteredBlocks.push(this.methodNameToBlockName(methodName));
      } else {
        console.warn(
          `⚠ Method ${methodName} not found in ${breakdown.service} service`
        );
      }
    }

    const filteredService: ParsedService = {
      ...service,
      methods: filteredMethods,
    };

    // Generate main.ts
    const content = this.generateMainAppContent(appConfig.name);
    fs.writeFileSync(path.join(appDir, "main.ts"), content);

    // Generate blocks
    const blocksDir = path.join(appDir, "blocks");
    fs.mkdirSync(blocksDir, { recursive: true });
    await this.generateActionBlocks(filteredService, blocksDir);

    // Generate configs
    await this.generatePackageJson(filteredService, appDir);
    await this.generateConfigs(appDir);
    await this.generateVersionFile(appDir);
    await this.formatCode(filteredService, appDir);

    console.log(`✓ Generated ${appConfig.name} app in ${appDir}`);
  }

  private async generateMainApp(service: ParsedService, appDir: string) {
    const content = this.generateMainAppContent(service.metadata.title);
    fs.writeFileSync(path.join(appDir, "main.ts"), content);
  }

  private generateMainAppContent(appName: string): string {
    return `import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks";

export const app = defineApp({
  name: "${appName}",
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

This approach eliminates the need for long-lived credentials and provides better audit trails.

## Project ID

Find your GCP Project ID:
- In the [GCP Console](https://console.cloud.google.com) (top navigation)
- Or run: \\\`gcloud config get-value project\\\`\`,
  config: {
    projectId: {
      name: "Project ID",
      description: \`Your GCP Project ID (e.g., \\\`my-project-123\\\`)

Find this in the [GCP Console](https://console.cloud.google.com) or run:
\\\`\\\`\\\`bash
gcloud config get-value project
\\\`\\\`\\\`\`,
      type: "string",
      required: true,
    },
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

  private async generateActionBlocks(
    service: ParsedService,
    blocksDir: string
  ) {
    const methods = Object.entries(service.methods);
    const blocksByCategory = new Map<string, Array<{ name: string; methodName: string; method: Method }>>();

    // Group blocks by category
    for (const [methodName, method] of methods) {
      const blockName = this.methodNameToBlockName(methodName);
      const category = this.extractCategory(methodName);
      const categoryDir = this.categoryToDirectoryName(category);

      if (!blocksByCategory.has(categoryDir)) {
        blocksByCategory.set(categoryDir, []);
      }
      blocksByCategory.get(categoryDir)!.push({ name: blockName, methodName, method });
    }

    // Generate blocks organized by category
    const allBlocks: Array<{ name: string; category: string }> = [];

    for (const [categoryDir, blocks] of blocksByCategory) {
      const categoryPath = path.join(blocksDir, categoryDir);
      fs.mkdirSync(categoryPath, { recursive: true });

      for (const { name: blockName, methodName, method } of blocks) {
        const fileName = `${blockName}.ts`;
        await this.generateActionBlock(
          service,
          methodName,
          method,
          path.join(categoryPath, fileName)
        );
        allBlocks.push({ name: blockName, category: categoryDir });
      }
    }

    // Generate index.ts with imports from category directories
    // Use category_name_index format for unique keys to avoid collisions
    // Track used keys to ensure uniqueness
    const usedKeys = new Set<string>();
    const getUniqueKey = (category: string, name: string): string => {
      let key = `${category}_${name}`;
      let counter = 0;
      while (usedKeys.has(key)) {
        counter++;
        key = `${category}_${name}_${counter}`;
      }
      usedKeys.add(key);
      return key;
    };

    const indexContent =
      allBlocks
        .map(({ name, category }, index) => `import ${name}_${index} from './${category}/${name}';`)
        .join("\n") +
      "\n\nexport const blocks = {\n" +
      allBlocks.map(({ name, category }, index) => {
        const key = getUniqueKey(category, name);
        return `  ${key}: ${name}_${index},`;
      }).join("\n") +
      "\n};\n";

    fs.writeFileSync(path.join(blocksDir, "index.ts"), indexContent);
  }

  private async generateActionBlock(
    service: ParsedService,
    methodName: string,
    method: Method,
    filePath: string
  ) {
    const blockName = this.methodNameToBlockName(methodName);
    const packageName = service.metadata.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generateInputConfig(service, method);
    const outputType = this.generateOutputType(service, method);
    const category = this.extractCategory(methodName);
    const humanName = this.createHumanName(methodName, category);

    // Get request body field names for assembly (excluding project fields)
    const requestBodyFields: string[] = [];
    const hasProjectInBody = method.request?.$ref ?
      Object.keys(service.schemas[method.request.$ref]?.properties || {})
        .some(k => ['project', 'projectId', 'projectsId'].includes(k)) : false;

    if (method.request?.$ref) {
      const schema = service.schemas[method.request.$ref];
      if (schema?.properties) {
        requestBodyFields.push(...Object.keys(schema.properties).filter(key => {
          const propSchema = schema.properties![key];
          const description = propSchema.description || '';
          const resolved = this.resolveRef(propSchema, service.schemas);
          // Skip deprecated, project-related, and readOnly fields
          return !description.toLowerCase().includes('deprecated') &&
                 !['project', 'projectId', 'projectsId'].includes(key) &&
                 !propSchema.readOnly &&
                 !resolved.readOnly;
        }));
      }
    }

    // Generate request body assembly code
    const requestBodyAssembly = requestBodyFields.length > 0 || hasProjectInBody
      ? `// Assemble request body from individual inputs
        const requestBody: Record<string, any> = {};
        ${hasProjectInBody ? `requestBody.projectId = input.app.config.projectId;` : ''}
        ${requestBodyFields.map(field => `if (input.event.inputConfig.${field} !== undefined) requestBody.${field} = input.event.inputConfig.${field};`).join('\n        ')}

        if (Object.keys(requestBody).length > 0) {
          requestOptions.body = JSON.stringify(requestBody);
        }`
      : '';

    const content = `import { AppBlock, events } from "@slflows/sdk/v1";
import { GoogleAuth } from "google-auth-library";

const ${blockName}: AppBlock = {
  name: "${humanName}",
  description: \`${this.cleanDocumentation(method.description || "")}\`,
  category: "${category}",
  inputs: {
    default: {
      config: ${JSON.stringify(inputConfig, null, 8).replace(/"/g, '"')},
      onEvent: async (input) => {
        // Support both service account keys and pre-generated access tokens
        let accessToken: string;

        if (input.app.config.accessToken) {
          // Use pre-generated access token (Workload Identity Federation, etc.)
          accessToken = input.app.config.accessToken;
        } else if (input.app.config.serviceAccountKey) {
          // Parse service account credentials and generate token
          const credentials = JSON.parse(input.app.config.serviceAccountKey);

          const auth = new GoogleAuth({
            credentials,
            scopes: ${JSON.stringify(method.scopes || ["https://www.googleapis.com/auth/cloud-platform"])},
          });

          const client = await auth.getClient();
          const token = await client.getAccessToken();
          accessToken = token.token!;
        } else {
          throw new Error("Either serviceAccountKey or accessToken must be provided in app configuration");
        }

        // Build request URL and parameters
        const baseUrl = "${service.metadata.baseUrl}";
        let path = \`${method.path}\`;

        // Replace project placeholders with config value
        path = path.replace(/\\{\\+?project(s|Id)?\\}/g, input.app.config.projectId);

        const url = baseUrl + path;

        // Make API request using fetch
        const requestOptions: RequestInit = {
          method: "${method.httpMethod}",
          headers: {
            "Authorization": \`Bearer \${accessToken}\`,
            "Content-Type": "application/json",
          },
        };

        ${requestBodyAssembly}

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(\`GCP API error: \${response.status} \${response.statusText}: \${errorBody}\`);
        }

        const result = await response.json();
        await events.emit(result || {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: ${JSON.stringify(outputType, null, 6)},
    },
  },
};

export default ${blockName};
`;

    fs.writeFileSync(filePath, content);
  }

  private generateInputConfig(
    service: ParsedService,
    method: Method
  ): Record<string, any> {
    const fields: Array<{ key: string; value: any }> = [];

    // Add URL/path parameters
    if (method.parameters) {
      for (const [paramName, param] of Object.entries(method.parameters)) {
        // Skip deprecated parameters
        const description = param.description || `Parameter: ${paramName}`;
        if (description.toLowerCase().includes('deprecated')) {
          continue;
        }

        // Skip project-related parameters - these come from app config
        if (['project', 'projectId', 'projectsId'].includes(paramName)) {
          continue;
        }

        // Use the unified type mapper via a synthesized schema
        const paramSchema: Schema = { type: param.type, enum: param.enum };
        const paramType = this.schemaToFlowsType(paramSchema, service.schemas);

        fields.push({
          key: paramName,
          value: {
            name: this.humanizeName(paramName),
            description: description,
            type: paramType,
            required: param.required || false,
          },
        });
      }
    }

    // Flatten request body properties into top-level inputs
    if (method.request?.$ref) {
      const schema = service.schemas[method.request.$ref];
      if (schema?.properties) {
        for (const [propName, propSchema] of Object.entries(schema.properties)) {
          // Skip deprecated properties
          const description = propSchema.description || `Request body field: ${propName}`;
          if (description.toLowerCase().includes('deprecated')) {
            continue;
          }

          // Skip project-related parameters - these come from app config
          if (['project', 'projectId', 'projectsId'].includes(propName)) {
            continue;
          }

          // Skip readOnly fields - these are output-only and shouldn't be user inputs
          // readOnly can be on the property itself (before $ref) or on the resolved schema
          if (propSchema.readOnly) {
            continue;
          }
          const resolved = this.resolveRef(propSchema, service.schemas);
          if (resolved.readOnly) {
            continue;
          }

          fields.push({
            key: propName,
            value: {
              name: this.humanizeName(propName),
              description: this.cleanDocumentation(description),
              type: this.schemaToFlowsType(propSchema, service.schemas),
              required: schema.required?.includes(propName) || false,
            },
          });
        }
      }
    }

    // Sort: required fields first, then optional
    fields.sort((a, b) => {
      if (a.value.required && !b.value.required) return -1;
      if (!a.value.required && b.value.required) return 1;
      return 0;
    });

    // Convert back to object (preserving sorted order)
    const config: Record<string, any> = {};
    for (const { key, value } of fields) {
      config[key] = value;
    }

    return config;
  }

  private generateOutputType(
    service: ParsedService,
    method: Method
  ): any {
    if (!method.response?.$ref) {
      return { type: "object", additionalProperties: true };
    }

    const schema = service.schemas[method.response.$ref];
    if (!schema) {
      return { type: "object", additionalProperties: true };
    }

    return this.schemaToFlowsType(schema, service.schemas);
  }

  /**
   * Resolve $ref indirection without counting as depth increase.
   * Returns the resolved schema (or the original if no $ref).
   */
  private resolveRef(
    schema: Schema,
    allSchemas: Record<string, Schema>
  ): Schema {
    if (schema.$ref) {
      const resolved = allSchemas[schema.$ref];
      if (resolved) return resolved;
    }
    return schema;
  }

  private schemaToFlowsType(
    schema: Schema,
    allSchemas: Record<string, Schema>,
    depth = 0
  ): any {
    // Prevent infinite recursion (max observed chain is 8 in compute-v1)
    if (depth > 10) {
      return { type: "object", additionalProperties: true };
    }

    // Resolve $ref without incrementing depth — it's indirection, not nesting
    const resolved = this.resolveRef(schema, allSchemas);

    // Build description: use schema description, append format hint if present
    const description = this.buildSchemaDescription(resolved);

    switch (resolved.type) {
      case "object": {
        if (resolved.properties) {
          const properties: Record<string, any> = {};
          const required: string[] = resolved.required || [];

          for (const [propName, propSchema] of Object.entries(resolved.properties)) {
            properties[propName] = this.schemaToFlowsType(
              propSchema,
              allSchemas,
              depth + 1
            );
          }

          const result: any = { type: "object", properties };
          if (required.length > 0) {
            result.required = required;
          }
          if (description) {
            result.description = description;
          }
          result.additionalProperties = true;
          return result;
        }

        // Map types: additionalProperties with typed values (e.g., labels: { additionalProperties: { type: "string" } })
        if (resolved.additionalProperties && typeof resolved.additionalProperties === 'object') {
          const apSchema = resolved.additionalProperties as Schema;
          const apResolved = this.resolveRef(apSchema, allSchemas);
          const apType = apResolved.type || 'string';
          const validTypes = ['string', 'number', 'boolean', 'object', 'array'];
          if (validTypes.includes(apType)) {
            const result: any = {
              type: "object",
              additionalProperties: { type: apType as "string" | "number" | "boolean" | "object" | "array" },
            };
            if (description) {
              result.description = description;
            }
            return result;
          }
        }

        const result: any = { type: "object", additionalProperties: true };
        if (description) {
          result.description = description;
        }
        return result;
      }

      case "array": {
        if (resolved.items) {
          const result: any = {
            type: "array",
            items: this.schemaToFlowsType(resolved.items, allSchemas, depth + 1),
          };
          if (description) {
            result.description = description;
          }
          return result;
        }
        const result: any = { type: "array", items: { type: "any" } };
        if (description) {
          result.description = description;
        }
        return result;
      }

      case "string": {
        if (resolved.enum) {
          const result: any = { type: "string", enum: resolved.enum };
          if (description) {
            result.description = description;
          }
          return result;
        }
        if (description) {
          return { type: "string", description };
        }
        return { type: "string" };
      }

      case "integer":
        if (description) {
          return { type: "integer", description };
        }
        return { type: "integer" };

      case "number":
        if (description) {
          return { type: "number", description };
        }
        return { type: "number" };

      case "boolean":
        if (description) {
          return { type: "boolean", description };
        }
        return { type: "boolean" };

      default:
        if (description) {
          return { type: "string", description };
        }
        return { type: "string" };
    }
  }

  /**
   * Build a description string for a schema, appending format hint if present.
   */
  private buildSchemaDescription(schema: Schema): string | undefined {
    let desc = schema.description?.trim();
    if (schema.format) {
      const formatHint = `Format: ${schema.format}`;
      desc = desc ? `${desc} (${formatHint})` : formatHint;
    }
    return desc || undefined;
  }


  private async generatePackageJson(service: ParsedService, appDir: string) {
    // Only include @google-cloud packages that actually exist on npm
    // Most GCP APIs are accessed via REST API with google-auth-library
    const hasNpmPackage = [
      "compute",
      "storage",
      "container",
      "monitoring",
      "pubsub",
      "run",
      "dns",
    ].includes(service.metadata.name);

    const packageJson = {
      scripts: {
        typecheck: "npx tsc --noEmit",
        format: "npx prettier --write .",
        bundle: "npx flowctl version bundle -e main.ts",
      },
      dependencies: {
        "@slflows/sdk": "^0.9.0",
        "google-auth-library": "^9.0.0",
        ...(hasNpmPackage ? { [service.metadata.packageName]: "^3.0.0" } : {}),
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
      overrides: {
        "protobufjs": ">=7.2.5",
      },
    };

    fs.writeFileSync(
      path.join(appDir, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    // Run npm install
    console.log(`Installing dependencies for ${service.metadata.name}...`);

    return new Promise<void>((resolve, reject) => {
      const npmInstall = spawn("npm", ["install"], {
        cwd: appDir,
        stdio: "pipe",
      });

      let output = "";
      npmInstall.stdout.on("data", (data) => {
        output += data.toString();
      });

      npmInstall.stderr.on("data", (data) => {
        output += data.toString();
      });

      npmInstall.on("close", (code) => {
        if (code === 0) {
          console.log(
            `✓ Dependencies installed for ${service.metadata.name}`
          );
          resolve();
        } else {
          console.error(
            `✗ npm install failed for ${service.metadata.name}:`
          );
          console.error(output);
          reject(new Error(`npm install failed with code ${code}`));
        }
      });
    });
  }

  private async generateVersionFile(appDir: string) {
    const versionFile = path.join(appDir, "VERSION");

    if (fs.existsSync(versionFile)) {
      console.log(`VERSION file already exists in ${appDir}, skipping...`);
      return;
    }

    fs.writeFileSync(versionFile, "0.1.0\n");
    console.log(`✓ Created VERSION file with 0.1.0 in ${appDir}`);
  }

  private async generateConfigs(appDir: string) {
    const tsConfig = {
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

    fs.writeFileSync(
      path.join(appDir, "tsconfig.json"),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  private async formatCode(service: ParsedService, appDir: string) {
    console.log(`Formatting code for ${service.metadata.name}...`);

    return new Promise<void>((resolve, reject) => {
      const prettierFormat = spawn("npm", ["run", "format"], {
        cwd: appDir,
        stdio: "pipe",
      });

      let output = "";
      prettierFormat.stdout.on("data", (data) => {
        output += data.toString();
      });

      prettierFormat.stderr.on("data", (data) => {
        output += data.toString();
      });

      prettierFormat.on("close", (code) => {
        if (code === 0) {
          console.log(`✓ Code formatted for ${service.metadata.name}`);
          resolve();
        } else {
          console.warn(
            `⚠ Code formatting failed for ${service.metadata.name}:`
          );
          console.warn(output);
          resolve();
        }
      });
    });
  }

  // Utility methods
  private preserveAbbreviations(text: string): string {
    // Common technical abbreviations that should stay uppercase
    const abbreviations = [
      'IAM', 'IP', 'KAJ', 'EKM', 'URL', 'HTTP', 'TCP', 'HTTPS', 'SSL',
      'VPN', 'JWKS', 'ABAC', 'DNS', 'DNSSEC', 'SSRS', 'CA', 'CAs', 'SQL', 'HMAC',
      'ID', 'IDs', 'API', 'JSON', 'VM', 'VPC', 'ACL', 'KMS', 'GCP',
      'OIDC', 'OAuth', 'TLS', 'SSH', 'NAT', 'LB', 'CDN', 'DDoS'
    ];

    let result = text;
    for (const abbr of abbreviations) {
      // Match whole words only (case-insensitive)
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      result = result.replace(regex, abbr);
    }
    return result;
  }

  private createHumanName(methodName: string, category: string): string {
    // Create "Category - Operation" format
    // forwardingRules.aggregatedList -> "Forwarding Rules - Aggregated List"
    // topics.publish -> "Topics - Publish"

    const parts = methodName.split(".");
    const filtered = parts.filter(p => !["projects"].includes(p));

    // Get the operation (last part)
    const operation = filtered[filtered.length - 1];

    // Humanize the operation part
    let humanOperation = operation
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Preserve common abbreviations
    humanOperation = this.preserveAbbreviations(humanOperation);

    return `${category} - ${humanOperation}`;
  }

  private categoryToDirectoryName(category: string): string {
    // Convert "Bucket Access Controls" to "bucket_access_controls"
    return category
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  private extractCategory(methodName: string): string {
    // Extract the resource type as category
    // projects.topics.publish -> Topics
    // instances.list -> Instances
    // locations.functions.list -> Functions (not Locations!)
    // locations.getKajPolicyConfig -> Configuration (single method, use generic category)
    const parts = methodName.split(".");

    // Filter out "projects" and "locations" (locations is just a namespace)
    const filtered = parts.filter(p => !["projects", "locations"].includes(p));

    if (filtered.length === 0) {
      return "General";
    }

    // If only one part remains (e.g., getKajPolicyConfig), it's a single standalone method
    // Use a generic category based on common patterns
    if (filtered.length === 1) {
      const method = filtered[0].toLowerCase();
      if (method.includes('config')) return "Configuration";
      if (method.includes('policy')) return "Policy";
      if (method.includes('setting')) return "Settings";
      return "Operations";
    }

    // If we have multiple parts (e.g., functions.list or keyRings.cryptoKeys.create),
    // use the second-to-last part as the category (the actual resource)
    const resourceName = filtered.length > 2 ? filtered[filtered.length - 2] : filtered[0];

    // Capitalize and make it readable
    let category = resourceName
      .charAt(0).toUpperCase() +
      resourceName.slice(1)
      .replace(/([A-Z])/g, " $1")
      .trim();

    // Preserve common abbreviations in categories
    category = this.preserveAbbreviations(category);

    return category;
  }

  private methodNameToBlockName(methodName: string): string {
    // Convert method names to block names, removing intermediate path segments
    // projects.locations.connections.create -> connectionsCreate
    // locations.functions.list -> functionsList
    // projects.secrets.versions.access -> versionsAccess (not secretsVersionsAccess)
    const parts = methodName.split(".");

    // Remove common prefixes like "projects" and "locations" that don't add value
    const filtered = parts.filter(p => !["projects", "locations"].includes(p));

    // For block names, only use the last 2 parts (resource + operation)
    // This prevents names like "secretsVersionsAccess" and creates "versionsAccess" instead
    const relevant = filtered.length > 2 ? filtered.slice(-2) :
                    filtered.length > 0 ? filtered :
                    parts.slice(-2);

    const blockName = relevant
      .map((part, i) => {
        // Remove hyphens and capitalize following letter (kebab-case to camelCase)
        const normalized = part.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return i === 0 ? normalized : this.capitalize(normalized);
      })
      .join("");

    // Handle reserved JavaScript/TypeScript keywords
    const reservedKeywords = [
      'delete', 'default', 'export', 'import', 'return', 'break', 'case',
      'catch', 'class', 'const', 'continue', 'debugger', 'do', 'else',
      'enum', 'extends', 'false', 'finally', 'for', 'function', 'if',
      'implements', 'in', 'instanceof', 'interface', 'let', 'new', 'null',
      'package', 'private', 'protected', 'public', 'static', 'super',
      'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void',
      'while', 'with', 'yield'
    ];

    if (reservedKeywords.includes(blockName.toLowerCase())) {
      return blockName + 'Operation';
    }

    return blockName;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private humanizeName(str: string): string {
    // Convert camelCase or dotted.path to "Human Readable" format
    // backendBucket -> "Backend Bucket"
    // projects.topics.publish -> "Topics Publish" (drop "projects")

    // Handle dotted paths
    const parts = str.split(".");
    const filtered = parts.filter(p => !["projects"].includes(p));
    const relevant = filtered.length > 0 ? filtered : parts;

    let humanized = relevant
      .map(part => {
        // Split camelCase: backendBucket -> backend Bucket
        const spaced = part
          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")  // Handle HTTPSProxy -> HTTPS Proxy
          .replace(/([a-z\d])([A-Z])/g, "$1 $2");      // Handle backendBucket -> backend Bucket

        // Capitalize each word
        return spaced
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Preserve common abbreviations (will uppercase them)
    return this.preserveAbbreviations(humanized);
  }

  private getGCPPackageName(serviceName: string): string {
    // GCP uses @google-cloud/service-name pattern
    return `@google-cloud/${serviceName}`;
  }

  private cleanDocumentation(doc: string): string {
    if (!doc) return "";

    let cleaned = doc
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .replace(/`/g, "'")  // Replace backticks with single quotes to avoid template literal issues
      .trim();

    const firstSentenceMatch = cleaned.match(/^[^.]*\./);
    if (firstSentenceMatch) {
      return firstSentenceMatch[0];
    }

    return cleaned.substring(0, 100) + (cleaned.length > 100 ? "..." : "");
  }
}

// Hardcoded list of services to generate (common GCP DevOps services)
const SERVICES_TO_GENERATE = [
  "compute",
  "storage",
  "container",
  "cloudfunctions",
  "cloudresourcemanager",
  "iam",
  "monitoring",
  "pubsub",
  "cloudbuild",
  "run",
  "secretmanager",
  "dns",
  "cloudkms",
  "sqladmin",
] as const;

// CLI interface
async function main() {
  const generator = new GCPAppGenerator();

  const discoveryPath = "./gcp-api-discovery";
  const outputDir = "./generated";

  const args = process.argv.slice(2);
  const serviceName = args[0];

  try {
    await generator.loadDiscoveryDocuments(discoveryPath);

    if (serviceName) {
      if (!SERVICES_TO_GENERATE.includes(serviceName as any)) {
        console.error(`❌ Service '${serviceName}' is not in the supported services list.`);
        console.log(`Supported services: ${SERVICES_TO_GENERATE.join(', ')}`);
        process.exit(1);
      }

      console.log(`📦 Generating ${serviceName}...`);
      await generator.generateServiceApp(serviceName, outputDir);
      console.log(`✅ Successfully generated ${serviceName}`);
    } else {
      console.log(
        `Generating apps for ${SERVICES_TO_GENERATE.length} GCP services...`
      );

      for (const serviceName of SERVICES_TO_GENERATE) {
        try {
          console.log(`\n📦 Generating ${serviceName}...`);
          await generator.generateServiceApp(serviceName, outputDir);
          console.log(`✅ Successfully generated ${serviceName}`);
        } catch (error: any) {
          console.error(`❌ Failed to generate ${serviceName}:`, error.message);
        }
      }

      console.log("\n🎉 Generation complete!");
    }
  } catch (error: any) {
    console.error("❌ Generation failed:", error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  main();
}

export { GCPAppGenerator };
