"use client";

import { useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import { Shield, Palette, PenSquare } from "lucide-react";
import { getMetadataFromUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import { RoleCard, RoleInfo } from "@/features/dashboard/components/RoleCard";

export default function DashboardPage() {
  const { user, userRoles } = useDashboardRoles();

  if (userRoles.length === 1) redirect(`/dashboard/${userRoles[0]}`);

  const { name } = getMetadataFromUser(user);

  const availableRoles = ROLES_INFO.filter((info) => userRoles.includes(info.role));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {name} Benvenuto nella tua area privata 👋
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableRoles.map((roleInfo) => (
          <RoleCard key={roleInfo.href} {...roleInfo} />
        ))}
      </div>
    </div>
  );
}

const ROLES_INFO: RoleInfo[] = [
  {
    role: "admin",
    href: "/dashboard/admin",
    icon: Shield,
    title: "Admin",
    description: "Manage the application settings and users.",
  },
  {
    role: "content-creator",
    href: "/dashboard/content-creator",
    icon: Palette,
    title: "Content Creator",
    description: "Create and manage the content of the application.",
  },
  {
    role: "redaction",
    href: "/dashboard/redaction",
    icon: PenSquare,
    title: "Redaction",
    description: "Write and publish articles and news.",
  },
];
