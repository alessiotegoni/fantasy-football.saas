import { getUserLeagues } from "@/features/dashboard/user/queries/user";
import { User } from "@supabase/supabase-js";
import { League } from "../queries/league";

type UserLeague = Pick<League, "id" | "name" | "imageUrl">;

export default async function UserLeagues({
  user,
  children,
}: {
  user?: User;
  children: (leagues: UserLeague[]) => React.ReactNode;
}) {
  if (!user) return null;

  const userLeagues = await getUserLeagues(user.id);

  return <>{children(userLeagues)}</>;
}