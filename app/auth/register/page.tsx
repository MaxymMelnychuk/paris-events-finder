"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RegisterResponse } from "@/types/auth";
import { validatePassword } from "@/lib/passwordValidation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 4) {
      setError("Username must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to register");

      router.push("/auth/login");
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
          Register
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-neutral-800 bg-neutral-900 text-white p-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
        />

        <button
          type="submit"
          className="w-full bg-black border cursor-pointer border-neutral-800 text-white py-3 rounded-sm hover:bg-neutral-800/50 transition-colors font-medium"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-neutral-400 mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-white hover:underline cursor-pointer hover:text-gray-200 transition-colors"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
