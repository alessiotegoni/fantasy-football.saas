"use client";

import { useParams } from "next/navigation";
import { Match } from "../queries/calendar";
import { useEffect, useRef } from "react";
import MatchCard from "@/features/league/matches/components/MatchCard";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";

type Props = {
  title?: string;
  matchday: Match["splitMatchday"];
  matches: Match[];
  currentMatchday?: SplitMatchday;
};

export default function MatchdaySection({
  title,
  matchday,
  matches,
  currentMatchday,
}: Props) {
  const matchdayRef = useRef<HTMLDivElement>(null);
  const { leagueId } = useParams<{ leagueId: string }>();

  function scrollToMatchday() {
    matchdayRef.current!.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  useEffect(() => {
    if (currentMatchday?.id === matchday.id && matchdayRef.current) {
      scrollToMatchday();
    }
  }, [matchdayRef, currentMatchday]);

  return (
    <div ref={matchdayRef}>
      <div className="bg-primary rounded-t-2xl px-4 py-3">
        <h2 className="text-lg font-bold text-white">
          {title ?? `${matchday.number}ª giornata}`}
        </h2>
      </div>

      {matches.map((match) => (
        <MatchCard key={match.id} {...match} leagueId={leagueId} />
      ))}
    </div>
  );
}
