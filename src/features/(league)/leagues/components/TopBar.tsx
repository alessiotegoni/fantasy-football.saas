import { SidebarTrigger } from "@/components/ui/sidebar";
import UserDropdown from "@/features/dashboard/user/components/userDropdown";
import { User } from "@supabase/supabase-js";

type Props = {
  league?: { name: string };
  user?: User;
};

export function Topbar({ league, user }: Props) {
  return (
    <header
      className="bg-gradient-to-r from-primary to-secondary w-full
    text-primary-foreground py-4 px-4 flex items-center justify-between z-20 fixed top-0 left-0
    lg:hidden"
    >
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {league && <h2 className="font-heading text-lg">{league.name}</h2>}
      </div>
      <UserDropdown variant="topbar" user={user} />
    </header>
  );
}
