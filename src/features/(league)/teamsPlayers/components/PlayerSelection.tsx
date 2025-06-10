import { getLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import PlayerSelectionButton from "./PlayerSelectionButton";

export default async function PlayerSelection({
  leagueId,
}: {
  leagueId: string;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const isLeagueAdmin = await getLeagueAdmin(userId, leagueId);
  if (!isLeagueAdmin) return null;

  return <PlayerSelectionButton />;
}
