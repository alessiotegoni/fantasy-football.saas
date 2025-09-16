import AssignVotePageContent from "@/features/dashboard/redaction/components/AssignVotePageContent";
import {
  getPlayers,
  Player,
} from "@/features/dashboard/admin/players/queries/player";
import {
  getSplitMatchday,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserId } from "@/features/dashboard/user/utils/user";
import { getUserRedaction } from "@/features/dashboard/user/queries/user";

export default async function AssignVotesPage({
  searchParams,
}: PageProps<"/dashboard/redaction/votes/assign">) {
  const q = await searchParams;
  const matchdayId = parseInt(q.matchdayId as string);

  if (!matchdayId || !validateSerialId(matchdayId).success) {
    redirect("/dashboard/redaction/votes");
  }

  const [matchday, players] = await Promise.all([
    getSplitMatchday(matchdayId),
    getPlayers(),
  ]);

  return (
    <Suspense
      fallback={<AssignVotePageContent matchday={matchday} players={players} />}
    >
      <SuspenseBoundary matchday={matchday} players={players} />
    </Suspense>
  );
}

async function SuspenseBoundary(props: {
  matchday: SplitMatchday;
  players: Player[];
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const userRedaction = await getUserRedaction(userId);

  return <AssignVotePageContent {...props} userRedaction={userRedaction} />;
}
