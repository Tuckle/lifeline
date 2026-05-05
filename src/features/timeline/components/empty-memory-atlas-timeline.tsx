import Link from "next/link";
import {
  CalendarPlus,
  Import,
  Milestone,
  Sparkles,
  Sunrise,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const firstActions = [
  {
    href: "/add",
    label: "Add memory",
    description: "Place one moment on the line.",
    icon: CalendarPlus,
  },
  {
    href: "/add?intent=future",
    label: "Add future intention",
    description: "Mark something you want to move toward.",
    icon: Sunrise,
  },
  {
    href: "/imports",
    label: "Import context",
    description: "Bring in outside context when it helps.",
    icon: Import,
  },
];

export function EmptyMemoryAtlasTimeline() {
  return (
    <section
      aria-labelledby="timeline-heading"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <div className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            Memory Atlas
          </p>
          <h1
            id="timeline-heading"
            className="text-page-title font-semibold text-foreground"
          >
            Your life-line is ready.
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Begin anywhere you remember. Exact dates can come later, and outside
            context stays separate until you choose what belongs here.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div
            aria-label="Empty life-line with past, present, and future"
            className="relative min-h-[32rem] overflow-hidden rounded-md border border-border bg-background/70 p-5 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute left-8 top-8 h-[calc(100%-4rem)] w-px bg-timeline sm:left-1/2"
            />

            <div className="relative flex min-h-[28rem] flex-col justify-between pl-10 sm:pl-0">
              <div className="sm:max-w-[45%]">
                <TimelineLabel
                  eyebrow="Past"
                  title="Memories can start rough."
                  description="A year, a season, or a remembered period is enough to begin."
                />
              </div>

              <div className="flex items-center gap-4 sm:justify-center">
                <div
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-soft"
                >
                  <Milestone className="size-5" />
                </div>
                <div className="rounded-md border border-primary/25 bg-card px-4 py-3 shadow-soft sm:absolute sm:left-[calc(50%+2rem)]">
                  <p className="text-sm font-semibold text-foreground">
                    Present
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The anchor between what happened and what comes next.
                  </p>
                </div>
              </div>

              <div className="sm:ml-auto sm:max-w-[45%]">
                <TimelineLabel
                  eyebrow="Future"
                  title="Intentions live below today."
                  description="You can add a direction without needing a full plan yet."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {firstActions.map((action) => {
              const Icon = action.icon;

              return (
                <Button
                  asChild
                  className="h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left"
                  key={action.href}
                  variant="outline"
                >
                  <Link href={action.href}>
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {action.label}
                      </span>
                      <span className="text-sm font-normal leading-5 text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="rounded-md border border-border bg-card p-5 text-card-foreground shadow-soft lg:min-h-[20rem]">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-reflection text-reflection-foreground"
          >
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-section-title font-semibold">
              Clarity can stay quiet at first.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Patterns will have more to work with once you add memories,
              intentions, or imported context. The line is useful even while it
              is sparse.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}

type TimelineLabelProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function TimelineLabel({ eyebrow, title, description }: TimelineLabelProps) {
  return (
    <div className="rounded-md border border-border bg-card/95 p-4 shadow-soft">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-section-title font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
