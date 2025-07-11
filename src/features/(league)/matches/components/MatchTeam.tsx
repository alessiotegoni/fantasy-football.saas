import { AlertTriangle } from "lucide-react";
import { LeagueTeam } from "@/features/(league)/teams/queries/leagueTeam";
import Avatar from "@/components/Avatar";

type TeamCardProps = {
  team: Pick<LeagueTeam, "id" | "name" | "imageUrl"> | null;
  isBye?: boolean;
  isDetailView?: boolean;
  tacticalModuleName?: string;
  isWinner?: boolean;
  className?: string;
};

export default function MatchTeam({
  team,
  isWinner,
  isBye = false,
  isDetailView = false,
  tacticalModuleName,
  className = "",
}: TeamCardProps) {
  if (isBye && !team) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-2 text-center w-full ${className}`}
      >
        <div className="size-12 sm:size-20 rounded-full bg-muted flex items-center justify-center">
          <span className="text-3xl">💤</span>
        </div>
        <div>
          <p className="text-sm sm:text-lg text-muted-foreground font-semibold">
            Riposo
          </p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-2 text-center w-full ${className}`}
      >
        <div className="size-12 sm:size-20 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="size-10 text-destructive" />
        </div>
        <div>
          <p className="text-sm sm:text-lg text-destructive">
            Team non disponibile
          </p>
        </div>
      </div>
    );
  }

  if (isDetailView) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-3 text-center w-full ${className}`}
      >
        <h3 className="text-lg font-semibold text-white">{team.name}</h3>
        <p className="text-muted-foreground">{tacticalModuleName}</p>
        <Avatar
          imageUrl={team.imageUrl}
          name={team.name}
          renderFallback={() => null}
          className="size-20"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-2 text-center w-full ${className}`}
    >
      <Avatar
        imageUrl={team.imageUrl}
        name={team.name}
        renderFallback={() => null}
        className="size-12 sm:size-20"
      />
      <div>
        <h3
          className={`text-sm sm:text-lg ${
            isWinner ? "font-extrabold" : "font-semibold"
          } text-white`}
        >
          {team.name}
        </h3>
      </div>
    </div>
  );
}
