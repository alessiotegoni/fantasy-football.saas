"use client";

import { VirtualizedList } from "@/components/VirtualizedList";
import usePlayersList from "@/hooks/usePlayersList";
import PlayerCard from "./PlayerCard";
import { Search } from "iconoir-react";
import { Button } from "@/components/ui/button";

export default function PlayersList({ leagueId }: { leagueId: string }) {
  const { filteredPlayers } = usePlayersList();

  return (
    <div className="mt-4">
      <h2 className="mb-3 text-xl">Giocatori</h2>
      {filteredPlayers.length ? (
        <VirtualizedList
          items={filteredPlayers}
          estimateSize={80}
          renderItem={(player) => <PlayerCard key={player.id} {...player} />}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  const { handleResetFilters } = usePlayersList();

  return (
    <div className="flex flex-col justify-center items-center p-8 sm:py-12 bg-muted/30 rounded-2xl text-center
    text-sm md:text-base">
      <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-heading mb-2">Nessun giocatore trovato</h3>
      <p className="text-muted-foreground">
        Se non trovi il giocatore che stai cercando probabilmente e' gia stato
        acquistato da qualcuno
      </p>
      <Button
        variant="gradient"
        className="w-fit mt-7 gap-4 !px-4"
        onClick={handleResetFilters}
      >
        Oppure resetta filtri
      </Button>
    </div>
  );
}
