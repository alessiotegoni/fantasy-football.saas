"use client";

import { RoleCard, type RoleInfo } from "@/features/dashboard/components/RoleCard";
import { ClipboardCheck, ClipboardEdit, ChartBar } from "lucide-react";

export default function RedactionPage() {
  return (
    <div className="h-full sm:text-center flex flex-col gap-5 lg:justify-center items-center max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Redazione</h1>
        <h2 className="text-2xl font-bold">
          Seleziona una delle seguenti sezioni
        </h2>
      </div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">
        {LINKS_INFO.map((linkInfo) => (
          <RoleCard key={linkInfo.href} {...linkInfo} />
        ))}
      </div>
    </div>
  );
}

const LINKS_INFO: Omit<RoleInfo, "role">[] = [
  {
    href: "/dashboard/redaction/votes",
    icon: ClipboardCheck,
    title: "Assegna Voti",
    description: "Assegna i voti ai giocatori per la giornata corrente",
  },
  {
    href: "/dashboard/redaction/team-stats",
    icon: ChartBar,
    title: "Statisctiche squadra",
    description: "Vedi le statistiche della tua squadra",
  },
];
