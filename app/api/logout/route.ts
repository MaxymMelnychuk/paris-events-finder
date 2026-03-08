import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SESSION_COOKIE = "session";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return res;
}
