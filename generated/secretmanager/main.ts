import { defineApp } from "@slflows/sdk/v1";
import { blocks } from "./blocks/index.ts";

export const app = defineApp({
  name: "Secret Manager API",
  installationInstructions: `## Authentication Setup

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

This approach eliminates the need for long-lived credentials and provides better audit trails.`,
  config: {
    serviceAccountKey: {
      name: "Service Account Key",
      description: `**Long-lived credentials** (optional if using Access Token below)

Provide your GCP Service Account JSON key file contents.

**To create:**
1. Go to [GCP Console → IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Create or select a service account with appropriate permissions
3. Click **Keys** → **Add Key** → **Create New Key** → **JSON**
4. Download the JSON file and paste its entire contents here

**Not required** if you're using the **Access Token** field below.`,
      type: "string",
      required: false,
      sensitive: true,
    },
    accessToken: {
      name: "Access Token",
      description: `**Short-lived token** (optional if using Service Account Key above)

Provide a pre-generated GCP access token for keyless authentication.

**Recommended approach:** Use the **GCP Workload Identity Federation** app to generate short-lived tokens via OIDC. This is more secure than long-lived service account keys.

**Not required** if you're using the **Service Account Key** field above.`,
      type: "string",
      required: false,
      sensitive: true,
    },
  },
  blocks,
});
