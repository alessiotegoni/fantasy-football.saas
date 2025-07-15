import StarterLineupFieldsWrapper from "./StarterLineupFieldsWrapper";
import { getStarterLineups, LineupTeam, MatchInfo } from "../queries/match";
import { TacticalModule } from "@/drizzle/schema";
import { WarningTriangle } from "iconoir-react";
import { SplitMatchday } from "@/features/splits/queries/split";

type Props = {
  leagueId: string;
  myTeam?: LineupTeam;
  currentMatchday: SplitMatchday;
  canEditLineup: boolean;
} & MatchInfo;

export default async function StarterLineupsWrapper({
  id: matchId,
  isBye,
  homeTeam,
  awayTeam,
  currentMatchday,
  myTeam,
  canEditLineup,
}: Props) {
  const starterPlayers = await getStarterLineups(matchId, currentMatchday.id);

  const showLineupFields =
    canEditLineup && !isBye && (!homeTeam?.lineup || !awayTeam?.lineup);

  return (
    <div className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full min-h-[600px] sm:min-h-[400px] xl:min-h-[500px]">
      {showLineupFields ? (
        <StarterLineupFieldsWrapper
          matchId={matchId}
          currentMatchdayId={currentMatchday.id}
          homeTacticalModule={homeTeam?.lineup?.tacticalModule}
          awayTacticalModule={awayTeam?.lineup?.tacticalModule}
          canEditHome={canEditLineup && homeTeam?.id === myTeam?.id}
          canEditAway={canEditLineup && awayTeam?.id === myTeam?.id}
          starterPlayers={starterPlayers}
        />
      ) : (
        <>
          {homeTeam?.lineup ? (
            <StarterLineupTeam
              teamId={homeTeam.id}
              players={starterPlayers.filter((p) => p.teamId === homeTeam.id)}
            />
          ) : (
            <LineupEmptyState
              text={
                homeTeam?.id === myTeam?.id
                  ? "Non puoi più inserire la formazione"
                  : undefined
              }
            />
          )}
          {awayTeam?.lineup ? (
            <StarterLineupTeam
              teamId={awayTeam.id}
              players={starterPlayers.filter((p) => p.teamId === awayTeam.id)}
            />
          ) : (
            <LineupEmptyState
              text={
                awayTeam?.id === myTeam?.id
                  ? "Non puoi più inserire la formazione"
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
      <div className="max-w-40 bg-muted rounded-3xl text-sm text-center flex flex-col justify-center items-center p-4 border border-border">
        <WarningTriangle className="size-12 mb-3" />
        {text}
      </div>
    </div>
  );
}
