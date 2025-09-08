import {
  isAdmin,
  isContentCreator,
  isRedaction,
} from "@/features/users/utils/roles";
import DashboardRolesProvider, {
  Role,
} from "@/contexts/DashboardRolesProvider";
import { createClient } from "@/services/supabase/server/supabase";
import { getUser } from "@/features/users/utils/user";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
export default async function DashboardLayout({ children }: Props) {
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
    <DashboardRolesProvider roles={roles}>{children}</DashboardRolesProvider>
  );
}
