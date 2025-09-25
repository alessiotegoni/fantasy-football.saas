import { ArrowSeparateVertical, NavArrowRight, ShareAndroid } from "iconoir-react";
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
import { InviteButton } from "./InviteButton";
import { League } from "../queries/league";
import { User } from "@supabase/supabase-js";
import UserLeagues from "./UserLeagues";

export default function LeagueDropdown({
  league,
  user,
}: {
  league: League;
  user?: User;
}) {
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
              <UserLeagues leagueId={league.id} user={user} />
            </Suspense>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Gestione leghe</DropdownMenuLabel>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/create-league">
                Crea una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="justify-between group">
              <Link href="/join-league">
                Entra in una lega
                <NavArrowRight className="group-hover:text-white" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <InviteButton className="rounded-lg p-2.5">
                <ShareAndroid className="text-white size-5" />
                Invita i tuoi amici!
              </InviteButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
