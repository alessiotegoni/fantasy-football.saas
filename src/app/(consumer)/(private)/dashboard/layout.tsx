import { createClient } from "@/services/supabase/server/supabase";
import { getUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  isAdmin,
  isContentCreator,
  isRedaction,
  isSuperadmin,
  Role,
  roles,
} from "@/features/dashboard/user/utils/roles";
import DashboardRolesProvider from "@/contexts/DashboardRolesProvider";
import { Topbar } from "@/features/league/leagues/components/TopBar";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  if (!user) redirect("/");

  let userRoles: Role[] = [];

  const supabase = await createClient();

  const [admin, contentCreator, redaction] = await Promise.all([
    isAdmin(supabase, user.id),
    isContentCreator(supabase, user.id),
    isRedaction(supabase, user.id),
  ]);

  if (admin) userRoles.push("admin");
  if (contentCreator) userRoles.push("content-creator");
  if (redaction) userRoles.push("redaction");

  if (isSuperadmin(user.id)) userRoles = roles.slice();

  return (
    <DashboardRolesProvider user={user} userRoles={userRoles}>
      <SidebarProvider className="flex">
        <DashboardSidebar />
        <Topbar user={user} />
        <main className="w-full pt-[calc(60px+20px)] pb-[calc(73px+20px)] p-3 lg:pt-2">
          {children}
        </main>
      </SidebarProvider>
    </DashboardRolesProvider>
  );
}
