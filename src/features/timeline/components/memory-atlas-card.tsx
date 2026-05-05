import { Badge } from "@/components/ui/badge";
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
      </div>

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

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-md border border-memory/30 bg-memory/10 px-2.5 py-1 text-foreground">
          Importance: {event.importance}
        </span>
        <span className="rounded-md border border-timeline bg-background px-2.5 py-1 text-muted-foreground">
          Date type: {event.datePrecision}
        </span>
      </div>
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
