/**
 * Ephemeral, code-keyed meetup store (build-revise ADR 0003).
 * In-memory map. Loses state on restart — fine for a demo.
 */

export type Meetup = {
  code: string;
  locations: Array<{ lat: number; lng: number }>;
  createdAt: number;
};

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/L/O/0/1

const globalForStore = globalThis as unknown as { __rouxMeetups?: Map<string, Meetup> };
const store: Map<string, Meetup> =
  globalForStore.__rouxMeetups ?? (globalForStore.__rouxMeetups = new Map());

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export function createMeetup(): Meetup {
  let code = generateCode();
  while (store.has(code)) {
    code = generateCode();
  }
  const meetup: Meetup = { code, locations: [], createdAt: Date.now() };
  store.set(code, meetup);
  return meetup;
}

export function getMeetup(code: string): Meetup | undefined {
  return store.get(code.toUpperCase());
}

export function addLocation(
  code: string,
  lat: number,
  lng: number
): { count: number } | null {
  const meetup = getMeetup(code);
  if (!meetup) return null;
  meetup.locations.push({ lat, lng });
  return { count: meetup.locations.length };
}

/** Seed a deterministic demo meetup for the video harness. */
export function ensureDemoMeetup(
  code: string,
  points: Array<{ lat: number; lng: number }>
): Meetup {
  let meetup = getMeetup(code);
  if (!meetup) {
    meetup = { code: code.toUpperCase(), locations: [], createdAt: Date.now() };
    store.set(meetup.code, meetup);
  }
  for (const p of points) {
    if (!meetup.locations.some((l) => l.lat === p.lat && l.lng === p.lng)) {
      meetup.locations.push(p);
    }
  }
  return meetup;
}
