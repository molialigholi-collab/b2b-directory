import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getEvents } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div>
      <PageIntro eyebrow="Events" title="Business events" description="Track upcoming company events from the Django events endpoint." />
      {events.length === 0 ? (
        <EmptyState title="No events yet" message="Add events in Django admin and they will show up here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="border border-line bg-white p-5 shadow-panel">
              <p className="text-xs font-semibold uppercase tracking-normal text-teal">
                {event.company_name || `Company #${event.company}`}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-ink">
                {event.slug ? (
                  <Link href={`/events/${event.slug}`} className="transition hover:text-teal">
                    {event.title}
                  </Link>
                ) : (
                  event.title
                )}
              </h2>
              <p className="mt-3 text-sm font-medium text-ink">{dateFormatter.format(new Date(event.event_date))}</p>
              <p className="mt-1 text-sm text-ink/65">{event.location}</p>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-ink/70">{event.description || "No description provided."}</p>
              {event.slug ? (
                <Link href={`/events/${event.slug}`} className="mt-5 inline-flex text-sm font-semibold text-teal transition hover:text-ink">
                  View event
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
