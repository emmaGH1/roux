/**
 * Ephemeral, code-keyed meetup store (build-revise ADR 0003).
 *
 * Backed by Upstash Redis over REST when UPSTASH_* env vars are set — the
 * store must survive across serverless instances and restarts for codes to
 * mean anything once deployed. Falls back to the in-memory Map when the vars
 * are absent, so local dev with zero setup still works.
 *
 * Writes are serialized per store (a simple mutex chain) because REST calls
 * are async and two friends tapping at once must both land.
 */

export type Meetup = {
  code: string;
  locations: Array<{ lat: number; lng: number }>;
  createdAt: number;
};

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1
/** Meetups are one evening; auto-expire after a day. */
const TTL_SECONDS = 24 * 60 * 60;

const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const redisEnabled = Boolean(REST_URL && REST_TOKEN);
const keyOf = (code: string) => `roux:meetup:${code}`;

/* ── In-memory fallback (dev only) ── */

const globalForStore = globalThis as unknown as { __rouxMeetups?: Map<string, Meetup> };
const store: Map<string, Meetup> =
  globalForStore.__rouxMeetups ?? (globalForStore.__rouxMeetups = new Map());

/* ── Redis plumbing ── */

let chain: Promise<unknown> = Promise.resolve();
/** Serialize async writes so concurrent taps can't read-modify-write over each other. */
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.catch(() => {});
  return next;
}

async function redis<T>(command: (string | number)[]): Promise<T | null> {
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

/* ── Store API (same shape the routes already consume) ── */

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export async function createMeetup(): Promise<Meetup> {
  const meetup: Meetup = { code: generateCode(), locations: [], createdAt: Date.now() };

  if (!redisEnabled) {
    while (store.has(meetup.code)) meetup.code = generateCode();
    store.set(meetup.code, meetup);
    return meetup;
  }

  /* Retry on the astronomically unlikely code collision. */
  for (let attempt = 0; attempt < 5; attempt++) {
    const set = await redis<number>(["SET", keyOf(meetup.code), JSON.stringify(meetup), "EX", TTL_SECONDS, "NX"]);
    if (set === 1) return meetup;
    meetup.code = generateCode();
  }
  throw new Error("could not allocate a meetup code");
}

export async function getMeetup(code: string): Promise<Meetup | undefined> {
  const key = code.toUpperCase();

  if (!redisEnabled) return store.get(key);

  const raw = await redis<string>(["GET", keyOf(key)]);
  return raw ? (JSON.parse(raw) as Meetup) : undefined;
}

export async function addLocation(
  code: string,
  lat: number,
  lng: number
): Promise<{ count: number } | null> {
  if (!redisEnabled) {
    const meetup = store.get(code.toUpperCase());
    if (!meetup) return null;
    meetup.locations.push({ lat, lng });
    return { count: meetup.locations.length };
  }

  return serialized(async () => {
    const meetup = await getMeetup(code);
    if (!meetup) return null;
    meetup.locations.push({ lat, lng });
    await redis(["SET", keyOf(meetup.code), JSON.stringify(meetup), "EX", TTL_SECONDS]);
    return { count: meetup.locations.length };
  });
}

/** Seed a deterministic demo meetup for the video harness. */
export async function ensureDemoMeetup(
  code: string,
  points: Array<{ lat: number; lng: number }>
): Promise<Meetup> {
  const normalized = code.toUpperCase();

  if (!redisEnabled) {
    let meetup = store.get(normalized);
    if (!meetup) {
      meetup = { code: normalized, locations: [], createdAt: Date.now() };
      store.set(normalized, meetup);
    }
    for (const p of points) {
      if (!meetup.locations.some((l) => l.lat === p.lat && l.lng === p.lng)) {
        meetup.locations.push(p);
      }
    }
    return meetup;
  }

  return serialized(async () => {
    let meetup = await getMeetup(normalized);
    if (!meetup) {
      meetup = { code: normalized, locations: [], createdAt: Date.now() };
    }
    for (const p of points) {
      if (!meetup.locations.some((l) => l.lat === p.lat && l.lng === p.lng)) {
        meetup.locations.push(p);
      }
    }
    await redis(["SET", keyOf(normalized), JSON.stringify(meetup), "EX", TTL_SECONDS]);
    return meetup;
  });
}
