import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
    <UserLeagues user={user}>
      {(leagues) => {
        const othersLeague = leagues.filter((league) => league.id !== leagueId);
        if (!othersLeague.length) return null;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-fit min-w-40 flex items-center gap-2"
              >
                <span className="truncate max-w-48">Cambia lega</span>
                <ArrowSeparateVertical className="!size-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[18rem]">
              <DropdownMenuLabel>Cambia lega</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {othersLeague.map((league) => (
                <UserLeagueDropdownItem key={league.id} league={league} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </UserLeagues>
  );
}
