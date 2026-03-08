import type { Event } from "@/types/event";

export async function fetchEvents(query: string): Promise<Event[]> {
  try {
    const res = await fetch(
      `https://opendata.paris.fr/api/v2/catalog/datasets/que-faire-a-paris-/records?search=${encodeURIComponent(query)}`,
    );
    if (!res.ok) throw new Error("Error network");

    const data = (await res.json()) as {
      records: {
        record: {
          id: string;
          fields: {
            title: string;
            address_name?: string;
            date_start?: string;
            category?: string;
            price_type?: string;
          };
        };
      }[];
    };
    console.log("data :", data.records[0]);

    const simplified: Event[] = data.records.map((r) => ({
      id: r.record.id,
      title: r.record.fields.title,
      address_name: r.record.fields.address_name,
      date_start: r.record.fields.date_start,
      category: r.record.fields.category,
      price_type: r.record.fields.price_type,
    }));

    return simplified;
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}
