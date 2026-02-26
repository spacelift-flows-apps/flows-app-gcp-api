import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index.ts";

export const app = defineApp({
  name: "Compute Engine - Load Balancing",
  installationInstructions: `## Authentication Setup

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
4. Pass the token to the **Access Token** field below`,
  config: {
    projectId: {
      name: "Project ID",
      description: `Your GCP project ID.

This is used for all Compute Engine API calls. You can find it in the
[GCP Console Dashboard](https://console.cloud.google.com/home/dashboard).`,
      type: "string",
      required: true,
    },
    serviceAccountKey: {
      name: "Service Account Key",
      description: `**Long-lived credentials** (optional if using Access Token below)

Provide your GCP Service Account JSON key file contents.

**Not required** if you're using the **Access Token** field below.`,
      type: "string",
      required: false,
      sensitive: true,
    },
    accessToken: {
      name: "Access Token",
      description: `**Short-lived token** (optional if using Service Account Key above)

Provide a pre-generated GCP access token for keyless authentication.

**Recommended approach:** Use the **GCP Workload Identity Federation** app to generate short-lived tokens via OIDC.

**Not required** if you're using the **Service Account Key** field above.`,
      type: "string",
      required: false,
      sensitive: true,
    },
  },
  blocks,
});
