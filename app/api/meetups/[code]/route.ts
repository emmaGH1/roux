import { NextResponse } from "next/server";
import { getMeetup } from "@/lib/meetups";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const meetup = await getMeetup(code);
  if (!meetup) {
    return NextResponse.json({ error: "Meetup not found" }, { status: 404 });
  }
  return NextResponse.json({ count: meetup.locations.length });
}
