import { CustomBonusMalus } from "@/drizzle/schema";
import { getCurrentMatchday } from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { formatTeamData } from "../queries/match";
import { WarningTriangle } from "iconoir-react";

type Team = ReturnType<typeof formatTeamData>;

type Props = {
  matchId: string;
  leagueId: string;
  homeTeam: Team;
  awayTeam: Team;
  isBye: boolean;
  splitMatchday: {
    id: number;
    splitId: number;
  };
  leagueCustomBonusMalus: CustomBonusMalus;
};

export default async function StarterLineupsWrapper({
  matchId,
  leagueId,
  isBye,
  homeTeam,
  awayTeam,
  leagueCustomBonusMalus,
  splitMatchday,
}: Props) {
  const userId = await getUserId();
  if (!userId) return;

  const [userTeamId, currentMatchday] = await Promise.all([
    getUserTeamId(userId, leagueId),
    getCurrentMatchday(splitMatchday.splitId),
  ]);
  const myTeam = [homeTeam, awayTeam].find((team) => team?.id === userTeamId);

  const canPutLineup = [
    !!myTeam,
    !isBye,
    splitMatchday.id === currentMatchday?.id,
    currentMatchday?.status === "upcoming",
  ].every(Boolean);

  return (
    <div
      className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full
    min-h-[600px] sm:min-h-[400px]"
    >
      {homeTeam?.lineup ? (
        <div></div>
      ) : homeTeam?.id !== myTeam?.id ? (
        <LineupEmptyState />
      ) : canPutLineup ? (
        <div></div>
      ) : (
        <LineupEmptyState text="Non puoi piu inserire la formazione" />
      )}
      {awayTeam?.lineup ? (
        <div></div>
      ) : awayTeam?.id !== myTeam?.id ? (
        <LineupEmptyState />
      ) : canPutLineup ? (
        <div></div>
      ) : (
        <LineupEmptyState text="Non puoi piu inserire la formazione" />
      )}
    </div>
  );
}

function LineupEmptyState({
  text = "Formazione non inserita",
}: {
  text?: string;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="max-w-40 bg-muted rounded-3xl text-sm text-center
          flex flex-col justify-center items-center p-4 border border-border"
      >
        <WarningTriangle className="size-12 mb-3" />
        {text}
      </div>
    </div>
  );
}
