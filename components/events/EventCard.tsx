import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <li className="bg-neutral-900 backdrop-blur-sm shadow-md rounded-sm p-6 my-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg border border-neutral-800 overflow-y-auto">
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
  );
}

