"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Role, useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import {
  User,
  Check,
  Edit,
  Gift,
  Percentage,
  Running,
  Shield,
  StatsUpSquare,
  Axes,
  EditPencil,
  CreativeCommons,
  Star,
} from "iconoir-react";
import DashboardSidebarItem from "./DashboardSidebarItem";
import { SidebarLink } from "@/features/(league)/leagues/components/LeagueSidebar";
import { cn } from "@/lib/utils";
import UserDropdown from "../user/components/userDropdown";

export default function DashboardSidebar() {
  const { user, userRoles } = useDashboardRoles();

  const sidebarSections = [
    users,
    ...(userRoles.includes("superadmin") ? [superadminGroup] : []),
    ...(userRoles.includes("admin") ? [adminGroup] : []),
    ...(userRoles.includes("content-creator") ? [creatorGroup] : []),
    ...(userRoles.includes("redaction") ? [redactionGroup] : []),
  ];

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title} className="p-3">
            <SidebarGroupLabel className={cn("font-heading text-lg mb-1")}>
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <DashboardSidebarItem key={item.href} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

type SidebarGroup = {
  title: string;
  role?: Role;
  items: SidebarLink[];
};

const users: SidebarGroup = {
  title: "Utente",
  items: [
    {
      name: "Profilo",
      href: "/dashboard/user/profile",
      icon: User,
    },
    {
      name: "Premium",
      href: "/dashboard/user/premium",
      icon: Star,
    },
  ],
};

const superadminGroup: SidebarGroup = {
  title: "Superadmin",
  role: "superadmin",
  items: [
    {
      name: "Admins",
      href: "/dashboard/admin/admins",
      icon: Shield,
    },
    {
      name: "Content creators",
      href: "/dashboard/admin/content-creators",
      icon: CreativeCommons,
    },
    {
      name: "Redazione",
      href: "/dashboard/admin/redactions",
      icon: EditPencil,
    },
    {
      name: "Premium",
      href: "/dashboard/admin/premium",
      icon: Star,
    },
  ],
};

const adminGroup: SidebarGroup = {
  title: "Admin",
  role: "admin",
  items: [
    {
      name: "Splits",
      href: "/dashboard/admin/splits",
      icon: Axes,
    },
    {
      name: "Squadre",
      href: "/dashboard/admin/teams",
      icon: Shield,
    },
    {
      name: "Giocatori",
      href: "/dashboard/admin/players",
      icon: Running,
    },
    {
      name: "Assegna bonus/malus",
      href: "/dashboard/admin/bonus",
      icon: Gift,
    },
  ],
};

const creatorGroup: SidebarGroup = {
  title: "Content creators",
  role: "content-creator",
  items: [
    {
      name: "Codice sconto",
      href: "/dashboard/creator/discount-code",
      icon: Percentage,
    },
    {
      name: "Statistiche varie",
      href: "/dashboard/creator/stats",
      icon: StatsUpSquare,
    },
  ],
};

const redactionGroup: SidebarGroup = {
  title: "Redazione",
  role: "redaction",
  items: [
    {
      name: "Assegna voti",
      href: "/dashboard/redaction/assign-votes",
      icon: Check,
    },
    {
      name: "Modifica voti",
      href: "/dashboard/redaction/edit-votes",
      icon: Edit,
    },
    {
      name: "Statistiche team",
      href: "/dashboard/redaction/team-stats",
      icon: StatsUpSquare,
    },
  ],
};
