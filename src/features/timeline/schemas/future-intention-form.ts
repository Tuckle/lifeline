import { z } from "zod";

export const futureIntentionFormSchema = z.object({
  title: z.string().trim().min(1, "Add a title for this intention.").max(180),
  targetDate: z.string().trim().optional(),
  targetLabel: z.string().trim().max(120).optional(),
});

export const futureIntentionUpdateSchema = futureIntentionFormSchema.extend({
  id: z.uuid(),
});

export type FutureIntentionFormValues = z.infer<typeof futureIntentionFormSchema>;
export type FutureIntentionUpdateValues = z.infer<typeof futureIntentionUpdateSchema>;

export function getFutureIntentionFormValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    targetDate: String(formData.get("targetDate") ?? ""),
    targetLabel: String(formData.get("targetLabel") ?? ""),
  };
}

export function getFutureDateLabel(values: FutureIntentionFormValues) {
  return values.targetLabel || values.targetDate || "Future timing open";
}
