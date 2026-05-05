import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import {
  DesktopWorkspaceNavigation,
  MobileWorkspaceNavigation,
} from "@/components/layout/workspace-navigation";
import { hasEnvVars } from "@/lib/utils";

type WorkspaceShellProps = {
  children: ReactNode;
};

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            href="/timeline"
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground"
            >
              L
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Lifeline</span>
              <span className="text-xs text-muted-foreground">
                Private workspace
              </span>
            </span>
          </Link>

          <DesktopWorkspaceNavigation />

          <div className="flex min-h-11 items-center justify-end text-sm">
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense fallback={null}>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8 lg:pb-10">
        <main className="min-w-0">{children}</main>
        <aside
          aria-label="Workspace context"
          className="hidden border-l border-border pl-6 lg:block"
        >
          <div className="sticky top-24 space-y-4">
            <div className="rounded-md border border-border bg-card p-4 text-card-foreground">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Clarity
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Patterns and related moments will appear here as your timeline
                grows.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <MobileWorkspaceNavigation />
    </div>
  );
}
