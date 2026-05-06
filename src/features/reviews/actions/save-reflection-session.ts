"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  getReflectionSessionFormValues,
  reflectionSessionFormSchema,
  type ReflectionSessionFormValues,
} from "@/features/reviews/schemas/reflection-session-form";

type ReflectionSessionState = {
  result?: ActionResult<{ id: string; status: string }>;
  values: ReflectionSessionFormValues;
  fieldErrors: Partial<Record<keyof ReflectionSessionFormValues, string>>;
};

export async function saveReflectionSessionAction(
  _previousState: ReflectionSessionState,
  formData: FormData,
): Promise<ReflectionSessionState> {
  const values = getReflectionSessionFormValues(formData);
  const parsed = reflectionSessionFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      values,
      fieldErrors: {
        summaryText:
          parsed.error.issues.find((issue) => issue.path[0] === "summaryText")
            ?.message ?? parsed.error.issues[0]?.message,
      },
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: parsed.error.issues[0]?.message ?? "Check this reflection and try again.",
        },
      },
    };
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return failedState(values, {
      code: ErrorCodes.permissionDenied,
      message: "Sign in again before saving this reflection.",
    });
  }

  const payload = {
    user_id: userId,
    period_started_on: parsed.data.fromDate || null,
    period_ended_on: parsed.data.toDate || null,
    summary_text: parsed.data.summaryText,
    status: parsed.data.status,
  };

  const query = parsed.data.id
    ? supabase
        .from("review_sessions")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id,status")
        .single()
    : supabase
        .from("review_sessions")
        .insert(payload)
        .select("id,status")
        .single();

  const { data, error } = await query;

  if (error || !data) {
    return failedState(values, {
      code: ErrorCodes.reflectionSessionSaveFailed,
      message: "This reflection could not sync yet. Your text is still here so you can try again.",
    });
  }

  revalidatePath("/reflect");
  revalidatePath("/reflect/session");
  revalidatePath("/search");

  return {
    values: {
      ...parsed.data,
      id: data.id,
      status: data.status as ReflectionSessionFormValues["status"],
    },
    fieldErrors: {},
    result: { ok: true, data: { id: data.id, status: data.status } },
  };
}

function failedState(
  values: ReflectionSessionFormValues,
  error: { code: string; message: string },
): ReflectionSessionState {
  return {
    values,
    fieldErrors: {},
    result: {
      ok: false,
      error,
    },
  };
}
