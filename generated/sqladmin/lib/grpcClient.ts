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

/** Mapping between field name conventions. String = simple rename; Object = rename + recurse. */
export type FieldNameMapping = Record<
  string,
  string | { name: string; fields: FieldNameMapping }
>;

/** Recursively convert object keys using a field name mapping. */
export function convertKeys(obj: any, mapping: FieldNameMapping): any {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => convertKeys(item, mapping));
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const fieldDef = mapping[key];
    if (!fieldDef) {
      result[key] = value;
      continue;
    }
    if (typeof fieldDef === "string") {
      result[fieldDef] = value;
    } else {
      result[fieldDef.name] = convertKeys(value, fieldDef.fields);
    }
  }
  return result;
}

export async function getSqlBackupRunsServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlBackupRunsService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlBackupsServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlBackupsService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlConnectServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlConnectService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlDatabasesServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlDatabasesService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlFlagsServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlFlagsService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlInstancesServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlInstancesService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlOperationsServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlOperationsService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlSslCertsServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlSslCertsService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlTiersServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlTiersService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}

export async function getSqlUsersServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.cloud.sql.v1", "SqlUsersService");
  return new Service("sqladmin.googleapis.com:443", credentials);
}
