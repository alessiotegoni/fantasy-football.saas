"use client";

import { Role, useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import { Shield, Palette, PenSquare } from "lucide-react";
import { getMetadataFromUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import { ElementType } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, roles } = useDashboardRoles();

  if (roles.length === 1) redirect(`/dashboard/${roles[0]}`);

  const { name } = getMetadataFromUser(user);

  const availableRoles = ROLES_INFO.filter((info) => roles.includes(info.role));

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

type RoleInfo = {
  role: Role;
  href: __next_route_internal_types__.RouteImpl<string>;
  icon: ElementType;
  title: string;
  description: string;
};

const ROLES_INFO: readonly RoleInfo[] = [
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

export function RoleCard({
  href,
  icon: Icon,
  title,
  description,
}: Omit<RoleInfo, "role">) {
  return (
    <Link href={href}>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Icon className="size-7 mb-2" />
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Link>
  );
}
