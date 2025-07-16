import { AlertTriangle } from "lucide-react";
import Avatar from "@/components/Avatar";
import { LineupTeam } from "../utils/match";

type TeamCardProps = {
  team: Omit<LineupTeam, "lineup">;
  isBye?: boolean;
  module?: string | null;
  isWinner?: boolean;
  className?: string;
};

export default function MatchTeam({
  team,
  isWinner,
  isBye = false,
  module,
  className = "",
}: TeamCardProps) {
  if (isBye && !team.id) {
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

  return (
    <div
      className={`flex flex-col items-center justify-center text-center w-full ${className}`}
    >
      {team.name ? (
        <Avatar
          imageUrl={team.imageUrl}
          name={team.name}
          renderFallback={() => null}
          className="size-12 sm:size-20 mb-2"
        />
      ) : (
        <div className="size-12 sm:size-20 rounded-full bg-muted flex items-center justify-center">
          <AlertTriangle className="size-10 text-destructive" />
        </div>
      )}
      {module !== undefined && (
        <p className="hidden sm:block text-sm text-muted-foreground">
          {module || "Formazione non inserita"}
        </p>
      )}
      <div>
        {team.name ? (
          <h3
            className={`text-sm sm:text-lg ${
              isWinner ? "font-extrabold" : "font-semibold"
            } text-white`}
          >
            {team.name}
          </h3>
        ) : (
          <p className="text-sm sm:text-lg text-destructive mt-2">
            Team non disponibile
          </p>
        )}
      </div>
    </div>
  );
}
