import { groupMatches } from "@/features/league/overview/utils/match";
import MatchdaySection from "../../admin/calendar/regular/components/MatchdaySection";

type Props = {
  matches: ReturnType<typeof groupMatches>;
};

export default function LeagueMatches({ matches }: Props) {
  const {
    live: { matchday: liveMatchday, matches: liveMatches },
    upcoming: { matchday: firstUpcomingMatchday, matches: upcomingMatches },
    ended: { matchday: lastEndedMatchday, matches: endedMatches },
  } = matches;

  if (liveMatchday && liveMatches?.length) {
    return <MatchdaySection matchday={liveMatchday} matches={liveMatches} />;
  }

  const hasUpcoming = firstUpcomingMatchday && upcomingMatches?.length;
  const hasEnded = lastEndedMatchday && endedMatches?.length;

  if (hasUpcoming && hasEnded) {
    return (
      <div className="flex flex-col 2xl:flex-row gap-4">
        <MatchdaySection
          title={`Ultima giornata (${lastEndedMatchday.number}ª)`}
          className="basis-1/2"
          matchday={lastEndedMatchday}
          matches={endedMatches}
        />
        <MatchdaySection
          title={`Prossima giornata (${firstUpcomingMatchday.number}ª)`}
          className="basis-1/2"
          matchday={firstUpcomingMatchday}
          matches={upcomingMatches}
        />
      </div>
    );
  }

  if (hasUpcoming) {
    return (
      <MatchdaySection
        title={`Prossima giornata (${firstUpcomingMatchday.number}ª)`}
        className="grow"
        matchday={firstUpcomingMatchday}
        matches={upcomingMatches}
      />
    );
  }

  if (hasEnded) {
    return (
      <MatchdaySection
        title={`Ultima giornata (${lastEndedMatchday.number}ª)`}
        className="grow"
        matchday={lastEndedMatchday}
        matches={endedMatches}
      />
    );
  }

  return null;
}
