import Avatar from "@/components/Avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getUserLeagues } from "@/features/dashboard/user/queries/user";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { NavArrowRight, Trophy } from "iconoir-react";
import Link from "next/link";
import { League } from "../queries/league";

export default async function UserLeagues({
  leagueId,
  user,
}: {
  leagueId: string;
  user?: User;
}) {
  if (!user) return null;

  const userLeagues = await getUserLeagues(user.id);

  const isCurrentLeague = (league: Pick<League, "id">) =>
    leagueId === league.id;

  return userLeagues.map((league) => {
    const content = (
      <div className="flex items-center gap-2">
        <Avatar
          imageUrl={league.imageUrl}
          name={league.name}
          className="size-12"
          renderFallback={() => (
            <div
              className={cn(
                "flex justify-center items-center rounded-full size-10",
                isCurrentLeague(league) && "bg-primary group-hover:bg-secondary"
              )}
            >
              <Trophy
                className={cn(
                  "size-6 text-white",
                  isCurrentLeague(league) && "group-hover:text-white"
                )}
              />
            </div>
          )}
        />
        <p className={cn(isCurrentLeague(league) && "font-semibold")}>
          {league.name}
        </p>
      </div>
    );
    {
      !isCurrentLeague(league) && (
        <NavArrowRight className="text-muted-foreground group-hover:text-white" />
      );
    }

    return (
      <DropdownMenuItem
        key={league.id}
        className="flex justify-between items-center gap-2 group"
        asChild
      >
        {isCurrentLeague(league) ? (
          <div>{content}</div>
        ) : (
          <Link key={league.id} href={`/leagues/${league.id}`}>
            {content}
          </Link>
        )}
      </DropdownMenuItem>
    );
  });
}
