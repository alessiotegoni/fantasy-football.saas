"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
  const { user, userRoles } = useDashboardRoles();

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar>
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Utente</SidebarGroupLabel>
          {userGroup.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                isActive={isActive(item.href)}
              >
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarGroup>

        {userRoles.includes(adminGroup.role) && (
          <SidebarGroup>
            <SidebarGroupLabel>{adminGroup.label}</SidebarGroupLabel>
            {adminGroup.links.map((item) => {
              if (item.superAdminOnly && !isSuperAdmin) {
                return null;
              }
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    href={item.href}
                    isActive={isActive(item.href)}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarGroup>
        )}

        {userRoles.includes(creatorGroup.role) && (
          <SidebarGroup>
            <SidebarGroupLabel>{creatorGroup.label}</SidebarGroupLabel>
            {creatorGroup.links.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={isActive(item.href)}
                >
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        )}

        {userRoles.includes(redactionGroup.role) && (
          <SidebarGroup>
            <SidebarGroupLabel>{redactionGroup.label}</SidebarGroupLabel>
            {redactionGroup.links.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={isActive(item.href)}
                >
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        )}
      </SidebarMenu>
    </Sidebar>
  );
}

const userGroup = [
  {
    label: "Profilo",
    href: "/dashboard/user/profile",
  },
  {
    label: "Premium",
    href: "/dashboard/user/premium",
  },
];

const superadminGroup = {
  label: "Superadmin",
  role: "superadmin",
  links: [
    {
      label: "Admins",
      href: "/dashboard/admin/admins",
    },
    {
      label: "Content creators",
      href: "/dashboard/admin/content-creators",
    },
    {
      label: "Redazione",
      href: "/dashboard/admin/redactions",
    },
    {
      label: "Premium",
      href: "/dashboard/admin/premium",
    },
  ],
};

const adminGroup = {
  label: "Admin",
  role: "admin",
  links: [
    {
      label: "Splits",
      href: "/dashboard/admin/splits",
    },
    {
      label: "Squadre",
      href: "/dashboard/admin/teams",
    },
    {
      label: "Giocatori",
      href: "/dashboard/admin/players",
    },
    {
      label: "Assegna bonus/malus",
      href: "/dashboard/admin/bonus",
    },
  ],
};

const creatorGroup = {
  label: "Content creators",
  role: "content-creator",
  links: [
    {
      label: "Codice sconto",
      href: "/dashboard/creator/discount-code",
    },
    {
      label: "Statistiche varie",
      href: "/dashboard/creator/stats",
    },
  ],
};

const redactionGroup = {
  label: "Redazione",
  role: "redaction",
  links: [
    {
      label: "Assegna voti",
      href: "/dashboard/redaction/assign-votes",
    },
    {
      label: "Modifica voti",
      href: "/dashboard/redaction/edit-votes",
    },
    {
      label: "Statistiche team",
      href: "/dashboard/redaction/team-stats",
    },
  ],
};
