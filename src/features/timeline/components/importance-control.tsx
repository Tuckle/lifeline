import { cn } from "@/lib/utils";
import { importanceValues } from "@/features/timeline/schemas/timeline-event-form";

export const importanceDescriptions = {
  unset: "I am not sure yet",
  low: "Light context",
  medium: "Worth remembering",
  high: "Shaped a period",
  defining: "Changed the line",
} as const;

const importanceTone = {
  unset: "border-border bg-background/60",
  low: "border-timeline bg-background/70",
  medium: "border-memory/30 bg-memory/10",
  high: "border-reflection/35 bg-reflection/10",
  defining: "border-primary/45 bg-primary/10",
} as const;

type ImportanceControlProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ImportanceControl({ value, onChange }: ImportanceControlProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium text-foreground">
        Importance
      </legend>
      <p className="text-sm leading-6 text-muted-foreground">
        Choose how much space this memory should receive on the line. You can
        change it later.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {importanceValues.map((importance) => (
          <label
            className={cn(
              "flex min-h-14 cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-background",
              importanceTone[importance],
              value === importance && "ring-2 ring-focus ring-offset-2 ring-offset-background",
            )}
            key={importance}
          >
            <input
              aria-label={`Importance: ${importanceDescriptions[importance]}`}
              checked={value === importance}
              className="mt-1 size-4 accent-primary"
              name="importance"
              onChange={() => onChange(importance)}
              type="radio"
              value={importance}
            />
            <span className="grid gap-1">
              <span className="font-medium text-foreground">
                {formatImportanceLabel(importance)}
              </span>
              <span className="text-muted-foreground">
                {importanceDescriptions[importance]}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function formatImportanceLabel(importance: string) {
  return importance.charAt(0).toUpperCase() + importance.slice(1);
}

export function getImportanceProminence(importance: string) {
  if (importance === "defining") {
    return {
      card: "border-primary/45 shadow-panel",
      marker: "size-11 bg-primary text-primary-foreground",
      label: "Defining memory",
    };
  }

  if (importance === "high") {
    return {
      card: "border-reflection/35 shadow-soft",
      marker: "size-10 bg-reflection text-reflection-foreground",
      label: "High importance",
    };
  }

  if (importance === "medium") {
    return {
      card: "border-memory/30 shadow-soft",
      marker: "size-9 bg-memory text-memory-foreground",
      label: "Medium importance",
    };
  }

  return {
    card: "border-border shadow-soft",
    marker: "size-8 bg-memory text-memory-foreground",
    label: "Light importance",
  };
}
