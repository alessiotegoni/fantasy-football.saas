"use client";

import { useDashboardRoles } from "@/contexts/DashboardRolesProvider";
import { Shield, Palette, PenSquare } from "lucide-react";
import { getMetadataFromUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import { RoleCard, RoleInfo } from "@/features/dashboard/components/RoleCard";
import Disclaimer from "@/components/Disclaimer";

export default function DashboardPage() {
  const { user, userRoles } = useDashboardRoles();

  if (userRoles.length === 1) redirect(`/dashboard/${userRoles[0]}`);

  const availableRoles = ROLES_INFO.filter((info) =>
    userRoles.includes(info.role)
  );

  return (
    <div className="h-full sm:text-center flex flex-col gap-5 lg:justify-center items-center max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {getMetadataFromUser(user).name}
        </h1>
        <h2 className="text-2xl font-bold">
          Benvenuto nella tua area privata 👋
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableRoles.map((roleInfo) => (
          <RoleCard key={roleInfo.href} {...roleInfo} />
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}

const ROLES_INFO: RoleInfo[] = [
  {
    role: "admin",
    href: "/dashboard/admin",
    icon: Shield,
    title: "Admin",
    description: "Gestisci squadre, giocatori ed assegna bonus/malus",
  },
  {
    role: "content-creator",
    href: "/dashboard/content-creator",
    icon: Palette,
    title: "Content Creator",
    description: "Crea contenuti e vedi statistiche",
  },
  {
    role: "redaction",
    href: "/dashboard/redaction",
    icon: PenSquare,
    title: "Redazione",
    description: "Assegna e modifica voti ai giocatori",
  },
];
