"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import NavLink from "@/components/NavLink";
import Link from "next/link";
import { SidebarLink } from "@/features/league/leagues/components/LeagueSidebar";

type Props = {
  item: SidebarLink;
};

export default function DashboardSidebarItem({ item }: Props) {
  const content = (
    <>
      <item.icon className="!size-5" />
      {item.name}
    </>
  );

  return (
    <SidebarMenuItem>
      <NavLink
        href={item.href}
        activeBasePath={item.basePath}
        render={({ isActive, href }) => (
          <SidebarMenuButton variant="active" asChild isActive={isActive}>
            <Link href={href}>{content}</Link>
          </SidebarMenuButton>
        )}
        exact={item.exact}
      />
    </SidebarMenuItem>
  );
}
