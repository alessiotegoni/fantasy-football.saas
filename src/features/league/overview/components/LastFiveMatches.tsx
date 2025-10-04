import { groupMatches } from "@/features/league/overview/utils/match";
import { cn } from "@/lib/utils";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

const MAX_MATCHES = 5;

type Props = {
  matches: ReturnType<typeof groupMatches>;
  userTeam?: LeagueTeam;
};

type MatchResultType = "win" | "loss" | "draw" | "bye";

export default function LastFiveMatches({ matches, userTeam }: Props) {
  if (!matches) return null;

  const endedUserMatches = matches.ended.userMatches.filter(
    (match) => match.matchResults.length > 0 || match.isBye
  );

  const lastFiveMatches = endedUserMatches.slice(-MAX_MATCHES);

  const placeholderCount = Math.max(0, MAX_MATCHES - lastFiveMatches.length);

  return (
    <div className="p-4 xs:p-6 rounded-3xl bg-muted">
      <h3 className="font-bold mb-4">Ultimi 5 incontri</h3>
      <div className="flex justify-between xs:justify-evenly gap-4">
        {lastFiveMatches.map((match) => (
          <MatchListItem key={match.id} match={match} userTeam={userTeam} />
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <PlaceholderListItem key={index} />
        ))}
      </div>
    </div>
  );
}

function MatchListItem({
  match,
  userTeam,
}: Pick<Props, "userTeam"> & { match: Match }) {
  const userTeamResult = match.matchResults.find(
    (r) => r.teamId === userTeam?.id
  );
  const opponentTeamResult = match.matchResults.find(
    (r) => r.teamId !== userTeam?.id
  );
  const result = getMatchResult(match, userTeamResult, opponentTeamResult);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center size-8 xs:size-10 rounded-full font-heading font-bold",
          getResultColor(result)
        )}
      >
        {match.splitMatchday.number}
      </div>
      {!match.isBye && (
        <div className="space-y-1 text-center">
          <div className="text-sm xs:text-base font-semibold">
            {userTeamResult?.goals ?? 0} - {opponentTeamResult?.goals ?? 0}
          </div>
          <div className="text-xs xs:text-sm text-muted-foreground">
            {userTeamResult?.totalScore}
          </div>
        </div>
      )}
    </div>
  );
}

function PlaceholderListItem() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="size-8 xs:size-10 rounded-full bg-gray-500/20 mb-2" />
      <div className="space-y-2">
        <div className="w-5 h-2 xs:w-8 xs:h-4 bg-gray-500/20 rounded-2xl" />
        <div className="mx-auto w-3 h-2 xs:w-6 xs:h-3 bg-gray-500/20 rounded-2xl" />
      </div>
    </div>
  );
}

function getMatchResult(
  match: Match,
  userTeamResult: Match["matchResults"][number] | undefined,
  opponentTeamResult: Match["matchResults"][number] | undefined
): MatchResultType {
  if (match.isBye) return "bye";
  if (!userTeamResult || !opponentTeamResult) return "draw";
  if (userTeamResult.totalScore > opponentTeamResult.totalScore) return "win";
  if (userTeamResult.totalScore < opponentTeamResult.totalScore) return "loss";
  return "draw";
}

function getResultColor(result: MatchResultType) {
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
