export type TimelineEventSummary = {
  id: string;
  title: string;
  storyText: string | null;
  occurredOn: string | null;
  datePrecision: string;
  approximateDateLabel: string | null;
  importance: string;
  status: string;
  sourceLabel: string;
  createdAt: string;
};
