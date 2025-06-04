"use client";

import { Home, Shield, Calendar, Medal1st } from "iconoir-react";
import NavLink from "@/components/NavLink";
import { cn, getItemHref } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LeagueNav({ leagueId }: { leagueId: string }) {
  const isMobile = useIsMobile(1024);

  return isMobile ? (
    <nav
      className={cn(
        "w-full fixed bottom-0 left-0 bg-background border-t border-border flex justify-around",
        "py-0.5 z-10"
      )}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          href={getItemHref(item.href, leagueId)}
          className="w-fit flex-col gap-1 xs:gap-0.5"
          exact
        >
          <item.icon className="size-5 xs:size-6" />
          <span className="text-xs xs:text-sm">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  ) : (
    <nav
      className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center
    gap-4 bg-sidebar w-fit z-10 rounded-bl-2xl rounded-br-2xl p-2"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          href={getItemHref(item.href, leagueId)}
          className="w-fit flex-col gap-1 xs:gap-0.5"
          exact
          render={({ isActive, href }) => (
            <Button
              variant="ghost"
              asChild
              className={cn(
                `flex items-center p-3 text-xs sm:text-sm font-medium whitespace-nowrap
                transition-colors w-fit`,
                isActive
                  ? `!bg-primary hover:bg-primary/90 text-primary-foreground
          font-semibold font-heading transition-colors hover:text-primary-foreground`
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={href}>
                <item.icon className="size-5" />
                {item.name}
              </Link>
            </Button>
          )}
        >
          <item.icon className="size-5 xs:size-6" />
          <span className="text-xs xs:text-sm">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

const navItems = [
  {
    name: "Overview",
    href: "/leagues/:leagueId",
    icon: Home,
  },
  {
    name: "Squadre",
    href: "/leagues/:leagueId/teams",
    icon: Shield,
  },
  {
    name: "Calendario",
    href: "/leagues/:leagueId/calendar",
    icon: Calendar,
  },
  {
    name: "Classifica",
    href: "/leagues/:leagueId/standings",
    icon: Medal1st,
  },
];
