import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { LeagueTeam } from "@/features/(league)/teams/queries/leagueTeam";
import Avatar from "@/components/Avatar";

type TeamCardProps = {
  team: Pick<LeagueTeam, "id" | "name" | "imageUrl"> | null;
  isBye?: boolean;
  isDetailView?: boolean;
  className?: string;
};

export default function MatchTeam({
  team,
  isBye = false,
  isDetailView = false,
  className = "",
}: TeamCardProps) {
  if (isBye && !team) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      >
        <div className="size-20 rounded-full bg-muted flex items-center justify-center">
          <span className="text-3xl">💤</span>
        </div>
        <div className="text-center">
          <p className="text-base text-gray-400">Riposo</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      >
        <div className="size-20 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="size-10 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-base text-destructive">Team non disponibile</p>
        </div>
      </div>
    );
  }

  if (isDetailView) {
    return (
      <div className={`flex flex-col items-center space-y-3 ${className}`}>
        <h3 className="text-lg font-semibold text-white text-center">
          {team.name}
        </h3>
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
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <Avatar
        imageUrl={team.imageUrl}
        name={team.name}
        renderFallback={() => null}
        className="size-20"
      />
      <div className="text-center">
        <h3 className="text-base font-semibold text-white">{team.name}</h3>
      </div>
    </div>
  );
}
