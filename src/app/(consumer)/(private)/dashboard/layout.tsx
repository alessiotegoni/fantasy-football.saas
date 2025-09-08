import {
  isAdmin,
  isContentCreator,
  isRedaction,
} from "@/features/dashboard/user/utils/roles";
import DashboardRolesProvider, {
  Role,
} from "@/contexts/DashboardRolesProvider";
import { createClient } from "@/services/supabase/server/supabase";
import { getUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const roles: Role[] = [];

  const [admin, contentCreator, redaction] = await Promise.all([
    isAdmin(supabase, user.id),
    isContentCreator(supabase, user.id),
    isRedaction(supabase, user.id),
  ]);

  if (admin) roles.push("admin");
  if (contentCreator) roles.push("content-creator");
  if (redaction) roles.push("redaction");

  return (
    <DashboardRolesProvider user={user} roles={roles}>
      <SidebarProvider className="flex">
        <DashboardSidebar currentUserId={user.id} />
        <main className="flex-1 p-8">{children}</main>
      </SidebarProvider>
    </DashboardRolesProvider>
  );
}
