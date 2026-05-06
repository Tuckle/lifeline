"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { ErrorCodes } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { logImportError } from "@/features/imports/logger";
import { parseNotesExport } from "@/features/imports/notes/parse-notes-export";

type NotesImportState = {
  result?: ActionResult<{
    sourceId: string;
    importedCount: number;
    failedCount: number;
  }>;
  values: {
    sourceName: string;
    notesText: string;
  };
};

export const initialNotesImportState: NotesImportState = {
  values: {
    sourceName: "Notes export",
    notesText: "",
  },
};

export async function importNotesAction(
  _previousState: NotesImportState,
  formData: FormData,
): Promise<NotesImportState> {
  const values = {
    sourceName: String(formData.get("sourceName") ?? "Notes export").trim(),
    notesText: String(formData.get("notesText") ?? ""),
  };

  if (values.notesText.trim().length < 2) {
    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message: "Paste at least one note before importing.",
        },
      },
    };
  }

  const parsed = parseNotesExport(values.notesText);

  if (parsed.notes.length === 0) {
    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.validationFailed,
          message:
            "No supported note blocks were found. Keep a title on the first line and separate notes with ---.",
        },
      },
    };
  }

  const user = await getImportUser();
  if (!user.ok) return { values, result: user };

  const supabase = await createClient();
  const source = await upsertNotesSource({
    displayName: values.sourceName || "Notes export",
    userId: user.data.userId,
  });

  if (!source.ok) {
    return { values, result: source };
  }

  const rows = parsed.notes.map((note) => ({
    user_id: user.data.userId,
    source_id: source.data.sourceId,
    source_type: "notes",
    source_record_id: note.sourceRecordId,
    source_label: values.sourceName || "Notes export",
    content_summary: note.contentSummary,
    source_metadata: note.sourceMetadata,
    occurred_at: note.occurredAt,
    period_started_at: note.occurredAt,
    period_ended_at: note.occurredAt,
    lifecycle_state: "staged",
    sync_status: parsed.failedCount > 0 ? "partial" : "succeeded",
    suggested_date_label: note.suggestedDateLabel,
  }));

  const { error } = await supabase
    .from("import_records")
    .upsert(rows, { onConflict: "user_id,source_type,source_record_id" });

  if (error) {
    logImportError("importAuthFailed", {
      sourceType: "notes",
      sourceId: source.data.sourceId,
      syncStatus: "failed",
      technicalContext: { failedRows: rows.length },
    });

    return {
      values,
      result: {
        ok: false,
        error: {
          code: ErrorCodes.importAuthFailed,
          message:
            "Notes could not import yet. Existing staged records are still available, and you can retry this export.",
        },
      },
    };
  }

  await supabase
    .from("import_sources")
    .update({
      connection_status: parsed.failedCount > 0 ? "failed" : "connected",
      last_synced_at: new Date().toISOString(),
      source_metadata: {
        importMethod: "paste_export",
        copiedIntoLifeline: true,
        failedCount: parsed.failedCount,
      },
    })
    .eq("id", source.data.sourceId);

  revalidatePath("/imports");

  return {
    values: { ...values, notesText: "" },
    result: {
      ok: true,
      data: {
        sourceId: source.data.sourceId,
        importedCount: rows.length,
        failedCount: parsed.failedCount,
      },
    },
  };
}

async function upsertNotesSource({
  displayName,
  userId,
}: {
  displayName: string;
  userId: string;
}): Promise<ActionResult<{ sourceId: string }>> {
  const supabase = await createClient();
  const existing = await supabase
    .from("import_sources")
    .select("id")
    .eq("source_type", "notes")
    .eq("display_name", displayName)
    .maybeSingle();

  if (existing.error) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "Notes source could not load yet. Try again in a moment.",
      },
    };
  }

  if (existing.data?.id) {
    return { ok: true, data: { sourceId: existing.data.id } };
  }

  const { data, error } = await supabase
    .from("import_sources")
    .insert({
      user_id: userId,
      source_type: "notes",
      display_name: displayName,
      connection_status: "connected",
      source_metadata: {
        importMethod: "paste_export",
        copiedIntoLifeline: true,
      },
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.importAuthFailed,
        message: "Notes source could not be created yet. Try again in a moment.",
      },
    };
  }

  return { ok: true, data: { sourceId: data.id } };
}

async function getImportUser(): Promise<ActionResult<{ userId: string }>> {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims?.sub) {
    return {
      ok: false,
      error: {
        code: ErrorCodes.permissionDenied,
        message: "Sign in again before changing imports.",
      },
    };
  }

  return { ok: true, data: { userId: claimsData.claims.sub } };
}
