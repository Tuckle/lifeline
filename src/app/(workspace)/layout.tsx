import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifeline workspace",
  description: "Private Lifeline workspace.",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
