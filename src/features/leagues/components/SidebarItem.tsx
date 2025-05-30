"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import NavLink from "@/components/NavLink";
import { getItemHref } from "@/lib/utils";
import Link from "next/link";
import { publicSections } from "./Sidebar";
import { Button } from "@/components/ui/button";

export default function SidebarItem({
  item,
  leagueId,
  showLink = true,
}: {
  item: (typeof publicSections)[number]["items"][number];
  leagueId: string;
  showLink?: boolean;
}) {
  const content = (
    <>
      <item.icon className="!size-5" />
      {item.name}
    </>
  );

  return (
    <SidebarMenuItem>
      <NavLink
        href={getItemHref(item.href, leagueId)}
        activeBasePath={
          item.basePath ? getItemHref(item.basePath, leagueId) : undefined
        }
        render={({ isActive, href }) => (
          <SidebarMenuButton variant="active" asChild isActive={isActive}>
            {showLink ? (
              <Link href={href}>{content}</Link>
            ) : (
              <Button variant="ghost" className="justify-start font-normal">
                {content}
              </Button>
            )}
          </SidebarMenuButton>
        )}
      />
    </SidebarMenuItem>
  );
}
