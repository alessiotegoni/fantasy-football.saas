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

  console.log(roles);

  return (
    <DashboardRolesProvider user={user} roles={roles}>
      {children}
    </DashboardRolesProvider>
  );
}
