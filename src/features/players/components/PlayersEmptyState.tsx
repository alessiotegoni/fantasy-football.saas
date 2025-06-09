"use client";

import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import usePlayersList from "@/hooks/usePlayersList";

export default function PlayersEmptyState({ label }: { label: string }) {
  const { handleResetFilters } = usePlayersList();

  return (
    <EmptyState
      title={`Nessun ${label} trovato`}
      description={`Se non trovi il ${label} che stai cercando probabilmente e' gia stato
        acquistato da qualcuno`}
      renderButton={() => (
        <Button
          variant="gradient"
          className="w-fit mt-7 gap-4 !px-4"
          onClick={handleResetFilters}
        >
          Oppure resetta filtri
        </Button>
      )}
    />
  );
}
