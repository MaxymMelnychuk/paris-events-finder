"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Username or password not valid");

      console.log("Logged in user:", data.user);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <Link
        href="/"
        className="absolute top-4 left-4 text-white  px-4 py-2  hover:bg-neutral-800/50 transition-colors"
      >
        &lt;-- Return
      </Link>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md border border-neutral-800 p-8"
      >
        <h1 className="text-3xl font-semibold mb-6 text-white text-center">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
        />

        <button
          type="submit"
          className="w-full bg-black border cursor-pointer border-neutral-800 text-white py-3 rounded-sm hover:bg-neutral-800/50 transition-colors font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-neutral-400 mt-4 text-sm text-center">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-white hover:underline cursor-pointer hover:text-gray-200 transition-colors"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
