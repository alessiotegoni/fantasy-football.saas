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

  if (!availableRoles.length) redirect("/dashboard/user/profile");

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
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">
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
