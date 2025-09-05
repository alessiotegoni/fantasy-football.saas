import { isLeagueAdmin } from "@/features/(league)/leagues/queries/league";
import { getUserId } from "@/features/users/utils/user";
import PlayerSelectionButton from "./PlayerSelectionButton";

export default async function PlayerSelection({
  leagueId,
}: {
  leagueId: string;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const isLeagueAdmin = await isLeagueAdmin(userId, leagueId);
  if (!isLeagueAdmin) return null;

  return <PlayerSelectionButton />;
}
