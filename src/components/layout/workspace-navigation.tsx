"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus,
  Compass,
  Import,
  Search,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type WorkspaceNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const workspaceNavItems: WorkspaceNavItem[] = [
  {
    href: "/timeline",
    label: "Timeline",
    description: "Memory Atlas home",
    icon: Compass,
  },
  {
    href: "/add",
    label: "Add",
    description: "Capture a memory",
    icon: CalendarPlus,
  },
  {
    href: "/imports",
    label: "Imports",
    description: "Review context",
    icon: Import,
  },
  {
    href: "/reflect",
    label: "Reflect",
    description: "Clarity sessions",
    icon: Sparkles,
  },
  {
    href: "/search",
    label: "Search",
    description: "Find moments",
    icon: Search,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Privacy and data",
    icon: Settings,
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopWorkspaceNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Workspace" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {workspaceNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  active &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
                href={item.href}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function MobileWorkspaceNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Workspace"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(31,37,34,0.08)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6 gap-1">
        {workspaceNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={`${item.label}: ${item.description}`}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-1 text-xs font-medium leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  active &&
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                )}
                href={item.href}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { workspaceNavItems };
