"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getReflectionPatternFormValues,
  reflectionPatternFormSchema,
  type ReflectionPatternFormValues,
} from "@/features/reviews/schemas/reflection-pattern-form";

type ReflectionPatternState = {
  result?: ActionResult<{ id: string }>;
  values: ReflectionPatternFormValues;
  fieldErrors: Partial<Record<keyof ReflectionPatternFormValues, string>>;
};

export async function saveReflectionPatternAction(
  _previousState: ReflectionPatternState,
  formData: FormData,
): Promise<ReflectionPatternState> {
  const values = getReflectionPatternFormValues(formData);
  const parsed = reflectionPatternFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      values,
      fieldErrors: {
        title:
          parsed.error.issues.find((issue) => issue.path[0] === "title")
            ?.message ?? parsed.error.issues[0]?.message,
      },
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: parsed.error.issues[0]?.message ?? "Check this insight and try again.",
        },
      },
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return failedPatternState(values, {
      code: ErrorCodes.permissionDenied,
      message: "Sign in again before saving this pattern.",
    });
  }

  const payload = {
    user_id: userId,
    review_session_id: parsed.data.reviewSessionId || null,
    period_started_on: parsed.data.fromDate || null,
    period_ended_on: parsed.data.toDate || null,
    title: parsed.data.title,
    description: parsed.data.description,
    author_state: "user_authored",
    status: "active",
  };

  const query = parsed.data.id
    ? supabase
        .from("reflection_patterns")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id")
        .single()
    : supabase
        .from("reflection_patterns")
        .insert(payload)
        .select("id")
        .single();

  const { data, error } = await query;

  if (error || !data) {
    return failedPatternState(values, {
      code: ErrorCodes.reflectionPatternSaveFailed,
      message: "This pattern could not sync yet. Your wording is still here so you can try again.",
    });
  }

  const linkResult = await replacePatternLinks(
    data.id,
    parsed.data.linkedTimelineEventIds,
  );

  if (!linkResult.ok) {
    return failedPatternState(values, linkResult.error);
  }

  revalidatePatternPaths();

  return {
    values: {
      ...parsed.data,
      id: data.id,
    },
    fieldErrors: {},
    result: { ok: true, data: { id: data.id } },
  };
}

export async function dismissReflectionPatternAction(
  _previousState: ReflectionPatternState,
  formData: FormData,
): Promise<ReflectionPatternState> {
  const values = getReflectionPatternFormValues(formData);

  if (!values.id) {
    return failedPatternState(values, {
      code: ErrorCodes.validationFailed,
      message: "Choose a pattern before dismissing it.",
    });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reflection_patterns")
    .update({ status: "dismissed" })
    .eq("id", values.id);

  if (error) {
    return failedPatternState(values, {
      code: ErrorCodes.reflectionPatternSaveFailed,
      message: "This pattern could not be dismissed yet. Please try again.",
    });
  }

  revalidatePatternPaths();

  return {
    values,
    fieldErrors: {},
    result: { ok: true, data: { id: values.id } },
  };
}

async function replacePatternLinks(
  patternId: string,
  timelineEventIds: string[],
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("reflection_pattern_timeline_events")
    .delete()
    .eq("pattern_id", patternId);

  if (deleteError) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.reflectionPatternSaveFailed,
        message: "Pattern links could not be updated yet.",
      },
    };
  }

  if (timelineEventIds.length === 0) {
    return { ok: true, data: { id: patternId } };
  }

  const { error: insertError } = await supabase
    .from("reflection_pattern_timeline_events")
    .insert(
      timelineEventIds.map((timelineEventId) => ({
        pattern_id: patternId,
        timeline_event_id: timelineEventId,
      })),
    );

  if (insertError) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.reflectionPatternSaveFailed,
        message: "Pattern support links could not be saved yet.",
      },
    };
  }

  return { ok: true, data: { id: patternId } };
}

function failedPatternState(
  values: ReflectionPatternFormValues,
  error: { code: string; message: string },
): ReflectionPatternState {
  return {
    values,
    fieldErrors: {},
    result: {
      ok: false,
      error,
    },
  };
}

function revalidatePatternPaths() {
  revalidatePath("/reflect");
  revalidatePath("/reflect/session");
  revalidatePath("/search");
}
