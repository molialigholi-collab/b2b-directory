import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent, getEvents } from "@/lib/api";
import { absoluteUrl, pageDescription } from "@/lib/seo";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});

export async function generateStaticParams() {
  const events = await getEvents();
  return events.filter((event) => event.slug).map((event) => ({ slug: event.slug as string }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const description = pageDescription(event.description || `${event.title} in ${event.location}`);

  return {
    title: event.title,
    description,
    alternates: {
      canonical: absoluteUrl(`/events/${slug}`),
    },
    openGraph: {
      title: event.title,
      description,
      url: absoluteUrl(`/events/${slug}`),
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEvent(slug).catch(() => null);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link href="/events" className="inline-flex text-sm font-semibold text-teal transition hover:text-ink">
        Back to events
      </Link>

      <section className="border-b border-line pb-8">
        <p className="text-sm font-semibold uppercase tracking-normal text-teal">Event</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-normal text-ink sm:text-4xl">{event.title}</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="border border-line bg-white p-5 shadow-panel">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Date</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-ink">{dateFormatter.format(new Date(event.event_date))}</p>
          </div>
          <div className="border border-line bg-white p-5 shadow-panel">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Location</h2>
            <p className="mt-3 text-sm font-medium leading-6 text-ink">{event.location}</p>
          </div>
          <div className="border border-line bg-white p-5 shadow-panel">
            <h2 className="text-sm font-semibold uppercase tracking-normal text-ink/60">Company</h2>
            {event.company_name ? (
              event.company_slug ? (
                <Link href={`/companies/${event.company_slug}`} className="mt-3 inline-flex text-sm font-semibold text-teal transition hover:text-ink">
                  {event.company_name}
                </Link>
              ) : (
                <p className="mt-3 text-sm font-medium leading-6 text-ink">{event.company_name}</p>
              )
            ) : (
              <p className="mt-3 text-sm text-ink/65">Not listed</p>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-4xl whitespace-pre-wrap text-base leading-8 text-ink/75">
        {event.description || "No description provided."}
      </section>
    </div>
  );
}
