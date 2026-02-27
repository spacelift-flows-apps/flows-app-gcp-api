# Flows Overview

Flows is a workflow automation tool targeted at DevOps engineers. You have blocks on a canvas connected by lines. Those blocks may have multiple inputs and outputs on which they send and receive events. We call these blocks "entities" as they can be very powerful. New entities can be implemented by means of apps which are implemented in JavaScript. Those entities can have http endpoints, manage infrastructure resources, have a lifecycle, and more. Entities live in flows.

All configuration expressions and the code of apps are executed on agents, which are connected to the gateway via websockets. Those agents are responsible for managing Node.js runtimes for apps and for flows.

This repository is an app repo based on our Flows App Template. It can be used as a starting point for building new Flows apps.

When working on the app, **always** make sure to read the appRuntime.ts from https://docs.useflows.com/appRuntime.ts . This is later injected by the Flows runtime, you should never include it yourself. It's presented there as a reference.

If necessary, you may also consider reading the documentation about building Flows apps at https://docs.useflows.com/developers/building-apps/ , specifically:
- Configuration: https://docs.useflows.com/developers/building-apps/configuration/
- Events: https://docs.useflows.com/developers/building-apps/events/
- Lifecycle: https://docs.useflows.com/developers/building-apps/lifecycle/
- KV Storage: https://docs.useflows.com/developers/building-apps/kv-storage/
- HTTP Handlers: https://docs.useflows.com/developers/building-apps/http/
- Scheduling: https://docs.useflows.com/developers/building-apps/scheduling/
- Messaging: https://docs.useflows.com/developers/building-apps/messaging/

If necessary, you can also find other apps in public repos of the https://github.com/spacelift-flows-apps organization.

## Overview

This app demonstrates the standard patterns for Flows apps:

- Clean configuration schema with secrets support
- Simple block structure with proper error handling
- Type-safe implementation with TypeScript
- Comprehensive CI/CD pipeline

## Architecture

### App Structure

```text
{{app_name}}/
├── blocks/                   # Block implementations
│   ├── index.ts              # Block registry and exports
│   └── exampleBlock.ts       # Example block implementation
├── .github/workflows/ci.yml  # CI/CD pipeline
├── main.ts                   # App definition
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation and setup guide
```

### Key Components

#### Configuration (`main.ts`)

The app requires two configuration values:

- `apiKey` (secret) - API authentication key
- `baseUrl` (text) - API endpoint URL with default value

#### Block Organization (`blocks/`)

The template uses a clean block organization pattern:

- **`blocks/index.ts`** - Central registry that exports all blocks as a dictionary
- **`blocks/exampleBlock.ts`** - Example block implementation
- **`main.ts`** - Imports blocks via `Object.values(blocks)` for clean registration

**Example Block Features:**

- Accepts a text message as input
- Uses the configured API key and base URL
- Returns a processed result or throws errors
- Follows standard error handling patterns

## Implementation Patterns

### Block Structure

```typescript
const exampleBlock: AppBlock = {
  name: "Block Name",
  description: "What this block does",
  category: "Category",

  inputs: {
    default: {
      name: "Input Name",
      description: "Input description",
      config: {
        /* JSON Schema */
      },
      onEvent: async (input, { events }) => {
        // Block logic with error handling
      },
    },
  },

  outputs: {
    default: {
      name: "Output Name",
      description: "Output description",
      type: {
        /* JSON Schema */
      },
    },
  },
};
```

### Error Handling Pattern

```typescript
// Block logic - just throw errors, don't wrap in success/failure objects
const result = await someOperation();
await events.emit(result);
```

### Configuration Access

```typescript
const apiKey = input.app.config.apiKey as string;
const baseUrl = input.app.config.baseUrl as string;
```

### Schema

- Make sure to properly mark required field as required in the schema (whether config field, or event output).

## Development Workflow

### Local Development

1. **Setup**: `npm install`
2. **Type Check**: `npm run typecheck`
3. **Format**: `npm run format`
4. **Bundle**: `npm run bundle`

### Release Process

1. **Develop**: Make changes and test locally
2. **Commit**: Push to feature branch
3. **Review**: Create PR, wait for CI validation
4. **Release**: Tag with `v1.0.0` format
5. **Deploy**: CI automatically creates release and updates registry

### CI/CD Pipeline

The template includes a complete CI/CD system:

- **Quality Gates**: Type checking, formatting validation
- **Automated Releases**: Tag-triggered GitHub releases
- **Version Registry**: Self-maintaining `versions.json`
- **Branch Protection**: Main branch protected, requires CI

## Best Practices

### Configuration

For commonly-static fields, try providing `suggestValues`. For example, in the Jira app we have
```ts
async function fetchIssueTypes(
  jiraUrl: string,
  email: string,
  apiToken: string,
  projectKey: string,
): Promise<IssueType[]> {
  const client = createJiraClient({ jiraUrl, email, apiToken });
  const allTypes: IssueType[] = [];
  let startAt = 0;
  const maxResults = 50;

  for (let page = 0; page < 10; page++) {
    const response = await client.get<IssueTypePagedResponse>(
      `/issue/createmeta/${projectKey}/issuetypes?startAt=${startAt}&maxResults=${maxResults}`,
    );
    if (!response.issueTypes || response.issueTypes.length === 0) break;
    allTypes.push(...response.issueTypes);
    if (startAt + response.issueTypes.length >= response.total) break;
    startAt += response.issueTypes.length;
  }

  return allTypes;
}

const getIssueTypes = memoizee(fetchIssueTypes, {
  maxAge: 60000,
  promise: true,
});

// ...

inputs: {
  default: {
    config: {
      projectKey: {...},
      issueTypeName: {
        name: "Issue Type",
          description: "The name of the issue type (e.g., 'Bug', 'Task', 'Story', 'Epic')",
          type: "string",
          required: true,
          suggestValues: async (input) => {
            const { jiraUrl, email, apiToken } = input.app.config;
            const projectKey = input.staticInputConfig?.projectKey as
              | string
              | undefined;
            
            if (!projectKey) {
              return {
                suggestedValues: [],
                message:
                  "Configure static value for Project Key to receive suggestions.",
              };
            }
            
            const allTypes = await getIssueTypes(
              jiraUrl as string,
              email as string,
              apiToken as string,
              projectKey,
            );
            
            let values = allTypes.map((type) => ({
              label: type.name,
              value: type.name,
              description: type.description,
            }));
            
            if (input.searchPhrase) {
              const searchLower = input.searchPhrase.toLowerCase();
              values = values.filter(
                (v) =>
                  v.label.toLowerCase().includes(searchLower) ||
                  (v.description &&
                    v.description.toLowerCase().includes(searchLower)),
              );
            }
            
            return { suggestedValues: values.slice(0, 50) };
          },
        },
```
The memoization helps avoid making a ton of api calls as the user is fine-tuning their search phrase.

It's not worth it providing those for fields that are very dynamic, and the user will generally want to base on event data.

### Code Organization

- Modular block structure in `blocks/` directory
- Central block registry for easy management
- Clear separation of concerns
- Comprehensive type definitions

### Error Handling

- Let errors bubble up naturally - don't catch and wrap them
- Use descriptive error messages
- The framework will handle error catching and reporting

### Security

- Use `sensitive: true` for sensitive configuration
- Never log sensitive data
- Validate all inputs

### Documentation

- Clear block names and descriptions
- Comprehensive README
- Type annotations for all interfaces

## Extension Guidelines

### Adding New Blocks

1. Create block file in `blocks/` directory (e.g., `blocks/myBlock.ts`)
2. Import and add to `blocks` dictionary in `blocks/index.ts`
3. Export from `blocks/index.ts` for external use
4. Test with `npm run typecheck`

**Example:**

```typescript
// blocks/myBlock.ts
export const myBlock: AppBlock = {
  /* block definition */
};

// blocks/index.ts
import { myBlock } from "./myBlock.ts";
export const blocks = {
  example: exampleBlock,
  my: myBlock, // Add here
} as const;
```

### Adding Configuration

1. Update config schema in `main.ts`
2. Access via `input.app.config.fieldName`
3. For both app and block configs, make sure to use `default:` fields with `required: false`, when applicable, rather than using an optional field and conditionally providing a default value in app handlers.

### Adding Dependencies

1. Add to package.json dependencies
2. Import in relevant files
3. Ensure TypeScript types are available

This template provides a solid foundation for building production-ready Flows apps with modern development practices and automated deployment.

## Testing the App

The app can be submitted to Flows as a custom app, or added to a registry.

The user can use [flowctl](https://github.com/spacelift-io/flowctl) to create a custom app in their Flows organization, and then a version of the app inside of that. They will more or less have to run:
```
flowctl auth login # Follow the prompts to authenticate
flowctl app create # Follow the prompts to create the app
flowctl version update --entrypoint main.ts --watch # Follow the prompts to create a version in watch mode - this will update the app live as you make changes. Can skip --watch to just do a one-time upload.
```

More details can be found here:
- https://docs.useflows.com/developers/deploying-apps/custom-apps/
- https://docs.useflows.com/developers/deploying-apps/app-registries/

## Proto-Based GCP App Generator (`scripts/grpc/`)

The `scripts/grpc/` directory contains a code generator that produces complete Flows apps from GCP protobuf definitions. Generated apps live in `generated/`.

### Quick Reference

```bash
# Generate a single service
npx tsx scripts/grpc/protoGenerator.ts storage

# Generate all configured services
npx tsx scripts/grpc/protoGenerator.ts

# Typecheck a generated app
cd generated/storage && npm run typecheck
```

Available services: `pubsub`, `storage`, `iam`, `cloudbuild`, `cloudfunctions`, `cloudkms`, `cloudresourcemanager`, `container`, `monitoring`, `run`, `secretmanager`, `sqladmin`, `generativelanguage` (configured in `scripts/grpc/protoGenerator.ts` `SERVICES` object).

### Pipeline Overview

The generator runs in 5 steps:

1. **Parse** (`grpc/protoParser.ts`): Load `.proto` files via `protobufjs`, extract services, RPCs, messages, enums, field behaviors, comments, and routing annotations using regex on raw proto source
2. **Filter**: Keep only services from the target proto package (exclude imported dependencies like `google.iam.v1.IAMPolicy` when generating Cloud Storage)
3. **Generate block metadata** (`grpc/naming.ts`): Derive block names, categories, file names from RPC definitions
4. **Generate block source** (`grpc/blockGenerator.ts` + `grpc/schemaMapper.ts`): Create TypeScript block files with input configs, output schemas, and gRPC call logic
5. **Write app** (`grpc/appGenerator.ts`): Write `main.ts`, `lib/grpcClient.ts`, `blocks/index.ts`, `protos.json`, `package.json`, `tsconfig.json`, `VERSION`, then run `npm install` and `npm run format`

### Generator Files

| File | Purpose |
|------|---------|
| `scripts/grpc/protoGenerator.ts` | CLI entry point, service configs (`SERVICES` object) |
| `scripts/grpc/protoParser.ts` | Proto loading, extraction of services/messages/enums/behaviors/routing |
| `scripts/grpc/schemaMapper.ts` | Proto message/field -> JSON Schema conversion |
| `scripts/grpc/blockGenerator.ts` | Individual block `.ts` file generation |
| `scripts/grpc/appGenerator.ts` | App scaffolding (main.ts, grpcClient.ts, package.json, etc.) |
| `scripts/grpc/naming.ts` | Block/category naming, humanization, reserved word handling |
| `scripts/grpc/types.ts` | All internal type definitions |

### Generated App Structure

```
generated/{service}/
├── main.ts                    # App definition with auth config
├── lib/grpcClient.ts          # gRPC client factories, credential handling, routing metadata
├── blocks/
│   ├── index.ts               # Block registry (category_blockName keys)
│   ├── {category}/            # One dir per category (e.g., buckets/, objects/, iam/)
│   │   └── {blockName}.ts     # One file per unary RPC
├── protos.json                # FileDescriptorSet JSON for runtime proto loading
├── package.json
├── tsconfig.json
└── VERSION
```

### Adding a New GCP Service

1. Add an entry to the `SERVICES` object in `scripts/grpc/protoGenerator.ts`:
   ```typescript
   newservice: {
     protoFiles: ["local/googleapis/google/newservice/v1/service.proto"],
     host: "newservice.googleapis.com",
     title: "New Service",
     outputDir: "generated/newservice",
   },
   ```
2. Make sure the proto files exist under `local/googleapis/` (clone or copy from [googleapis/googleapis](https://github.com/googleapis/googleapis))
3. If the service has resource types that need category grouping, add patterns to `RESOURCE_PATTERNS` and/or `SERVICE_DEFAULTS` in `scripts/grpc/naming.ts`
4. Run `npx tsx scripts/grpc/protoGenerator.ts newservice`
5. Typecheck: `cd generated/newservice && npm run typecheck`

### Key Design Decisions

**camelCase user-facing field names with proto-derived mapping.** Input config keys and output schema properties use `field.jsonName` (camelCase, e.g. `bucketId`, `storageClass`). Since `@grpc/proto-loader` v0.7.15 requires snake_case for gRPC serialization, each generated gRPC block stores `inputMapping` (camelCase→snake_case) and `outputMapping` (snake_case→camelCase) constants derived from proto field definitions. A shared `convertKeys()` utility in `lib/grpcClient.ts` recursively converts object keys using these mappings at runtime. Identity mappings (where `jsonName === name`) are omitted. Map fields (e.g. `labels`) pass through correctly because their dynamic user-provided keys are not in the mapping. Routing code reads from the already-converted snake_case `request` object and is unaffected. The compute REST generator does not need runtime conversion since REST APIs natively use camelCase.

**Streaming RPCs are skipped.** Only unary (request-response) RPCs become blocks. Client-streaming, server-streaming, and bidi-streaming RPCs are logged and skipped.

**Imported services are filtered out.** When generating Cloud Storage, the IAMPolicy service (imported via `google.iam.v1`) is excluded. Only services whose fully-qualified name starts with the target proto package are included.

**Field behavior filtering.** INPUT schemas exclude `OUTPUT_ONLY` fields. OUTPUT schemas exclude `INPUT_ONLY` fields. `REQUIRED` fields are marked in JSON Schema.

**Routing metadata.** Some GCP gRPC APIs (notably Cloud Storage) require `x-goog-request-params` headers. The generator parses `google.api.routing` annotations from proto source and generates metadata extraction code per-block.

**Well-known proto types.** `google.protobuf.Timestamp`, `Duration`, `FieldMask`, `Struct`, `Value`, `Empty`, and all `*Value` wrappers are mapped to appropriate JSON Schema types (see `WELL_KNOWN_TYPES` in `scripts/grpc/schemaMapper.ts`).

**Reserved words.** Block names that collide with JS/TS reserved words (e.g., `delete`) get an `Operation` suffix (e.g., `deleteOperation`). See `scripts/grpc/naming.ts`.

### Proto Source Requirements

Proto files are loaded from `local/googleapis/`. The resolver handles:
- `google/*` paths resolve from `local/googleapis/`
- Relative imports resolve from the importing file's directory
- Falls back to `protobufjs` bundled protos (e.g., `google/protobuf/*.proto`)

Field behaviors and routing annotations are regex-parsed from the raw `.proto` source (not from protobufjs options, which don't reliably expose them).

### Modifying the Generator

When changing the generator, re-run it for all services and typecheck:

```bash
npx tsx scripts/grpc/protoGenerator.ts
for dir in generated/*/; do (cd "$dir" && npm run typecheck); done
```

Common modification points:
- **Schema mapping**: `scripts/grpc/schemaMapper.ts` — change how proto types map to JSON Schema
- **Block template**: `scripts/grpc/blockGenerator.ts` — change the generated block structure, imports, or gRPC call pattern
- **App scaffolding**: `scripts/grpc/appGenerator.ts` — change `main.ts` template, `grpcClient.ts` template, dependencies
- **Categorization**: `scripts/grpc/naming.ts` — add `RESOURCE_PATTERNS` entries for new resource types
- **Service configs**: `scripts/grpc/protoGenerator.ts` — add/modify services in `SERVICES`

## REST-Based Compute Engine Generator (`scripts/compute/`)

The `scripts/compute/` directory contains a separate code generator for GCP Compute Engine, which only exposes REST APIs (no gRPC). It generates 5 Flows apps in `generated/compute-*` from a single 85K-line proto file (`local/googleapis/google/cloud/compute/v1/compute.proto`) with 109 services and ~2000 RPCs.

### Quick Reference

```bash
# Generate a single compute app
npx tsx scripts/compute/computeGenerator.ts compute-instances

# Generate all 5 compute apps
npx tsx scripts/compute/computeGenerator.ts

# Typecheck a generated compute app
cd generated/compute-instances && npm run typecheck
```

Available apps: `compute-instances`, `compute-load-balancing`, `compute-networking`, `compute-security`, `compute-storage` (configured in `scripts/compute/computeGenerator.ts` `COMPUTE_APPS` object).

### Pipeline Overview

1. **Parse** proto via shared `grpc/protoParser.ts` — reuses the gRPC parser for services, RPCs, messages, enums
2. **Parse HTTP annotations** (`compute/httpAnnotationParser.ts`): Regex-parse `google.api.http` options from raw proto source to get REST method, URL template, and body field for each RPC
3. **Classify fields**: For each RPC, split request message fields into path params (from URL `{param}`), body field (from `body:` annotation), and query params (everything else)
4. **Generate block source** (`compute/blockGenerator.ts`): Create TypeScript block files using `fetch()` via a shared `computeFetch` helper
5. **Write app** (`compute/appGenerator.ts`): Write `main.ts`, `lib/restClient.ts`, `blocks/index.ts`, `package.json`, `tsconfig.json`, `VERSION`, then run `npm install` and `npm run format`

### Generator Files

| File | Purpose |
|------|---------|
| `scripts/compute/computeGenerator.ts` | CLI entry point, 5 app configs (`COMPUTE_APPS` object) |
| `scripts/compute/httpAnnotationParser.ts` | Parse `google.api.http` annotations from proto source |
| `scripts/compute/blockGenerator.ts` | REST block `.ts` file generation using `computeFetch` |
| `scripts/compute/appGenerator.ts` | App scaffolding (main.ts, restClient.ts, package.json, etc.) |
| `scripts/compute/types.ts` | Compute-specific types + re-exports from `grpc/types.ts` |

### Reused from gRPC Generator

The compute generator imports directly from `scripts/grpc/`:
- **`types.ts`**: `ParsedMessage`, `ParsedField`, `ParsedRPC`, `ParsedService`, `ParsedProtoResult`, `GeneratedBlock`
- **`naming.ts`**: `rpcToBlockName`, `humanizePascalCase`, `categoryToDirName`, `cleanComment`
- **`schemaMapper.ts`**: `messageToInputConfig`, `messageToOutputSchema`
- **`protoParser.ts`**: `parseProtoFiles`
- **`appGenerator.ts`**: `generateTsConfig`

### Generated App Structure

```
generated/compute-{category}/
├── main.ts                    # App definition with projectId + auth config
├── lib/restClient.ts          # Shared REST client (computeFetch), auth handling
├── blocks/
│   ├── index.ts               # Block registry
│   ├── {category}/            # One dir per service (e.g., instances/, disks/)
│   │   └── {blockName}.ts     # One file per RPC
├── package.json               # Only @slflows/sdk + google-auth-library (no gRPC deps)
├── tsconfig.json
└── VERSION
```

### Key Design Decisions

**REST-only, no gRPC.** Compute Engine is the only major GCP service without a gRPC endpoint. Blocks use `fetch()` via a shared `computeFetch` wrapper instead of gRPC clients. No `protos.json` is needed at runtime.

**`project` from app config.** All compute URLs contain `{project}`. This is always sourced from `input.app.config.projectId`, never from block input config. The `project` field is excluded from block input configs.

**Category = service name.** Each Compute Engine proto service IS a resource type (e.g., `Instances`, `Disks`). Category is derived from service name via `humanizePascalCase`.

**Body field flattening.** For POST/PUT/PATCH RPCs with a `body:` annotation (e.g., `body: "instance_resource"`), the referenced field's message sub-fields are flattened into block input config. At runtime, they're assembled into a request body object.

**All compute field names use camelCase.** Input config keys, query params, body fields, and output schema properties all use `field.jsonName` (camelCase). Path params read from camelCase config keys but write to the URL template's proto-name keys. No runtime mapping is needed since the REST API natively uses camelCase.

**HTTP annotation keys are composite.** Annotations are keyed as `ServiceName.RPCName` (e.g., `Instances.Get`) because many services share RPC names like `Get`, `List`, `Delete`.

### Modifying the Compute Generator

When changing the compute generator, re-run and typecheck:

```bash
npx tsx scripts/compute/computeGenerator.ts
for dir in generated/compute-*/; do (cd "$dir" && npm run typecheck); done
```

Common modification points:
- **REST client template**: `scripts/compute/appGenerator.ts` — change `computeFetch`, auth logic, URL building
- **Block template**: `scripts/compute/blockGenerator.ts` — change block structure, field classification, fetch call pattern
- **HTTP parsing**: `scripts/compute/httpAnnotationParser.ts` — change how `google.api.http` annotations are extracted
- **App configs**: `scripts/compute/computeGenerator.ts` — add/modify apps in `COMPUTE_APPS`, change service-to-app assignments

## Discovery-Based Cloud DNS Generator (`scripts/dns/`)

The `scripts/dns/` directory contains a code generator for GCP Cloud DNS, which uses a Discovery Document (REST API description) instead of proto files. It generates a single Flows app in `generated/dns/`.

### Quick Reference

```bash
# Generate the DNS app
npx tsx scripts/dns/dnsGenerator.ts

# Typecheck
cd generated/dns && npm run typecheck
```

### Pipeline Overview

1. **Parse** the Discovery Document (`scripts/dns/discoveryParser.ts`): Load `gcp-api-discovery/dns-v1.json`, extract resources, methods, parameters, and request/response schemas
2. **Generate block source** (`scripts/dns/blockGenerator.ts`): Create TypeScript block files using `fetch()` via a shared REST client
3. **Write app** (`scripts/dns/appGenerator.ts`): Write `main.ts`, REST client, `blocks/index.ts`, `package.json`, `tsconfig.json`, `VERSION`

### Generator Files

| File | Purpose |
|------|---------|
| `scripts/dns/dnsGenerator.ts` | CLI entry point, DNS app config |
| `scripts/dns/discoveryParser.ts` | Discovery Document parsing, method/schema extraction |
| `scripts/dns/blockGenerator.ts` | REST block `.ts` file generation |
| `scripts/dns/appGenerator.ts` | App scaffolding |
| `scripts/dns/schemaMapper.ts` | Discovery schema -> JSON Schema conversion |
| `scripts/dns/types.ts` | DNS-specific types |

### Key Design Decisions

**Discovery Document-based.** Cloud DNS has no gRPC/proto API. Instead, it uses a GCP Discovery Document (`dns-v1.json`) which describes the REST API including resources, methods, parameters, and schemas. This is a different input format than proto files but produces the same style of Flows app.

**Reuses gRPC naming utilities.** The DNS generator imports `rpcToBlockName`, `humanizePascalCase`, and `categoryToDirName` from `scripts/grpc/naming.ts`.

## Regenerating All Apps

The `scripts/regenerate_all.sh` script runs all three generators (gRPC, Compute, DNS) and then formats and type-checks every generated app:

```bash
./scripts/regenerate_all.sh
```

This will clone `googleapis` protos if not present, generate all apps into `generated/`, format them, and type-check them.
