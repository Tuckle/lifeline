export type TimelineEventSummary = {
  id: string;
  title: string;
  storyText: string | null;
  occurredOn: string | null;
  datePrecision: string;
  exactDate: string;
  monthDate: string;
  yearDate: string;
  periodLabel: string;
  approximateDateLabel: string | null;
  importance: string;
  status: string;
  sourceLabel: string;
  photoReferenceUrl: string | null;
  photoAltText: string | null;
  createdAt: string;
};

export type FutureIntentionSummary = {
  id: string;
  title: string;
  targetOn: string | null;
  targetLabel: string | null;
  status: string;
  createdAt: string;
  linkedContext: FutureIntentionLinkedContext | null;
};

export type FutureIntentionLinkType =
  | "none"
  | "reflection"
  | "pattern"
  | "memory";

export type FutureIntentionLinkedContext = {
  type: Exclude<FutureIntentionLinkType, "none">;
  id: string;
  title: string;
  href: string;
};

export type FutureIntentionLinkOption = FutureIntentionLinkedContext;
