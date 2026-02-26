import * as grpc from "@grpc/grpc-js";
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
    if (!current)
      throw new Error(
        `Package path not found: ${packagePath} (failed at '${part}')`,
      );
  }
  const service = current[serviceName];
  if (!service)
    throw new Error(`Service not found: ${serviceName} in ${packagePath}`);
  return service;
}

async function createCredentials(
  config: Record<string, any>,
): Promise<grpc.ChannelCredentials> {
  if (config.accessToken) {
    const callCreds = grpc.credentials.createFromMetadataGenerator(
      (_params, callback) => {
        const metadata = new grpc.Metadata();
        metadata.set("authorization", `Bearer ${config.accessToken}`);
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

export function createRoutingMetadata(
  params: Record<string, string>,
): grpc.Metadata {
  const metadata = new grpc.Metadata();
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  if (parts) {
    metadata.set("x-goog-request-params", parts);
  }
  return metadata;
}

// proto-loader with loadFileDescriptorSetFromObject uses snake_case field names
// for serialization, but our input config uses camelCase. Convert at the boundary.
export function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`);
    result[snakeKey] = toSnakeCase(value);
  }
  return result;
}

export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());
    result[camelKey] = toCamelCase(value);
  }
  return result;
}

export async function getStorageClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.storage.v2", "Storage");
  return new Service("storage.googleapis.com:443", credentials);
}
