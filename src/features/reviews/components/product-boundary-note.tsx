import { ShieldCheck } from "lucide-react";

export function ProductBoundaryNote() {
  return (
    <aside className="rounded-md border border-reflection/30 bg-reflection/10 p-4 text-sm leading-6 text-muted-foreground">
      <div className="flex items-start gap-3">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-reflection"
        />
        <div>
          <p className="font-medium text-foreground">
            Private reflection, user-owned meaning.
          </p>
          <p className="mt-1">
            Lifeline helps you organize memories, reflections, patterns, and
            intentions. You choose what they mean, and you can pause, edit,
            hide, delete, save a draft, or leave when you need to.
          </p>
        </div>
      </div>
    </aside>
  );
}
