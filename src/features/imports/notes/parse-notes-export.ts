export type ParsedNoteImport = {
  sourceRecordId: string;
  title: string;
  body: string;
  occurredAt: string | null;
  suggestedDateLabel: string | null;
  contentSummary: string;
  needsDateReview: boolean;
  sourceMetadata: {
    importMethod: "paste_export";
    title: string;
    body: string;
    dateReview: "provided" | "needs_review";
  };
};

export type ParsedNotesExport = {
  failedCount: number;
  notes: ParsedNoteImport[];
};

export function parseNotesExport(input: string): ParsedNotesExport {
  const blocks = input
    .split(/\n-{3,}\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
  const notes: ParsedNoteImport[] = [];
  let failedCount = 0;

  for (const block of blocks) {
    const parsed = parseNoteBlock(block);

    if (parsed) {
      notes.push(parsed);
    } else {
      failedCount += 1;
    }
  }

  return { failedCount, notes };
}

function parseNoteBlock(block: string): ParsedNoteImport | null {
  const lines = block.split(/\r?\n/);
  const dateLineIndex = lines.findIndex((line) => /^date:\s*/i.test(line));
  const dateValue =
    dateLineIndex >= 0
      ? lines[dateLineIndex]?.replace(/^date:\s*/i, "").trim()
      : "";
  const occurredAt = getDateStart(dateValue);
  const bodyLines = dateLineIndex >= 0
    ? lines.filter((_, index) => index !== dateLineIndex)
    : lines;
  const title = (bodyLines[0] ?? "Imported note").trim() || "Imported note";
  const body = bodyLines.slice(1).join("\n").trim() || title;

  if (body.trim().length < 2) {
    return null;
  }

  const needsDateReview = !occurredAt;
  const contentSummary = getSummary(title, body, needsDateReview);

  return {
    sourceRecordId: `notes:${hashNoteBlock(block)}`,
    title,
    body,
    occurredAt,
    suggestedDateLabel: occurredAt
      ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
          new Date(occurredAt),
        )
      : "Needs date review",
    contentSummary,
    needsDateReview,
    sourceMetadata: {
      importMethod: "paste_export",
      title,
      body,
      dateReview: needsDateReview ? "needs_review" : "provided",
    },
  };
}

function getDateStart(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function getSummary(title: string, body: string, needsDateReview: boolean) {
  const normalized = `${title}: ${body}`.replace(/\s+/g, " ").trim();
  const summary =
    normalized.length > 180 ? `${normalized.slice(0, 177).trim()}...` : normalized;

  return needsDateReview ? `${summary} (date needs review)` : summary;
}

function hashNoteBlock(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }

  return Math.abs(hash).toString(36);
}
