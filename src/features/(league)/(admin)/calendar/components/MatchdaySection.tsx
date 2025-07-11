"use client"

import { Match } from "../queries/calendar";
import CalendarMatchCard from "./CalendarMatchCard";

export default function MatchdaySection({
  matchday,
  matches,
  leagueId,
}: {
  matchday: Match["splitMatchday"];
  matches: Match[];
  leagueId: string;
}) {
  return (
    <div>
      <div className="bg-primary rounded-t-2xl px-4 py-3">
        <h2 className="text-lg font-bold text-white">
          {matchday.number}ª giornata
        </h2>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <CalendarMatchCard key={match.id} {...match} leagueId={leagueId} />
        ))}
      </div>
    </div>
  );
}
