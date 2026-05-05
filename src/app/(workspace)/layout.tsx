import type { Metadata } from "next";

import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const metadata: Metadata = {
  title: "Lifeline workspace",
  description: "Private Lifeline workspace.",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
