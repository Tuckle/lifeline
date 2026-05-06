"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import {
  futureIntentionFormSchema,
  futureIntentionUpdateSchema,
  getFutureIntentionFormValues,
  type FutureIntentionFormValues,
  type FutureIntentionUpdateValues,
} from "@/features/timeline/schemas/future-intention-form";

type FutureIntentionState = {
  result?: ActionResult<{ id: string }>;
  values: ReturnType<typeof getFutureIntentionFormValues>;
  fieldErrors: Partial<Record<keyof FutureIntentionFormValues, string>>;
};

export const initialFutureIntentionState: FutureIntentionState = {
  values: { title: "", targetDate: "", targetLabel: "" },
  fieldErrors: {},
};

export async function createFutureIntentionAction(
  _previousState: FutureIntentionState,
  formData: FormData,
): Promise<FutureIntentionState> {
  const values = getFutureIntentionFormValues(formData);
  const parsed = futureIntentionFormSchema.safeParse(values);

  if (!parsed.success) {
    return invalidFutureIntentionState(values, parsed.error.issues[0]?.message);
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return permissionFutureIntentionState(values);
  }

  const { data, error } = await supabase
    .from("future_intentions")
    .insert({
      user_id: userId,
      title: parsed.data.title,
      target_on: parsed.data.targetDate || null,
      target_label: parsed.data.targetLabel || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return failedFutureIntentionState(values);
  }

  revalidatePath("/timeline");
  return {
    values: initialFutureIntentionState.values,
    fieldErrors: {},
    result: { ok: true, data: { id: data.id } },
  };
}

export async function updateFutureIntentionAction(
  _previousState: FutureIntentionState,
  formData: FormData,
): Promise<FutureIntentionState> {
  const values = {
    id: String(formData.get("id") ?? ""),
    ...getFutureIntentionFormValues(formData),
  };
  const parsed = futureIntentionUpdateSchema.safeParse(values);

  if (!parsed.success) {
    return invalidFutureIntentionState(values, parsed.error.issues[0]?.message);
  }

  const result = await updateFutureIntention(parsed.data);

  return {
    values,
    fieldErrors: {},
    result,
  };
}

export async function deleteFutureIntentionAction(
  _previousState: FutureIntentionState,
  formData: FormData,
): Promise<FutureIntentionState> {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.from("future_intentions").delete().eq("id", id);

  if (error) {
    return failedFutureIntentionState(initialFutureIntentionState.values);
  }

  revalidatePath("/timeline");
  return {
    values: initialFutureIntentionState.values,
    fieldErrors: {},
    result: { ok: true, data: { id } },
  };
}

async function updateFutureIntention(
  values: FutureIntentionUpdateValues,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("future_intentions")
    .update({
      title: values.title,
      target_on: values.targetDate || null,
      target_label: values.targetLabel || null,
    })
    .eq("id", values.id);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "This intention could not be saved yet. Please try again.",
      },
    };
  }

  revalidatePath("/timeline");
  return { ok: true, data: { id: values.id } };
}

function invalidFutureIntentionState(
  values: FutureIntentionState["values"],
  message = "Check the highlighted fields and try again.",
): FutureIntentionState {
  return {
    values,
    fieldErrors: { title: message },
    result: {
      ok: false,
      error: { code: ErrorCodes.validationFailed, message },
    },
  };
}

function permissionFutureIntentionState(
  values: FutureIntentionState["values"],
): FutureIntentionState {
  return {
    values,
    fieldErrors: {},
    result: {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before saving this intention.",
      },
    },
  };
}

function failedFutureIntentionState(
  values: FutureIntentionState["values"],
): FutureIntentionState {
  return {
    values,
    fieldErrors: {},
    result: {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "This intention could not be changed yet. Please try again.",
      },
    },
  };
}
