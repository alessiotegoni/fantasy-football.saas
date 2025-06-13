import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TeamCreditsBadge from "./TeamCreditsBadge";

type Props = {
  leagueId: string;
  team: {
    id: string;
    name: string;
    imageUrl: string | null;
    managerName: string;
    credits: number;
    userId?: string;
  };
  teamUserId?: string;
  className?: string;
  showIsUserTeam?: boolean;
  renderTeamPpr?: () => React.ReactNode;
};

export default function LeagueTeamCard({
  team,
  teamUserId,
  showIsUserTeam = true,
  leagueId,
  className,
  renderTeamPpr,
}: Props) {
  return (
    <div
      key={team.id}
      className={cn(
        "bg-background rounded-xl border border-border hover:border-primary/20 transition-colors",
        "flex p-4 gap-4 h-full justify-between",
        showIsUserTeam && team.userId === teamUserId && "border-primary",
        className
      )}
    >
      <Link
        href={`/leagues/${leagueId}/teams/${team.id}`}
        className="flex items-center gap-4 grow"
      >
        <Avatar
          imageUrl={team.imageUrl}
          name={team.name}
          size={16}
          renderFallback={() => team.name.charAt(0).toUpperCase()}
        />
        <div className="grow min-w-0">
          <h3 className="text-lg font-semibold truncate">{team.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {team.managerName}
          </p>
        </div>
      </Link>

      <div className="flex flex-col gap-4 justify-between items-center md:items-end">
        <div className="flex gap-1 items-center">
          <TeamCreditsBadge credits={team.credits} />
        </div>
        {renderTeamPpr?.()}
        {showIsUserTeam && team.userId === teamUserId && (
          <Button variant="gradient" size="sm" className="mt-2">
            <Link
              href={`/leagues/${leagueId}/teams/${team.id}/edit`}
              className="text-xs"
            >
              Modifica
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
