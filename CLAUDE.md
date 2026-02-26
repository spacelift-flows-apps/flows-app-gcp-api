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

## Proto-Based GCP App Generator (`scriptsv2/grpc/`)

The `scriptsv2/grpc/` directory contains a code generator that produces complete Flows apps from GCP protobuf definitions. Generated apps live in `generatedv2/`.

### Quick Reference

```bash
# Generate a single service
npx tsx scriptsv2/grpc/protoGenerator.ts storage

# Generate all configured services
npx tsx scriptsv2/grpc/protoGenerator.ts

# Typecheck a generated app
cd generatedv2/storage && npm run typecheck
```

Available services: `pubsub`, `storage`, `iam`, `cloudbuild`, `cloudfunctions`, `cloudkms`, `cloudresourcemanager`, `container`, `monitoring`, `run`, `secretmanager`, `sqladmin` (configured in `scriptsv2/grpc/protoGenerator.ts` `SERVICES` object).

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
| `grpc/protoGenerator.ts` | CLI entry point, service configs (`SERVICES` object) |
| `grpc/protoParser.ts` | Proto loading, extraction of services/messages/enums/behaviors/routing |
| `grpc/schemaMapper.ts` | Proto message/field -> JSON Schema conversion |
| `grpc/blockGenerator.ts` | Individual block `.ts` file generation |
| `grpc/appGenerator.ts` | App scaffolding (main.ts, grpcClient.ts, package.json, etc.) |
| `grpc/naming.ts` | Block/category naming, humanization, reserved word handling |
| `grpc/types.ts` | All internal type definitions |

### Generated App Structure

```
generatedv2/{service}/
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

1. Add an entry to the `SERVICES` object in `scriptsv2/grpc/protoGenerator.ts`:
   ```typescript
   newservice: {
     protoFiles: ["local/googleapis/google/newservice/v1/service.proto"],
     host: "newservice.googleapis.com",
     title: "New Service",
     outputDir: "generatedv2/newservice",
   },
   ```
2. Make sure the proto files exist under `local/googleapis/` (clone or copy from [googleapis/googleapis](https://github.com/googleapis/googleapis))
3. If the service has resource types that need category grouping, add patterns to `RESOURCE_PATTERNS` and/or `SERVICE_DEFAULTS` in `scriptsv2/grpc/naming.ts`
4. Run `npx tsx scriptsv2/grpc/protoGenerator.ts newservice`
5. Typecheck: `cd generatedv2/newservice && npm run typecheck`

### Key Design Decisions

**snake_case field names throughout.** `@grpc/proto-loader` v0.7.15 with `loadFileDescriptorSetFromObject` only accepts snake_case field names for serialization — `keepCase` and `jsonName` options have no effect. The generator uses `field.name` (proto-native snake_case) for all input config keys, request assembly, and output schemas. No case conversion happens at runtime.

**Streaming RPCs are skipped.** Only unary (request-response) RPCs become blocks. Client-streaming, server-streaming, and bidi-streaming RPCs are logged and skipped.

**Imported services are filtered out.** When generating Cloud Storage, the IAMPolicy service (imported via `google.iam.v1`) is excluded. Only services whose fully-qualified name starts with the target proto package are included.

**Field behavior filtering.** INPUT schemas exclude `OUTPUT_ONLY` fields. OUTPUT schemas exclude `INPUT_ONLY` fields. `REQUIRED` fields are marked in JSON Schema.

**Routing metadata.** Some GCP gRPC APIs (notably Cloud Storage) require `x-goog-request-params` headers. The generator parses `google.api.routing` annotations from proto source and generates metadata extraction code per-block.

**Well-known proto types.** `google.protobuf.Timestamp`, `Duration`, `FieldMask`, `Struct`, `Value`, `Empty`, and all `*Value` wrappers are mapped to appropriate JSON Schema types (see `WELL_KNOWN_TYPES` in `schemaMapper.ts`).

**Reserved words.** Block names that collide with JS/TS reserved words (e.g., `delete`) get an `Operation` suffix (e.g., `deleteOperation`). See `naming.ts`.

### Proto Source Requirements

Proto files are loaded from `local/googleapis/`. The resolver handles:
- `google/*` paths resolve from `local/googleapis/`
- Relative imports resolve from the importing file's directory
- Falls back to `protobufjs` bundled protos (e.g., `google/protobuf/*.proto`)

Field behaviors and routing annotations are regex-parsed from the raw `.proto` source (not from protobufjs options, which don't reliably expose them).

### Modifying the Generator

When changing the generator, re-run it for all services and typecheck:

```bash
npx tsx scriptsv2/grpc/protoGenerator.ts
for dir in generatedv2/*/; do (cd "$dir" && npm run typecheck); done
```

Common modification points:
- **Schema mapping**: `grpc/schemaMapper.ts` — change how proto types map to JSON Schema
- **Block template**: `grpc/blockGenerator.ts` — change the generated block structure, imports, or gRPC call pattern
- **App scaffolding**: `grpc/appGenerator.ts` — change `main.ts` template, `grpcClient.ts` template, dependencies
- **Categorization**: `grpc/naming.ts` — add `RESOURCE_PATTERNS` entries for new resource types
- **Service configs**: `grpc/protoGenerator.ts` — add/modify services in `SERVICES`
