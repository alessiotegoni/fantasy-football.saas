"use client";

import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { usePlayersFilters } from "@/contexts/PlayersFiltersProvider";
import { NavArrowRight } from "iconoir-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PlayersEmptyState({
  title = "Nessun giocatore trovato",
  description = `Se non trovi il giocatore che stai cercando probabilmente e' gia stato
        acquistato da qualcuno`,
}: {
  title?: string;
  description?: string;
}) {
  const { leagueId } = useParams();

  const { filters, handleResetFilters } = usePlayersFilters();

  const hasFilters = Object.values(filters).some((filter) =>
    Boolean(filter.length)
  );

  return (
    <EmptyState
      title={title}
      description={description}
      renderButton={() =>
        hasFilters ? (
          <Button
            variant="gradient"
            className="gap-4 !px-7"
            onClick={handleResetFilters}
          >
            Resetta filtri
          </Button>
        ) : (
          <Button
            variant="gradient"
            className="gap-2 !px-5"
            onClick={handleResetFilters}
            asChild
          >
            <Link href={`/leagues/${leagueId}/teams`}>
              Vedi squadre
              <NavArrowRight className="size-5" />
            </Link>
          </Button>
        )
      }
    />
  );
}
