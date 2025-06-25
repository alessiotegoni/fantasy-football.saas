"use client";

import TeamsSelectField from "@/features/teams/components/TeamsSelectField";
import { useRouter, useSearchParams } from "next/navigation";
import { TradeProposalSchema } from "../schema/trade";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function TradeReceiverTeamSelect({
  leagueTeams,
  placeholder,
  className,
}: {
  leagueTeams: LeagueTeam[];
  placeholder?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useFormContext<TradeProposalSchema>();

  const setReceiverTeamParams = useCallback((teamId: string) => {
    const receiverTeamId = searchParams.get("receiverTeamId");

    if (receiverTeamId === teamId) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("receiverTeamId", teamId);
    router.replace(`?${newSearchParams.toString()}`);
  }, []);

  return (
    <TeamsSelectField<TradeProposalSchema>
      className={cn("text-md", className)}
      placeholder={placeholder}
      name="receiverTeamId"
      teams={leagueTeams
        .filter((team) => team.id !== form.getValues("proposerTeamId"))
        .map((team) => ({ id: team.id, name: team.name }))}
      onSelect={setReceiverTeamParams}
    />
  );
}
