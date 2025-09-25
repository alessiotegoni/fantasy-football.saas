import Avatar from "@/components/Avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { NavArrowRight, Trophy } from "iconoir-react";
import Link from "next/link";
import UserLeagues from "./UserLeagues";

export default function UserLeaguesDropdown({
  leagueId,
  user,
}: {
  leagueId: string;
  user?: User;
}) {
  const isCurrentLeague = (league: { id: string }) => leagueId === league.id;

  return (
    <UserLeagues user={user}>
      {(leagues) =>
        leagues.map((league) => {
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
                      isCurrentLeague(league) &&
                        "bg-primary group-hover:bg-secondary"
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

          return (
            <DropdownMenuItem
              key={league.id}
              className="flex justify-between items-center gap-2 group"
              asChild
              disabled={isCurrentLeague(league)}
            >
              {isCurrentLeague(league) ? (
                <div>{content}</div>
              ) : (
                <Link
                  key={league.id}
                  href={`/league/${league.id}`}
                  className="flex w-full justify-between"
                >
                  {content}
                  <NavArrowRight className="text-muted-foreground group-hover:text-white" />
                </Link>
              )}
            </DropdownMenuItem>
          );
        })
      }
    </UserLeagues>
  );
}
