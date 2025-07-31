import { BonusMalusOptionsForm } from "@/features/(league)/settings/components/forms/BonusMalusSettingsForm";
import { getBonusMalusesOptions } from "@/features/(league)/settings/queries/setting";
import { getBonusMaluses } from "@/features/bonusMaluses/queries/bonusMalus";

export default async function LeagueBonusMalusOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const [{ bonusMalusOptions: customBonusMalus }, bonusMalus] =
    await Promise.all([getBonusMalusesOptions(leagueId), getBonusMaluses()]);
  if (!customBonusMalus) return;

  return (
    <>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Bonus e malus
      </h2>
      <BonusMalusOptionsForm
        leagueId={leagueId}
        initialData={{ customBonusMalus }}
        bonusMaluses={bonusMalus}
      />
    </>
  );
}
