import "server-only";

const RESCUETIME_ANALYTIC_DATA_URL = "https://www.rescuetime.com/anapi/data";

export type RescueTimeActivityRecord = {
  sourceRecordId: string;
  occurredAt: string | null;
  periodStartedAt: string | null;
  periodEndedAt: string | null;
  contentSummary: string;
  sourceMetadata: Record<string, string | number | null>;
};

type RescueTimeApiResponse = {
  row_headers?: string[];
  rows?: unknown[][];
};

type FetchRescueTimeActivityInput = {
  apiKey: string;
  fromDate: string;
  toDate: string;
};

export async function fetchRescueTimeHourlyProductivity({
  apiKey,
  fromDate,
  toDate,
}: FetchRescueTimeActivityInput): Promise<RescueTimeActivityRecord[]> {
  const url = new URL(RESCUETIME_ANALYTIC_DATA_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("perspective", "interval");
  url.searchParams.set("restrict_kind", "productivity");
  url.searchParams.set("interval", "hour");
  url.searchParams.set("restrict_begin", fromDate);
  url.searchParams.set("restrict_end", toDate);

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`RescueTime responded with ${response.status}`);
  }

  const payload = (await response.json()) as RescueTimeApiResponse;
  return normalizeRescueTimeRows(payload);
}

function normalizeRescueTimeRows(
  payload: RescueTimeApiResponse,
): RescueTimeActivityRecord[] {
  const headers = payload.row_headers ?? [];
  const rows = payload.rows ?? [];
  const dateIndex = findHeaderIndex(headers, ["date"]);
  const secondsIndex = findHeaderIndex(headers, ["time spent", "seconds"]);
  const productivityIndex = findHeaderIndex(headers, ["productivity"]);

  return rows
    .map((row): RescueTimeActivityRecord | null => {
      const occurredAt = toIsoDateTime(row[dateIndex]);
      const seconds = toNumber(row[secondsIndex]);
      const productivity = toStringValue(row[productivityIndex]) ?? "productivity";

      if (!occurredAt || seconds <= 0) {
        return null;
      }

      const periodEndedAt = new Date(new Date(occurredAt).getTime() + 60 * 60 * 1000)
        .toISOString();
      const label = formatProductivity(productivity);

      return {
        sourceRecordId: `rescuetime:${occurredAt}:${productivity}`,
        occurredAt,
        periodStartedAt: occurredAt,
        periodEndedAt,
        contentSummary: `${formatSeconds(seconds)} tracked as ${label}`,
        sourceMetadata: {
          endpoint: "anapi/data",
          perspective: "interval",
          restrictKind: "productivity",
          interval: "hour",
          seconds,
          productivity,
        },
      };
    })
    .filter((record): record is RescueTimeActivityRecord => Boolean(record));
}

function findHeaderIndex(headers: string[], needles: string[]) {
  const index = headers.findIndex((header) => {
    const normalized = header.toLowerCase();
    return needles.every((needle) => normalized.includes(needle));
  });

  return index >= 0 ? index : 0;
}

function toIsoDateTime(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const text = String(value);
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00` : text;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toStringValue(value: unknown) {
  if (value === null || value === undefined) return null;
  return String(value);
}

function formatProductivity(value: string) {
  return value.replaceAll("_", " ").toLowerCase();
}

function formatSeconds(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}
