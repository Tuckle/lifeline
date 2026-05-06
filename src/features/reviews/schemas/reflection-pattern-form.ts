import { z } from "zod";

export const reflectionPatternFormSchema = z.object({
  id: z.string().trim().optional(),
  reviewSessionId: z.string().trim().optional(),
  fromDate: z.string().trim().optional(),
  toDate: z.string().trim().optional(),
  title: z.string().trim().min(1, "Name the insight in your own words.").max(180),
  description: z.string().trim().max(4000, "Keep this insight under 4,000 characters for now."),
  linkedTimelineEventIds: z.array(z.string().uuid()).max(20),
});

export type ReflectionPatternFormValues = z.infer<
  typeof reflectionPatternFormSchema
>;

export function getReflectionPatternFormValues(formData: FormData) {
  return {
    id: String(formData.get("id") ?? ""),
    reviewSessionId: String(formData.get("reviewSessionId") ?? ""),
    fromDate: getDateParam(String(formData.get("fromDate") ?? "")),
    toDate: getDateParam(String(formData.get("toDate") ?? "")),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    linkedTimelineEventIds: formData
      .getAll("linkedTimelineEventIds")
      .map((value) => String(value)),
  };
}

function getDateParam(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}
