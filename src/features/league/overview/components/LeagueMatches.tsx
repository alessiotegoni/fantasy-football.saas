import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import MatchdaySection from "../../admin/calendar/regular/components/MatchdaySection";

type Props = {
  calendar?: Match[];
  liveMatchday?: SplitMatchday;
  firstUpcomingMatchday?: SplitMatchday;
  lastEndedMatchday?: SplitMatchday;
};

export default function LeagueMatches({
  calendar,
  liveMatchday,
  firstUpcomingMatchday,
  lastEndedMatchday,
}: Props) {
  const liveMatches = calendar?.filter(
    (c) => c.splitMatchday.id === liveMatchday?.id
  );
  const upcomingMatches = calendar?.filter(
    (c) => c.splitMatchday.id === firstUpcomingMatchday?.id
  );
  const endedMatches = calendar?.filter(
    (c) => c.splitMatchday.id === lastEndedMatchday?.id
  );

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
          className="grow"
          matchday={lastEndedMatchday}
          matches={endedMatches}
        />
        <MatchdaySection
          title={`Prossima giornata (${firstUpcomingMatchday.number}ª)`}
          className="grow"
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
