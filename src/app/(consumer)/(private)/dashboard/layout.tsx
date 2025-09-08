import { createClient } from "@/services/supabase/server/supabase";
import { getUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  isAdmin,
  isContentCreator,
  isRedaction,
} from "@/features/dashboard/user/utils/roles";
import DashboardRolesProvider, {
  Role,
} from "@/contexts/DashboardRolesProvider";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  if (!user) redirect("/");

  const supabase = await createClient();
  const userRoles: Role[] = [];

  const [admin, contentCreator, redaction] = await Promise.all([
    isAdmin(supabase, user.id),
    isContentCreator(supabase, user.id),
    isRedaction(supabase, user.id),
  ]);

  const isSuperadmin = process.env.SUPERADMIN_ID === user.id;

  if (isSuperadmin) userRoles.push("superadmin");
  if (admin) userRoles.push("admin");
  if (contentCreator) userRoles.push("content-creator");
  if (redaction) userRoles.push("redaction");

  return (
    <DashboardRolesProvider user={user} userRoles={userRoles}>
      <SidebarProvider className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">{children}</main>
      </SidebarProvider>
    </DashboardRolesProvider>
  );
}
