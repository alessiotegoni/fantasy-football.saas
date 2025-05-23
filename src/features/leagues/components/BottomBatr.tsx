import { Shield, Calendar, Home, Medal1st } from "iconoir-react";
import NavLink from "@/components/NavLink";
import { getItemHref } from "@/lib/utils";

export function Bottombar({ leagueId }: { leagueId: string }) {
  return (
    <nav
      className="w-full fixed bottom-0 left-0 bg-background border-t border-border flex justify-around
    py-0.5 z-10 lg:hidden"
    >
      {items.map((item) => (
        <NavLink
          key={item.name}
          href={getItemHref(item.href, leagueId)}
          className="w-fit flex-col gap-1 xs:gap-0.5"
        >
          <item.icon className="size-5 xs:size-6" />
          <span className="text-xs xs:text-sm">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export const items = [
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
