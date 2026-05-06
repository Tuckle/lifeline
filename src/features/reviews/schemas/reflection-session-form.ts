import { z } from "zod";

export const reflectionSessionStatusValues = [
  "draft",
  "paused",
  "completed",
] as const;

export const reflectionSessionFormSchema = z
  .object({
    id: z.string().trim().optional(),
    fromDate: z.string().trim().optional(),
    toDate: z.string().trim().optional(),
    summaryText: z.string().trim().max(12000, "Keep this reflection under 12,000 characters for now."),
    status: z.enum(reflectionSessionStatusValues),
  })
  .superRefine((value, ctx) => {
    if (!getDateParam(value.fromDate ?? "") && !getDateParam(value.toDate ?? "")) {
      ctx.addIssue({
        code: "custom",
        path: ["fromDate"],
        message: "Choose a period before saving a reflection.",
      });
    }

    if (value.status === "completed" && value.summaryText.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["summaryText"],
        message: "Write a short summary before completing, or save this as a draft.",
      });
    }
  });

export type ReflectionSessionFormValues = z.infer<
  typeof reflectionSessionFormSchema
>;

export function getReflectionSessionFormValues(formData: FormData) {
  return {
    id: String(formData.get("id") ?? ""),
    fromDate: getDateParam(String(formData.get("fromDate") ?? "")),
    toDate: getDateParam(String(formData.get("toDate") ?? "")),
    summaryText: String(formData.get("summaryText") ?? ""),
    status: getStatus(String(formData.get("status") ?? "")),
  };
}

function getStatus(value: string) {
  return reflectionSessionStatusValues.includes(
    value as (typeof reflectionSessionStatusValues)[number],
  )
    ? (value as (typeof reflectionSessionStatusValues)[number])
    : "draft";
}

function getDateParam(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}
