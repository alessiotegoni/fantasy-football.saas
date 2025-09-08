"use client";

import { memo } from "react";
import { Group, NavArrowRight, Search } from "iconoir-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import { useFilter } from "@/hooks/useFilter";
import { Button } from "@/components/ui/button";
import { VirtualizedList } from "@/components/VirtualizedList";

export type PublicLeague = {
  id: string;
  name: string;
  description: string | null;
  maxMembers: number | null;
  currentMembers: number;
};

export function VirtualizedLeaguesList({
  leagues,
}: {
  leagues: PublicLeague[];
}) {
  const { filteredItems: filteredLeagues, handleFilter } = useFilter(leagues, {
    defaultFilters: "",
    filterFn: (league, term) =>
      league.name.toLowerCase().includes(term.toLowerCase()) ||
      !!league.description?.toLowerCase().includes(term.toLowerCase()),
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <SearchBar onSearch={handleFilter} placeholder="Cerca per nome..." />

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-heading">
          {filteredLeagues.length}{" "}
          {filteredLeagues.length === 1 ? "lega trovata" : "leghe trovate"}
        </h2>
      </div>

      {!filteredLeagues.length ? (
        <div className="flex flex-col justify-center items-center py-8 sm:py-12 bg-muted/30 rounded-2xl">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-heading mb-2">Nessuna lega trovata</h3>
          <p className="text-muted-foreground">
            Prova a modificare i criteri di ricerca
          </p>
          <Button variant="gradient" asChild className="w-fit mt-7 gap-4 !px-4">
            <Link href="/create-league">
              Oppure crea la tua lega
              <NavArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      ) : (
        <VirtualizedList
          items={filteredLeagues}
          estimateSize={140}
          renderItem={(league) => <LeagueCard key={league.id} {...league} />}
        />
      )}
    </div>
  );
}

const LeagueCard = memo(
  ({ id, name, description, currentMembers, maxMembers }: PublicLeague) => {
    const { color, label } = getOccupancyStatus(
      currentMembers,
      maxMembers ?? 20
    );

    return (
      <Link
        href={`/join-league/public/${id}`}
        className="flex flex-col justify-between p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:border-primary min-h-[166px]"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-heading line-clamp-1">{name}</h3>
          <span
            className={cn("px-2 py-1 rounded-full text-xs font-medium", color)}
          >
            {label}
          </span>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm gap-2 text-muted-foreground">
            <Group className="size-4" />
            <span>
              {currentMembers}/{maxMembers} membri
            </span>
          </div>
        </div>
      </Link>
    );
  }
);

function getOccupancyStatus(current: number, max: number) {
  const percentage = (current / max) * 100;

  if (percentage < 50) {
    return { color: "bg-green-100 text-green-800", label: "Disponibile" };
  } else if (percentage >= 80) {
    return { color: "bg-yellow-100 text-yellow-800", label: "Quasi piena" };
  } else {
    return { color: "bg-blue-100 text-blue-800", label: "In riempimento" };
  }
}
