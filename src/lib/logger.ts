type LogContext = Record<string, string | number | boolean | null | undefined>;

export function logError(code: string, context: LogContext = {}) {
  console.error("[lifeline]", code, context);
}
