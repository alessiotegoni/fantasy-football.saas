import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser } from "@/features/dashboard/user/utils/user";
import { ArrowSeparateVertical } from "iconoir-react";
import UserLeagues from "./UserLeagues";
import UserLeagueDropdownItem from "./UserLeagueDropdownItem";

export default async function LeagueSwitcher({
  leagueId,
}: {
  leagueId: string;
}) {
  const user = await getUser();
  if (!user) return null;

  return (
    <UserLeagues>
      {(leagues) => {
        if (!leagues.length) return null;
        const currentLeague = leagues.find((league) => league.id === leagueId);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span className="truncate max-w-48">{currentLeague?.name}</span>
                <ArrowSeparateVertical className="!size-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[18rem]">
              <DropdownMenuLabel>Cambia lega</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {leagues.map((league) => (
                <UserLeagueDropdownItem league={league} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </UserLeagues>
  );
}
