import { NextResponse } from "next/server";
import { addLocation } from "@/lib/meetups";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json().catch(() => null);
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat and lng required" }, { status: 400 });
  }

  const result = addLocation(code, lat, lng);
  if (!result) {
    return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
  }
  return NextResponse.json({ count: result.count });
}
