/** PayPal REST client — OAuth client-credentials with token cache.
 *  Only used when PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET are set. */

const BASE: Record<string, string> = {
  SANDBOX: "https://api-m.sandbox.paypal.com",
  PRODUCTION: "https://api-m.paypal.com",
};

interface TokenCache {
  token: string;
  expiresAt: number;
}

let cache: TokenCache | null = null;

export function sandboxConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

function baseUrl(): string {
  return BASE[process.env.PAYPAL_ENVIRONMENT ?? "SANDBOX"] ?? BASE.SANDBOX;
}

async function getToken(): Promise<string> {
  if (cache && Date.now() < cache.expiresAt - 30_000) return cache.token;
  const id = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal OAuth failed: HTTP ${res.status}`);
  const body = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: body.access_token, expiresAt: Date.now() + body.expires_in * 1000 };
  return cache.token;
}

/** Authenticated JSON request against the PayPal REST API. */
export async function paypalRequest<T>(
  method: "GET" | "POST",
  path: string,
  payload?: unknown
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
  });
  const text = await res.text();
  const json = (text ? JSON.parse(text) : {}) as T & { message?: string };
  if (!res.ok) {
    throw new Error(`PayPal ${method} ${path} → HTTP ${res.status}: ${json.message ?? text.slice(0, 200)}`);
  }
  return json;
}

export function clearTokenCache(): void {
  cache = null;
}
