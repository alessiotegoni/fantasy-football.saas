"use client";

import { useParams } from "next/navigation";
import { Match } from "../queries/calendar";
import CalendarMatchCard from "./CalendarMatchCard";
import { SplitMatchday } from "@/features/splits/queries/split";
import { useEffect, useRef } from "react";

type Props = {
  matchday: Match["splitMatchday"];
  matches: Match[];
  currentMatchday?: SplitMatchday;
};

export default function MatchdaySection({
  matchday,
  matches,
  currentMatchday,
}: Props) {
  const matchdayRef = useRef<HTMLDivElement>(null);
  const { leagueId } = useParams<{ leagueId: string }>();

  const scrollToMatchday = () => {
    matchdayRef.current!.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (currentMatchday?.id === matchday.id && matchdayRef.current) {
      scrollToMatchday();
    }
  }, [matchdayRef, currentMatchday]);

  return (
    <div ref={matchdayRef}>
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
