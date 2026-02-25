import { AppBlock, events } from "@slflows/sdk/v1";
import {
  getStorageClient,
  createRoutingMetadata,
} from "../../lib/grpcClient.ts";

const testIamPermissions: AppBlock = {
  name: "Test IAM Permissions",
  description: `Tests a set of permissions on the given bucket, object, or managed folder to see which, if any, are held by the caller. The 'resource' field in the request should be 'projects/_/buckets/{bucket}' for a bucket, 'projects/_/buckets/{bucket}/objects/{object}' for an object, or 'projects/_/buckets/{bucket}/managedFolders/{managedFolder}' for a managed folder.`,
  category: "IAM",
  inputs: {
    default: {
      config: {
        resource: {
          name: "Resource",
          description: "Resource field",
          type: {
            type: "string",
          },
          required: false,
        },
        permissions: {
          name: "Permissions",
          description: "Permissions field",
          type: {
            type: "array",
            items: {
              type: "string",
            },
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getStorageClient(input.app.config);

        const request: Record<string, any> = {};
        if (input.event.inputConfig.resource !== undefined)
          request.resource = input.event.inputConfig.resource;
        if (input.event.inputConfig.permissions !== undefined)
          request.permissions = input.event.inputConfig.permissions;

        const routingParams: Record<string, string> = {};
        if (request.resource !== undefined)
          routingParams["bucket"] = String(request.resource);
        if (request.resource !== undefined) {
          const m = String(request.resource).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        if (request.resource !== undefined) {
          const m = String(request.resource).match(
            /^(projects\/[^/]+\/buckets\/[^/]+)/,
          );
          if (m) routingParams["bucket"] = m[1];
        }
        const metadata = createRoutingMetadata(routingParams);
        const result = await new Promise<any>((resolve, reject) => {
          client.testIamPermissions(
            request,
            metadata,
            (err: any, response: any) => {
              if (err)
                reject(
                  new Error(
                    `gRPC error [${err.code}]: ${err.details || err.message}`,
                  ),
                );
              else resolve(response);
            },
          );
        });

        await events.emit(result || {});
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          permissions: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: true,
      },
    },
  },
};

export default testIamPermissions;
