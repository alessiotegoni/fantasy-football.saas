import { ArrowSeparateVertical, NavArrowRight, Trophy } from "iconoir-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Suspense } from "react";
import { getUserId } from "@/features/users/utils/user";
import { getUserLeagues } from "@/features/users/queries/user";
import { cn } from "@/lib/utils";
import { InviteButton } from "./InviteButton";

type Props = {
  leagueId: string;
  name: string;
  joinCode: string;
  password: string | null;
};

export default function LeagueDropdown(league: Props) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="min-w-52 bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4
              rounded-none rounded-br-xl rounded-bl-xl hover:text-white flex justify-between items-center"
          >
            <SidebarMenuButton>
              <h2 className="font-heading text-lg">{league.name}</h2>
              <ArrowSeparateVertical className="!size-5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[18rem] rounded-xl border border-primary/20">
            <DropdownMenuLabel>Le mie leghe</DropdownMenuLabel>
            <Suspense>
              <UserLeagues leagueId={league.leagueId} />
            </Suspense>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Gestione leghe</DropdownMenuLabel>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/leagues/create">
                Crea una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/leagues/join">
                Entra in una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <InviteButton {...league} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

async function UserLeagues({ leagueId }: Pick<Props, "leagueId">) {
  const userId = await getUserId();
  if (!userId) return;
  const userLeagues = await getUserLeagues(userId);

  const isCurrentLeague = (league: (typeof userLeagues)[number]) =>
    leagueId === league.id;

  return userLeagues.map((league) => (
    <DropdownMenuItem
      key={league.id}
      className="flex justify-between items-center gap-2 group"
      asChild
    >
      <Link key={league.id} href={`/leagues/${league.id}`}>
        <div className="flex items-center gap-2">
          {league.imageUrl ? (
            <img
              src={league.imageUrl}
              alt={league.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
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
          <p>{league.name}</p>
        </div>
        {!isCurrentLeague(league) && (
          <NavArrowRight className="text-muted-foreground group-hover:text-white" />
        )}
      </Link>
    </DropdownMenuItem>
  ));
}
