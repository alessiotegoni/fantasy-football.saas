"use client";

import {
  RoleCard,
  type RoleInfo,
} from "@/features/dashboard/components/RoleCard";
import { Axes, Gift, Running, Shield } from "iconoir-react";

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
    icon: Axes,
    title: "Splits",
    description: "Gestisci gli split e le giornate del campionato",
  },
  {
    href: "/dashboard/admin/teams",
    icon: Shield,
    title: "Squadre",
    description: "Gestisci le squadre della lega",
  },
  {
    href: "/dashboard/admin/players",
    icon: Running,
    title: "Giocatori",
    description: "Gestisci i giocatori della lega",
  },
  {
    href: "/dashboard/admin/bonus-maluses",
    icon: Gift,
    title: "Bonus/Malus",
    description: "Gestisci i bonus e i malus del gioco",
  },
];
