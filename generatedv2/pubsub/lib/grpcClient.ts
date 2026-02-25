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

export async function getSchemaServiceClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.pubsub.v1", "SchemaService");
  return new Service("pubsub.googleapis.com:443", credentials);
}

export async function getPublisherClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.pubsub.v1", "Publisher");
  return new Service("pubsub.googleapis.com:443", credentials);
}

export async function getSubscriberClient(
  config: Record<string, any>,
): Promise<any> {
  const credentials = await createCredentials(config);
  const Service = getService("google.pubsub.v1", "Subscriber");
  return new Service("pubsub.googleapis.com:443", credentials);
}
