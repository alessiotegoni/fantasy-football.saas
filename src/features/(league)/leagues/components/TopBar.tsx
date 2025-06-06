import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/features/users/components/userDropdown";
import { getUser } from "@/features/users/utils/user";
import { Suspense } from "react";
import LeagueName from "./LeagueName";

export function Topbar({
  leagueNamePromise,
}: {
  leagueNamePromise: Promise<string>;
}) {
  return (
    <header
      className="bg-gradient-to-r from-primary to-secondary w-full
    text-primary-foreground py-4 px-4 flex items-center justify-between z-20 fixed top-0 left-0
    lg:hidden"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Suspense>
          <LeagueName leagueNamePromise={leagueNamePromise} />
        </Suspense>
      </div>
      <Suspense>
        <UserDropdown variant="topbar" userPromise={getUser()} />
      </Suspense>
    </header>
  );
}
