import { BonusMalusOptionsForm } from "@/features/(league)/options/components/forms/BonusMalusOptionsForm";
import {
  getBonusMaluses,
  getBonusMalusesOptions,
} from "@/features/(league)/options/queries/leagueOptions";

export default async function LeagueBonusMalusOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const [bonusMalusOptions, bonusMalus] = await Promise.all([
    getBonusMalusesOptions(leagueId),
    getBonusMaluses(),
  ]);
  if (!bonusMalusOptions) return;

  return (
    <>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Bonus e malus
      </h2>
      <BonusMalusOptionsForm
        leagueId={leagueId}
        initialData={bonusMalusOptions}
        bonusMaluses={bonusMalus}
      />
    </>
  );
}
