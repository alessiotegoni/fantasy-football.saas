"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import NavLink from "@/components/NavLink";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarSection } from "./Sidebar";
import { getItemHref } from "@/utils/helpers";

type Props = {
  item: SidebarSection["items"][number];
  leagueId: string;
  showLink?: boolean;
};

export default function SidebarItem({
  item,
  leagueId,
  showLink = true,
}: Props) {
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
        exact={item.exact}
      />
    </SidebarMenuItem>
  );
}
