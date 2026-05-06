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
  values: {
    title: "",
    targetDate: "",
    targetLabel: "",
    linkType: "none",
    linkedId: "",
  },
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

  const linkResult = await replaceFutureIntentionLink(data.id, parsed.data);

  if (!linkResult.ok) {
    return failedFutureIntentionState(values, linkResult.error.message);
  }

  revalidatePath("/timeline");
  revalidatePath("/reflect");
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
  revalidatePath("/reflect");
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

  const linkResult = await replaceFutureIntentionLink(values.id, values);

  if (!linkResult.ok) {
    return linkResult;
  }

  revalidatePath("/timeline");
  revalidatePath("/reflect");
  return { ok: true, data: { id: values.id } };
}

async function replaceFutureIntentionLink(
  futureIntentionId: string,
  values: Pick<FutureIntentionFormValues, "linkType" | "linkedId">,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("future_intention_links")
    .delete()
    .eq("future_intention_id", futureIntentionId);

  if (deleteError) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "The intention was saved, but its past link could not update yet.",
      },
    };
  }

  if (values.linkType === "none" || !values.linkedId) {
    return { ok: true, data: { id: futureIntentionId } };
  }

  const payload = {
    future_intention_id: futureIntentionId,
    review_session_id:
      values.linkType === "reflection" ? values.linkedId : null,
    reflection_pattern_id:
      values.linkType === "pattern" ? values.linkedId : null,
    timeline_event_id: values.linkType === "memory" ? values.linkedId : null,
  };

  const { error } = await supabase.from("future_intention_links").insert(payload);

  if (error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message: "This intention could not link to the past context yet.",
      },
    };
  }

  return { ok: true, data: { id: futureIntentionId } };
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
  message = "This intention could not be changed yet. Please try again.",
): FutureIntentionState {
  return {
    values,
    fieldErrors: {},
    result: {
      ok: false,
      error: {
        code: ErrorCodes.futureIntentionSaveFailed,
        message,
      },
    },
  };
}
