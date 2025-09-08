"use client";

import {
  RoleCard,
  type RoleInfo,
} from "@/features/dashboard/components/RoleCard";
import { Shield, Users, Spline, Shirt } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="h-full sm:text-center flex flex-col gap-5 lg:justify-center items-center max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <h2 className="text-lg font-medium">
          Seleziona una delle seguenti sezioni
        </h2>
      </div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {LINKS_INFO.map((linkInfo) => (
          <RoleCard key={linkInfo.href} {...linkInfo} />
        ))}
      </div>
    </div>
  );
}

const LINKS_INFO: Omit<RoleInfo, "role">[] = [
  {
    href: "/dashboard/admin/splits",
    icon: Spline,
    title: "Splits",
    description: "Gestisci gli split di campionato",
  },
  {
    href: "/dashboard/admin/teams",
    icon: Shirt,
    title: "Squadre",
    description: "Gestisci le squadre di Serie A",
  },
  {
    href: "/dashboard/admin/players",
    icon: Users,
    title: "Giocatori",
    description: "Gestisci i giocatori e le loro quotazioni",
  },
  {
    href: "/dashboard/admin/bonus-maluses",
    icon: Shield,
    title: "Bonus/Malus",
    description: "Gestisci i bonus e i malus del gioco",
  },
];
