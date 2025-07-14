import { CustomBonusMalus } from "@/drizzle/schema";
import { getCurrentMatchday } from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { formatTeamData } from "../queries/match";
import { WarningTriangle } from "iconoir-react";

type Team = ReturnType<typeof formatTeamData>;

type Props = {
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
      {!homeTeam?.lineup && homeTeam?.id !== myTeam?.id ? (
        <LineupEmptyState />
      ) : (
        <div></div>
      )}
      {!awayTeam?.lineup && awayTeam?.id !== myTeam?.id ? (
        <LineupEmptyState />
      ) : (
        <div></div>
      )}
    </div>
  );
}

function LineupEmptyState() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="max-w-40 bg-muted rounded-3xl text-sm text-center
          flex flex-col justify-center items-center p-4 border border-border"
      >
        <WarningTriangle className="size-12 mb-3" />
        Formazione non inserita
      </div>
    </div>
  );
}
