import { getUserTeamId } from "@/features/users/queries/user";
import { getUserId } from "@/features/users/utils/user";
import { redirect } from "next/navigation";
import TradesEmptyState from "./TradesEmptyState";

type Team = { name: string; managerName: string; imageUrl: string | null };

type Props = {
  leagueId: string;
  getTrades: (
    leagueId: string,
    userId: string
  ) => Promise<
    {
      id: string;
      status: "pending" | "accepted" | "rejected";
      createdAt: Date;
      updatedAt: Date;
      proposerTeamId: string;
      receiverTeamId: string;
      creditOfferedByProposer: number | null;
      creditRequestedByProposer: number | null;
      proposerTeam: Team;
      receiverTeam: Team;
      proposalPlayers: {
        playerId: string;
        offeredByProposer: boolean;
        player: { avatarUrl: string | null };
      }[];
    }[]
  >;
  emptyState?: {
    title?: string;
    description?: string;
  };
};

export default async function TradesList({
  leagueId,
  getTrades,
  emptyState,
}: Props) {
  const userId = await getUserId();
  if (!userId) return;

  const userTeamId = await getUserTeamId({ leagueId, userId });
  if (!userTeamId) redirect(`/leagues/${leagueId}/teams/create`);

  const trades = await getTrades(leagueId, userTeamId);

  if (!trades.length)
    return (
      <TradesEmptyState
        {...emptyState}
        leagueId={leagueId}
        userTeamId={userTeamId}
      />
    );
}
