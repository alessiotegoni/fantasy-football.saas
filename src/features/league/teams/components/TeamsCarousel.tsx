"use client";

import Avatar from "@/components/Avatar";
import { LeagueTeam } from "../queries/leagueTeam";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TeamsEmptyState from "./TeamsEmptyState";
import { sortTeams } from "../utils/leagueTeam";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeamsCarousel({
  leagueTeams,
  userId,
}: {
  leagueTeams: LeagueTeam[];
  userId?: string;
}) {
  if (!leagueTeams.length) return <TeamsEmptyState />;

  const sortedTeams = sortTeams({ teams: leagueTeams, userId });

  return (
    <Carousel
      opts={{
        dragFree: false,
        align: "start",
      }}
      className="hidden md:block w-full"
    >
      <CarouselContent>
        {sortedTeams.map((team) => (
          <TeamCardItem key={team.id} team={team} />
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-3" />
      <CarouselNext className="-right-3" />
    </Carousel>
  );
}

function TeamCardItem({ team }: { team: LeagueTeam }) {
  const { leagueId } = useParams();
  return (
    <CarouselItem key={team.id} className="rounded-2xl">
      <div className="rounded-3xl flex flex-col items-center justify-center p-6 bg-input/30 h-80">
        <Link
          className="text-center"
          href={`/league/${leagueId}/teams/${team.id}`}
        >
          <Avatar
            imageUrl={team.imageUrl}
            name={team.name}
            className="size-20 *:object-cover"
            renderFallback={() => null}
          />

          <p className="mt-4 text-lg font-semibold">{team.name}</p>
          <p className="text-sm text-muted-foreground">{team.managerName}</p>
        </Link>
      </div>
    </CarouselItem>
  );
}
