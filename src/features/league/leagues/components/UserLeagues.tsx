import { getUserLeagues } from "@/features/dashboard/user/queries/user";
import { User } from "@supabase/supabase-js";
import { League } from "../queries/league";

type UserLeague = Pick<League, "id" | "name" | "imageUrl">;

type Props = {
  user?: User;
  children: (leagues: UserLeague[]) => React.ReactNode;
};

export default async function UserLeagues({ user, children }: Props) {
  if (!user) return null;

  const userLeagues = await getUserLeagues(user.id);

  return children(userLeagues);
}
