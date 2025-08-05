"use client";

import { useParams } from "next/navigation";
import { Match } from "../queries/calendar";
import { SplitMatchday } from "@/features/splits/queries/split";
import { useEffect, useRef } from "react";
import MatchCard from "@/features/(league)/matches/components/MatchCard";

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
      block: "center",
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

      {matches.map((match) => (
        <MatchCard key={match.id} {...match} leagueId={leagueId} />
      ))}
    </div>
  );
}
