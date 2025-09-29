import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchdaySection from "../../admin/calendar/regular/components/MatchdaySection";

type Props = {
  firstUpcomingMatchday?: SplitMatchday;
  upcomingMatches?: Match[];
  liveMatchday?: SplitMatchday;
  liveMatches?: Match[];
  lastEndedMatchday?: SplitMatchday;
  endedMatches?: Match[];
};

export default function LeagueMatches({
  liveMatchday,
  liveMatches,
  firstUpcomingMatchday,
  upcomingMatches,
  lastEndedMatchday,
  endedMatches,
}: Props) {
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
