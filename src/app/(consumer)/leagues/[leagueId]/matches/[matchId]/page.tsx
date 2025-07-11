import { validateUUIds } from "@/schema/helpers";
import { notFound } from "next/navigation";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ leagueId: string; matchId: string }>;
}) {
    const { success, leagueId, matchId } = validateUUIds(await params)
    if (!success) notFound()




  return <div>MatchPage</div>;
}
