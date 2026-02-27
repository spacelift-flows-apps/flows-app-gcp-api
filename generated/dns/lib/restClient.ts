import { GoogleAuth } from "google-auth-library";

interface DnsFetchOptions {
  config: Record<string, any>;
  method: string;
  pathTemplate: string;
  pathParams: Record<string, string>;
  queryParams?: Record<string, string>;
  body?: Record<string, any>;
}

async function getAccessToken(config: Record<string, any>): Promise<string> {
  if (config.accessToken) {
    return config.accessToken as string;
  }

  if (config.serviceAccountKey) {
    const auth = new GoogleAuth({
      credentials: JSON.parse(config.serviceAccountKey as string),
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token!;
  }

  throw new Error(
    "Either serviceAccountKey or accessToken must be provided in app configuration",
  );
}

export async function dnsFetch(options: DnsFetchOptions): Promise<any> {
  const { config, method, pathTemplate, pathParams, queryParams, body } =
    options;
  const accessToken = await getAccessToken(config);

  // Build URL by replacing path params in template
  let urlPath = pathTemplate;
  for (const [key, value] of Object.entries(pathParams)) {
    urlPath = urlPath.replace(`{${key}}`, encodeURIComponent(value));
    urlPath = urlPath.replace(`{+${key}}`, encodeURIComponent(value));
  }

  const url = new URL(`https://dns.googleapis.com/${urlPath}`);

  // Add query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body && Object.keys(body).length > 0) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), requestOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `GCP DNS API error: ${response.status} ${response.statusText}: ${errorBody}`,
    );
  }

  const text = await response.text();
  if (!text) return {};
  return JSON.parse(text);
}
