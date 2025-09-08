"use client";

import { RoleCard, type RoleInfo } from "@/features/dashboard/components/RoleCard";
import { TicketPercent, BarChart } from "lucide-react";

export default function ContentCreatorPage() {
  return (
    <div className="h-full sm:text-center flex flex-col gap-5 lg:justify-center items-center max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Creator Dashboard</h1>
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
    href: "/dashboard/content-creator/discount-code",
    icon: TicketPercent,
    title: "Codice Sconto",
    description: "Crea e gestisci i tuoi codici sconto",
  },
  {
    href: "/dashboard/content-creator/stats",
    icon: BarChart,
    title: "Statistiche",
    description: "Visualizza le statistiche dei tuoi referral",
  },
];
