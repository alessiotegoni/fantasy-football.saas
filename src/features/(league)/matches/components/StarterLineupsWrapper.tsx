import { CustomBonusMalus } from "@/drizzle/schema";
import { getCurrentMatchday } from "@/features/splits/queries/split";
import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { formatTeamData } from "../queries/match";
import { WarningTriangle } from "iconoir-react";
import StarterLineupFieldsWrapper from "./StarterLineupFieldsWrapper";

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

  const canEditLineup = [
    !!myTeam,
    !isBye,
    splitMatchday.id === currentMatchday?.id,
    currentMatchday?.status === "upcoming",
  ].every(Boolean);

  const showLineupFields =
    canEditLineup && (!homeTeam?.lineup || !awayTeam?.lineup);

  return (
    <div className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full min-h-[600px] sm:min-h-[400px]">
      {showLineupFields ? (
        <StarterLineupFieldsWrapper
          matchId={matchId}
          currentMatchdayId={splitMatchday.id}
          homeTacticalModule={homeTeam?.lineup?.tacticalModule}
          awayTacticalModule={awayTeam?.lineup?.tacticalModule}
          canEditHome={canEditLineup && homeTeam?.id === myTeam?.id}
          canEditAway={canEditLineup && homeTeam?.id === myTeam?.id}
        />
      ) : (
        <>
          {homeTeam?.lineup ? (
            <div></div>
          ) : (
            <LineupEmptyState
              text={
                homeTeam?.id === myTeam?.id
                  ? "Non puoi piu inserire la formazione"
                  : undefined
              }
            />
          )}
          {awayTeam?.lineup ? (
            <div></div>
          ) : (
            <LineupEmptyState
              text={
                awayTeam?.id === myTeam?.id
                  ? "Non puoi piu inserire la formazione"
                  : undefined
              }
            />
          )}
        </>
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
