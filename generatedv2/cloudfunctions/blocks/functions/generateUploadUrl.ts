import { AppBlock, events } from "@slflows/sdk/v1";
import { getFunctionServiceClient, convertKeys } from "../../lib/grpcClient.ts";

const inputMapping = {
  kmsKeyName: "kms_key_name",
};

const outputMapping = {
  upload_url: "uploadUrl",
  storage_source: {
    name: "storageSource",
    fields: {
      source_upload_url: "sourceUploadUrl",
    },
  },
};

const generateUploadUrl: AppBlock = {
  name: "Generate Upload Url",
  description: `Returns a signed URL for uploading a function source code. For more information about the signed URL usage see: https://cloud.google.com/storage/docs/access-control/signed-urls. Once the function source code upload is complete, the used signed URL should be provided in CreateFunction or UpdateFunction request as a reference to the function source code. When uploading source code to the generated signed URL, please follow these restrictions: * Source file type should be a zip file. * No credentials should be attached - the signed URLs provide access to the target bucket using internal service identity; if credentials were attached, the identity from the credentials would be used, but that identity does not have permissions to upload files to the URL. When making a HTTP PUT request, specify this header: * 'content-type: application/zip' Do not specify this header: * 'Authorization: Bearer YOUR_TOKEN'`,
  category: "Functions",
  inputs: {
    default: {
      config: {
        parent: {
          name: "Parent",
          description:
            "Required. The project and location in which the Google Cloud Storage signed URL should be generated, specified in the format `projects/*/locations/*`.",
          type: {
            type: "string",
            description:
              "Required. The project and location in which the Google Cloud Storage signed URL should be generated, specified in the format `projects/*/locations/*`.",
          },
          required: true,
        },
        kmsKeyName: {
          name: "Kms Key Name",
          description:
            "Resource name of a KMS crypto key (managed by the user) used to encrypt/decrypt function source code objects in intermediate Cloud Storage buckets. When you generate an upload url and upload your source code, it gets copied to an intermediate Cloud Storage bucket. The source code is then copied to a versioned directory in the sources bucket in the consumer project during the function deployment.  It must match the pattern `projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}`.  The Google Cloud Functions service account (service-{project_number}@gcf-admin-robot.iam.gserviceaccount.com) must be granted the role 'Cloud KMS CryptoKey Encrypter/Decrypter (roles/cloudkms.cryptoKeyEncrypterDecrypter)' on the Key/KeyRing/Project/Organization (least access preferred).",
          type: {
            type: "string",
            description:
              "Resource name of a KMS crypto key (managed by the user) used to encrypt/decrypt function source code objects in intermediate Cloud Storage buckets. When you generate an upload url and upload your source code, it gets copied to an intermediate Cloud Storage bucket. The source code is then copied to a versioned directory in the sources bucket in the consumer project during the function deployment.  It must match the pattern `projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}`.  The Google Cloud Functions service account (service-{project_number}@gcf-admin-robot.iam.gserviceaccount.com) must be granted the role 'Cloud KMS CryptoKey Encrypter/Decrypter (roles/cloudkms.cryptoKeyEncrypterDecrypter)' on the Key/KeyRing/Project/Organization (least access preferred).",
          },
          required: false,
        },
        environment: {
          name: "Environment",
          description:
            "The function environment the generated upload url will be used for. The upload url for 2nd Gen functions can also be used for 1st gen functions, but not vice versa. If not specified, 2nd generation-style upload URLs are generated.",
          type: {
            type: "string",
            enum: ["ENVIRONMENT_UNSPECIFIED", "GEN_1", "GEN_2"],
            description: "The environment the function is hosted on.",
          },
          required: false,
        },
      },
      onEvent: async (input) => {
        const client = await getFunctionServiceClient(input.app.config);

        const request = convertKeys(input.event.inputConfig, inputMapping);

        const result = await new Promise<any>((resolve, reject) => {
          client.generateUploadUrl(request, (err: any, response: any) => {
            if (err)
              reject(
                new Error(
                  `gRPC error [${err.code}]: ${err.details || err.message}`,
                ),
              );
            else resolve(response);
          });
        });

        const output = convertKeys(result || {}, outputMapping);
        await events.emit(output);
      },
    },
  },
  outputs: {
    default: {
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          uploadUrl: {
            type: "string",
            description:
              "The generated Google Cloud Storage signed URL that should be used for a function source code upload. The uploaded file should be a zip archive which contains a function.",
          },
          storageSource: {
            type: "object",
            properties: {
              bucket: {
                type: "string",
                description:
                  "Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).",
              },
              object: {
                type: "string",
                description:
                  "Google Cloud Storage object containing the source.  This object must be a gzipped archive file (`.tar.gz`) containing source to build.",
              },
              generation: {
                type: "string",
                description: "64-bit integer as string",
              },
              sourceUploadUrl: {
                type: "string",
                description:
                  "When the specified storage bucket is a 1st gen function uploard url bucket, this field should be set as the generated upload url for 1st gen deployment.",
              },
            },
            description:
              "Location of the source in an archive file in Google Cloud Storage.",
            additionalProperties: true,
          },
        },
        description: "Response of `GenerateSourceUploadUrl` method.",
        additionalProperties: true,
      },
    },
  },
};

export default generateUploadUrl;
