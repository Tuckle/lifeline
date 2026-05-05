import { z } from "zod";

export const datePrecisionValues = [
  "exact",
  "month",
  "year",
  "period",
  "unknown",
] as const;

export const importanceValues = [
  "unset",
  "low",
  "medium",
  "high",
  "defining",
] as const;

export const timelineEventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Add a title for this memory.").max(180),
    storyText: z.string().trim().max(6000).optional(),
    datePrecision: z.enum(datePrecisionValues),
    exactDate: z.string().trim().optional(),
    monthDate: z.string().trim().optional(),
    yearDate: z.string().trim().optional(),
    periodLabel: z.string().trim().max(120).optional(),
    importance: z.enum(importanceValues),
  })
  .superRefine((value, ctx) => {
    if (value.datePrecision === "exact" && !value.exactDate) {
      ctx.addIssue({
        code: "custom",
        path: ["exactDate"],
        message: "Choose the date you want to place on the line.",
      });
    }

    if (value.datePrecision === "month" && !value.monthDate) {
      ctx.addIssue({
        code: "custom",
        path: ["monthDate"],
        message: "Choose the month and year you remember.",
      });
    }

    if (value.datePrecision === "year" && !value.yearDate) {
      ctx.addIssue({
        code: "custom",
        path: ["yearDate"],
        message: "Add the year you remember.",
      });
    }

    if (value.datePrecision === "period" && !value.periodLabel) {
      ctx.addIssue({
        code: "custom",
        path: ["periodLabel"],
        message: "Name the period in a way that feels useful to you.",
      });
    }
  });

export type TimelineEventFormValues = z.infer<typeof timelineEventFormSchema>;

export function getTimelineEventFormValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    storyText: String(formData.get("storyText") ?? ""),
    datePrecision: String(formData.get("datePrecision") ?? "unknown"),
    exactDate: String(formData.get("exactDate") ?? ""),
    monthDate: String(formData.get("monthDate") ?? ""),
    yearDate: String(formData.get("yearDate") ?? ""),
    periodLabel: String(formData.get("periodLabel") ?? ""),
    importance: String(formData.get("importance") ?? "unset"),
  };
}

export function getDateLabel(values: TimelineEventFormValues) {
  if (values.datePrecision === "exact" && values.exactDate) {
    return values.exactDate;
  }

  if (values.datePrecision === "month" && values.monthDate) {
    return values.monthDate;
  }

  if (values.datePrecision === "year" && values.yearDate) {
    return values.yearDate;
  }

  if (values.datePrecision === "period" && values.periodLabel) {
    return values.periodLabel;
  }

  return "Date unknown for now";
}

export function getOccurredOn(values: TimelineEventFormValues) {
  if (values.datePrecision === "exact") {
    return values.exactDate || null;
  }

  if (values.datePrecision === "month") {
    return values.monthDate ? `${values.monthDate}-01` : null;
  }

  if (values.datePrecision === "year") {
    return values.yearDate ? `${values.yearDate}-01-01` : null;
  }

  return null;
}
