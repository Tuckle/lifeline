import { Badge } from "@/components/ui/badge";
import { MemoryDetailPanel } from "@/features/timeline/components/memory-detail-panel";
import type { TimelineEventSummary } from "@/features/timeline/types";

type MemoryAtlasCardProps = {
  event: TimelineEventSummary;
};

export function MemoryAtlasCard({ event }: MemoryAtlasCardProps) {
  const dateLabel =
    event.approximateDateLabel ?? event.occurredOn ?? "Date unknown for now";
  const preview = event.storyText ? getStoryPreview(event.storyText) : null;

  return (
    <article
      className="rounded-md border border-border bg-card p-4 text-card-foreground shadow-soft"
      id={`memory-${event.id}`}
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Memory</Badge>
        <Badge variant="outline">{event.sourceLabel}</Badge>
        <Badge variant="outline">Status: {event.status}</Badge>
        {event.photoReferenceUrl ? (
          <Badge variant="outline">Photo reference</Badge>
        ) : null}
      </div>

      {event.photoReferenceUrl ? (
        <div className="mt-4 overflow-hidden rounded-md border border-border bg-background">
          {/* User-controlled external references are not app-owned optimized media. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={event.photoAltText || `Photo reference for ${event.title}`}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
            src={event.photoReferenceUrl}
          />
        </div>
      ) : null}

      <p className="mt-4 text-sm font-medium text-muted-foreground">
        {dateLabel}
      </p>
      <h2 className="mt-1 text-section-title font-semibold text-foreground">
        {event.title}
      </h2>

      {preview ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {preview}
        </p>
      ) : null}

      {event.photoReferenceUrl ? (
        <p className="mt-3 break-words text-sm text-muted-foreground">
          Photo reference:{" "}
          <a
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={event.photoReferenceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open reference
          </a>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-md border border-memory/30 bg-memory/10 px-2.5 py-1 text-foreground">
          Importance: {event.importance}
        </span>
        <span className="rounded-md border border-timeline bg-background px-2.5 py-1 text-muted-foreground">
          Date type: {event.datePrecision}
        </span>
      </div>

      <details className="group mt-4 rounded-md border border-border bg-background/70">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Open detail and actions
          <span className="text-muted-foreground group-open:hidden">+</span>
          <span className="hidden text-muted-foreground group-open:inline">
            -
          </span>
        </summary>
        <MemoryDetailPanel event={event} />
      </details>
    </article>
  );
}

function getStoryPreview(storyText: string) {
  const normalized = storyText.replace(/\s+/g, " ").trim();

  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 177)}...`;
}
