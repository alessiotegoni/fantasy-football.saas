import { getUserId } from "@/features/users/utils/user";
import PlayerSelectionButton from "./PlayerSelectionButton";
import { isLeagueAdmin } from "../../members/permissions/leagueMember";

export default async function PlayerSelection({
  leagueId,
}: {
  leagueId: string;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const isAdmin = await isLeagueAdmin(userId, leagueId);
  if (!isAdmin) return null;

  return <PlayerSelectionButton />;
}
