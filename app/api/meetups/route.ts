import { NextResponse } from "next/server";
import { createMeetup } from "@/lib/meetups";

/** Creating the first meetup on a cold instance may trigger a dataset load. */
export const maxDuration = 60;

export async function POST() {
  const meetup = await createMeetup();
  return NextResponse.json({ code: meetup.code });
}
