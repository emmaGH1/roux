/**
 * Shared Upstash Redis REST client (server-only).
 *
 * One place for the credential check so every consumer reports the same
 * honest state instead of each inventing its own.
 */

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Upstash configured? False in local dev without it — callers fall back. */
export const redisEnabled = Boolean(REST_URL && REST_TOKEN);

export async function redis<T>(command: (string | number)[]): Promise<T | null> {
  if (!redisEnabled) return null;
  const res = await fetch(REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const json = (await res.json()) as { result: T | null; error?: string };
  if (json.error) throw new Error(`upstash: ${json.error}`);
  return json.result;
}
