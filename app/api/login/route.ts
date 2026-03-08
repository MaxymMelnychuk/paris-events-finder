import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/auth";
import type { SessionUser } from "@/types/auth";

export const runtime = "nodejs";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE: number = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    const user = await verifyUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const res = NextResponse.json(
      { message: "Login successful", user: sessionUser },
      { status: 200 },
    );
    res.cookies.set(SESSION_COOKIE, JSON.stringify(sessionUser), {
      httpOnly: true,
      path: "/",
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Unknown server error" },
      { status: 500 },
    );
  }
}
