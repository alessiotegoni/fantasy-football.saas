import Avatar from "@/components/Avatar";
import { getLeagueTeams, LeagueTeam } from "../queries/leagueTeam";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TeamsEmptyState from "./TeamsEmptyState";

export default async function TeamsCarousel({
  teams,
}: {
  teams: LeagueTeam[];
}) {
  if (!teams.length) return <TeamsEmptyState />;

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {teams.map((team) => (
          <CarouselItem key={team.id} className="rounded-2xl">
            <div className="rounded-3xl flex flex-col items-center justify-center p-6 bg-input/30 min-h-70">
              <Avatar
                imageUrl={team.imageUrl}
                name={team.name}
                className="size-20 *:object-cover"
                renderFallback={() => null}
              />

              <p className="mt-4 text-lg font-semibold">{team.name}</p>
              <p className="text-sm text-muted-foreground">
                {team.managerName}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-3" />
      <CarouselNext className="-right-3" />
    </Carousel>
  );
}
