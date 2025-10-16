"use client";

import EmptyState from "@/components/EmptyState";
import LinkButton from "@/components/LinkButton";
import { Href } from "@/utils/helpers";
import { NavArrowRight, WarningTriangle } from "iconoir-react";
import { useParams } from "next/navigation";

export default function TeamsEmptyState({ className }: { className?: string }) {
  const { leagueId } = useParams();

  return (
    <EmptyState
      icon={WarningTriangle}
      title="Nessuna squadra trovata"
      description="Crea la prima squadra"
      className={className}
      renderButton={() => (
        <LinkButton
        className="min-w-30"
          variant="gradient"
          href={`/league/${leagueId}/teams/create` as Href}
        >
          Crea
          <NavArrowRight className="size-5" />
        </LinkButton>
      )}
    />
  );
}
