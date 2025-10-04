import { groupMatches } from "@/features/league/overview/utils/match";
import { cn } from "@/lib/utils";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

type Props = {
  matches?: ReturnType<typeof groupMatches>;
  userTeam?: LeagueTeam;
};

const MAX_MATCHES = 5;

export default function LastFiveMatches({ matches, userTeam }: Props) {
  if (!matches) return null;

  const userEndedMatches = matches.ended.userMatches
    .filter((match) => match.matchResults.length > 0 || match.isBye)
    .slice(0, MAX_MATCHES);

  const placeholders = Array(MAX_MATCHES - userEndedMatches.length).fill(null);

  return (
    <div className="p-4 xs:p-6 rounded-3xl bg-muted">
      <h3 className="font-bold mb-4">Ultimi 5 incontri</h3>

      <div className="flex justify-between xs:justify-evenly gap-4">
        {userEndedMatches.map((match) => {
          const userTeamResult = match.matchResults.find(
            (r) => r.teamId === userTeam?.id
          );
          const opponentTeamResult = match.matchResults.find(
            (r) => r.teamId !== userTeam?.id
          );
          const result = getMatchResult(
            match,
            userTeamResult,
            opponentTeamResult
          );

          return (
            <div key={match.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center size-8 xs:size-10 rounded-full font-heading font-bold",
                  getResultColor(result)
                )}
              >
                {match.splitMatchday.number}
              </div>
              {!match.isBye && (
                <div className="space-y-1">
                  <div className="text-sm xs:text-base font-semibold">
                    {userTeamResult?.goals ?? 0} -{" "}
                    {opponentTeamResult?.goals ?? 0}
                  </div>
                  <div className="text-xs xs:text-sm text-muted-foreground">
                    {userTeamResult?.totalScore}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {placeholders.map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className="size-8 xs:size-10 rounded-full bg-gray-500 opacity-20" />
            <div className="text-xs font-semibol text-muted-foreground">-</div>
            <div className="text-xs text-muted-foreground">-</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMatchResult(
  match: Match,
  userTeamResult: Match["matchResults"][number] | undefined,
  opponentTeamResult: Match["matchResults"][number] | undefined
) {
  if (match.isBye) return "bye";

  if (!userTeamResult || !opponentTeamResult) return "draw";

  if (userTeamResult.totalScore > opponentTeamResult.totalScore) {
    return "win";
  }
  if (userTeamResult.totalScore < opponentTeamResult.totalScore) {
    return "loss";
  }
  return "draw";
}

function getResultColor(result: "win" | "loss" | "draw" | "bye") {
  switch (result) {
    case "win":
      return "bg-green-500";
    case "loss":
      return "bg-destructive";
    case "draw":
      return "bg-gray-500";
    case "bye":
      return "bg-gray-500/70";
  }
}
