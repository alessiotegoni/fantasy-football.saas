import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import SplitSelect from "@/features/splits/components/SplitSelect";
import { getSplits } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";

export default async function LeagueStandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ splitId?: number }>;
}) {
  const [splits, { leagueId }, { splitId }] = await Promise.all([
    getSplits(),
    params,
    searchParams,
  ]);

  let selectedSplit = splits.at(-1);

  if (splitId && validateSerialId(splitId).success) {
    selectedSplit = splits.find((split) => split.id === splitId);
  }

  return (
   
  );
}
