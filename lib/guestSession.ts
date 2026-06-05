// lib/session.ts
import { cookies } from "next/headers";

// دالة للحصول على guestSessionId في Server Components
export async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("guestSessionId")?.value;
  
  if (!sessionId) {
    // إذا لم يوجد، قم بإنشاء واحد جديد
    const { v4: uuidv4 } = await import('uuid');
    sessionId = uuidv4();
  }
  
  return sessionId;
}

// دالة لتعيين guestSessionId في Server Component (للـ middleware)
export function setGuestSessionIdCookie(sessionId: string) {
  // هذه الدالة تستخدم في middleware أو API routes
  return {
    name: 'guestSessionId',
    value: sessionId,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // سنة
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  };
}