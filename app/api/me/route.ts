import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types/auth";

export const runtime = "nodejs";

const SESSION_COOKIE = "session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const user = JSON.parse(session.value) as SessionUser;
    if (!user?.id || !user?.username || !user?.email) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
