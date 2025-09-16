import AssignVotePageContent from "@/features/dashboard/redaction/components/AssignVotePageContent";
import { getPlayers } from "@/features/dashboard/admin/players/queries/player";
import { getSplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { redirect } from "next/navigation";

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

  return <AssignVotePageContent matchday={matchday} players={players} />;
}
