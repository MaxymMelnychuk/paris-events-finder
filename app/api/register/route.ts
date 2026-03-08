import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { validatePassword } from "@/lib/passwordValidation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const userId = await createUser(username, email, password);

    return NextResponse.json(
      { message: "User created", userId },
      { status: 201 },
    );
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
