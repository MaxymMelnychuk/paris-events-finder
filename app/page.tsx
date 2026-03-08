"use client";

import { useState, useEffect } from "react";
import { fetchEvents } from "@/lib/fetchEvents";
import { useRouter } from "next/navigation";
import type { Event } from "@/types/event";
import type { SessionUser } from "@/types/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user ?? null);
      })
      .finally(() => setUserLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.push("/auth/login");
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const events = await fetchEvents(query);
      setResults(events);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex gap-4 w-full mb-4 justify-between items-center">
        <div className="flex gap-2 w-full max-w-xl">
          <input
            type="text"
            value={query}
            placeholder="Search for an event"
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-neutral-800 bg-neutral-900 text-white p-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
          />
          <button
            type="submit"
            onClick={handleSearch}
            className="bg-black text-white cursor-pointer border border-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-900/50 transition-colors"
          >
            Search
          </button>
        </div>

        <div>
          {userLoading ? (
            <span className="text-neutral-500 text-sm">...</span>
          ) : user ? (
            <div className="flex gap-2 items-center">
              <span
                className="flex items-center gap-2 text-white text-sm border border-neutral-700 px-4 py-2"
                title={user.username}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="border border-red-950 px-4 py-2 text-sm hover:bg-red-900/75 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/auth/login")}
                className="border border-neutral-700  px-4 py-2 text-sm hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="border border-neutral-700   px-4 py-2 text-sm hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {results.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No events found.</p>
      ) : (
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[20rem] p-4 text-white">
          {results.map((event) => (
            <li
              key={event.id}
              className="bg-neutral-900 backdrop-blur-sm shadow-md rounded-sm p-6 my-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg border border-neutral-800 overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-2">
                {event.title || "Unknown title"}
              </h2>
              <p className="text-gray-300 mb-1">
                {event.address_name || "Unknown address"}
              </p>
              <p className="text-gray-400 text-sm">
                {event.date_start || "Unknown date"}
              </p>
              <p className="text-gray-400 text-sm">
                {event.category || "Unknown category"}
              </p>
              <p className="text-gray-400 text-sm">
                {"Price type : " + (event.price_type || "Unknown")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
