import { NextResponse } from "next/server";
import { getDatasetStatus } from "@/lib/discovery";

/**
 * GET /api/status — what data is this server actually serving?
 *
 * Exists because env-derived labels are a lie waiting to happen: `USE_FIXTURES=false`
 * with a rejected key silently falls back to fixtures, and statically prerendered
 * screens freeze their env-derived claim at build time. Client screens ask here
 * instead. No secrets, no counts that could embarrass anyone.
 */
export const dynamic = "force-dynamic";

/** Cold-start dataset loads (or a Redis miss → full Flynet crawl) need real time. */
export const maxDuration = 60;

export async function GET() {
  const { source, reason } = await getDatasetStatus();
  return NextResponse.json(
    { source, reason },
    { headers: { "cache-control": "no-store" } }
  );
}
