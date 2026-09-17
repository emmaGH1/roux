import { NextResponse } from "next/server";
import { createMeetup } from "@/lib/meetups";

export async function POST() {
  const meetup = createMeetup();
  return NextResponse.json({ code: meetup.code });
}
