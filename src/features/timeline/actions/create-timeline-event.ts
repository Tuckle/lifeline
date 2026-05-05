"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getDateLabel,
  getOccurredOn,
  getTimelineEventFormValues,
  timelineEventFormSchema,
  type TimelineEventFormValues,
} from "@/features/timeline/schemas/timeline-event-form";

export type CreatedTimelineEvent = {
  id: string;
  title: string;
  dateLabel: string;
  importance: string;
  sourceLabel: string;
};

export type TimelineEventFormState = {
  result?: ActionResult<CreatedTimelineEvent>;
  values: ReturnType<typeof getTimelineEventFormValues>;
  fieldErrors: Partial<Record<keyof TimelineEventFormValues, string>>;
};

export const initialTimelineEventFormState: TimelineEventFormState = {
  values: {
    title: "",
    storyText: "",
    datePrecision: "unknown",
    exactDate: "",
    monthDate: "",
    yearDate: "",
    periodLabel: "",
    importance: "unset",
    photoReferenceUrl: "",
    photoAltText: "",
  },
  fieldErrors: {},
};

export async function createTimelineEventAction(
  _previousState: TimelineEventFormState,
  formData: FormData,
): Promise<TimelineEventFormState> {
  const values = getTimelineEventFormValues(formData);
  const parsed = timelineEventFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      values,
      fieldErrors: Object.fromEntries(
        parsed.error.issues.map((issue) => [
          issue.path[0] as keyof TimelineEventFormValues,
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

  const result = await createTimelineEvent(parsed.data);

  return {
    values: result.ok ? initialTimelineEventFormState.values : values,
    fieldErrors: {},
    result,
  };
}

export async function createTimelineEvent(
  values: TimelineEventFormValues,
): Promise<ActionResult<CreatedTimelineEvent>> {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before saving this memory.",
      },
    };
  }

  const dateLabel = getDateLabel(values);
  const { data, error } = await supabase
    .from("timeline_events")
    .insert({
      user_id: userId,
      title: values.title,
      story_text: values.storyText || null,
      occurred_on: getOccurredOn(values),
      date_precision: values.datePrecision,
      approximate_date_label: dateLabel,
      importance: values.importance,
      photo_reference_url: values.photoReferenceUrl || null,
      photo_alt_text: values.photoAltText || null,
      status: "active",
      source_type: "manual",
      source_label: "Manual",
    })
    .select("id,title,approximate_date_label,importance,source_label")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.timelineEventCreateFailed,
        message: "This memory could not be saved yet. Please try again.",
      },
    };
  }

  revalidatePath("/timeline");

  return {
    ok: true,
    data: {
      id: data.id,
      title: data.title,
      dateLabel: data.approximate_date_label ?? dateLabel,
      importance: data.importance,
      sourceLabel: data.source_label,
    },
  };
}
