import LinkButton from "@/components/LinkButton";
import { NavArrowRight, Search } from "iconoir-react";

export default function CreateTeamBanner({ leagueId }: { leagueId: string }) {
  return (
    
    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:p-4 bg-muted/30 rounded-3xl mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="size-16 bg-muted rounded-full flex items-center justify-center">
          <Search className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center md:text-start">
          <h3 className="text-lg md:text-xl font-heading">
            Non hai ancora una squadra
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Crea la tua squadra per partecipare alla Lega
          </p>
        </div>
      </div>
      <LinkButton
        variant="gradient"
        className="w-fit mt-6 md:mt-0 gap-4 py-3.5 px-4"
        href={`/league/${leagueId}/teams/create`}
      >
        Crea la tua squadra
        <NavArrowRight className="size-5" />
      </LinkButton>
    </div>
  );
}
