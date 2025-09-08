"use client";

import { RoleCard, type RoleInfo } from "@/features/dashboard/components/RoleCard";
import { ClipboardCheck, ClipboardEdit, BarChart3 } from "lucide-react";

export default function RedactionPage() {
  return (
    <div className="h-full sm:text-center flex flex-col gap-5 lg:justify-center items-center max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Redaction Dashboard</h1>
        <h2 className="text-2xl font-bold">
          Seleziona una delle seguenti sezioni
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {LINKS_INFO.map((linkInfo) => (
          <RoleCard key={linkInfo.href} {...linkInfo} />
        ))}
      </div>
    </div>
  );
}

const LINKS_INFO: Omit<RoleInfo, "role">[] = [
  {
    href: "/dashboard/redaction/assign-votes",
    icon: ClipboardCheck,
    title: "Assegna Voti",
    description: "Assegna i voti ai giocatori per la giornata corrente",
  },
  {
    href: "/dashboard/redaction/edit-votes",
    icon: ClipboardEdit,
    title: "Modifica Voti",
    description: "Modifica i voti assegnati in precedenza",
  },
  {
    href: "/dashboard/redaction/team-stats",
    icon: BarChart3,
    title: "Statistiche Squadra",
    description: "Visualizza le statistiche della tua redazione",
  },
];
