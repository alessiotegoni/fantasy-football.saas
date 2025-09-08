import { createClient } from "@/services/supabase/server/supabase";
import { getUser } from "@/features/dashboard/user/utils/user";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  isAdmin,
  isContentCreator,
  isRedaction,
  Role,
  roles,
} from "@/features/dashboard/user/utils/roles";
import DashboardRolesProvider from "@/contexts/DashboardRolesProvider";

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

  const isSuperadmin = process.env.SUPERADMIN_ID === user.id;
  if (isSuperadmin) userRoles = roles.slice();

  return (
    <DashboardRolesProvider user={user} userRoles={userRoles}>
      <SidebarProvider className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">{children}</main>
      </SidebarProvider>
    </DashboardRolesProvider>
  );
}
