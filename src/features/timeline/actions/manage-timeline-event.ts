"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getDateLabel,
  getOccurredOn,
  getTimelineEventFormValues,
  timelineEventUpdateSchema,
  type TimelineEventUpdateValues,
} from "@/features/timeline/schemas/timeline-event-form";

type ManageMemoryState = {
  result?: ActionResult<{ id: string }>;
  fieldErrors: Partial<Record<keyof TimelineEventUpdateValues, string>>;
  values?: ReturnType<typeof getTimelineEventFormValues> & { id: string };
};

export const initialManageMemoryState: ManageMemoryState = {
  fieldErrors: {},
};

export async function updateTimelineEventAction(
  _previousState: ManageMemoryState,
  formData: FormData,
): Promise<ManageMemoryState> {
  const values = {
    id: String(formData.get("id") ?? ""),
    ...getTimelineEventFormValues(formData),
  };
  const parsed = timelineEventUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      values,
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((issue) => [
          issue.path[0] as keyof TimelineEventUpdateValues,
          issue.message,
        ]),
      ),
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Check the highlighted fields and try again.",
        },
      },
    };
  }

  const result = await updateTimelineEvent(parsed.data);

  return {
    values,
    fieldErrors: {},
    result,
  };
}

export async function hideTimelineEventAction(
  _previousState: ManageMemoryState,
  formData: FormData,
): Promise<ManageMemoryState> {
  const id = String(formData.get("id") ?? "");
  const result = await setTimelineEventStatus(id, "hidden");
  return { fieldErrors: {}, result };
}

export async function deleteTimelineEventAction(
  _previousState: ManageMemoryState,
  formData: FormData,
): Promise<ManageMemoryState> {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.from("timeline_events").delete().eq("id", id);

  if (error) {
    return {
      fieldErrors: {},
      result: {
        ok: false,
        error: {
          code: ErrorCodes.timelineEventDeleteFailed,
          message: "This memory could not be deleted yet. Please try again.",
        },
      },
    };
  }

  revalidatePath("/timeline");
  return { fieldErrors: {}, result: { ok: true, data: { id } } };
}

async function updateTimelineEvent(
  values: TimelineEventUpdateValues,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("timeline_events")
    .update({
      title: values.title,
      story_text: values.storyText || null,
      occurred_on: getOccurredOn(values),
      date_precision: values.datePrecision,
      approximate_date_label: getDateLabel(values),
      importance: values.importance,
    })
    .eq("id", values.id);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.timelineEventUpdateFailed,
        message: "This memory could not be updated yet. Please try again.",
      },
    };
  }

  revalidatePath("/timeline");
  return { ok: true, data: { id: values.id } };
}

async function setTimelineEventStatus(
  id: string,
  status: "hidden",
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("timeline_events")
    .update({ status })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.timelineEventHideFailed,
        message: "This memory could not be hidden yet. Please try again.",
      },
    };
  }

  revalidatePath("/timeline");
  return { ok: true, data: { id } };
}
