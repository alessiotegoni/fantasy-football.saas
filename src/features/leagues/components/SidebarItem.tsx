"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import NavLink from "@/components/NavLink";
import { getItemHref } from "@/lib/utils";
import Link from "next/link";
import { publicSections } from "./Sidebar";

export default function SidebarItem({
  item,
  leagueId,
}: {
  item: (typeof publicSections)[number]["items"][number];
  leagueId: string;
}) {
  return (
    <SidebarMenuItem>
      <NavLink
        href={getItemHref(item.href, leagueId)}
        render={({ isActive, href }) => (
          <SidebarMenuButton variant="active" asChild isActive={isActive}>
            <Link href={href}>
              <item.icon className="!size-5" />
              {item.name}
            </Link>
          </SidebarMenuButton>
        )}
      />
    </SidebarMenuItem>
  );
}
