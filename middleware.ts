// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export default clerkMiddleware((auth, request: NextRequest) => {
  const response = NextResponse.next();

  const guestSessionId = request.cookies.get("guestSessionId")?.value;

  if (!guestSessionId) {
    const newSessionId = uuidv4();

    response.cookies.set("guestSessionId", newSessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // سنة
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
});

export const config = {
  matcher: [
    // نفس ديال clerk + حماية routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};