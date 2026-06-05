// app/api/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const guestSessionId = cookieStore.get("guestSessionId")?.value;
  
  return NextResponse.json({ sessionId: guestSessionId || null });
}