import { BonusMalusSettingsForm } from "@/features/(league)/settings/components/forms/BonusMalusSettingsForm";
import { getBonusMalusesSettings } from "@/features/(league)/settings/queries/setting";
import { getBonusMaluses } from "@/features/bonusMaluses/queries/bonusMalus";

export default async function LeagueBonusMalusSettingsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const [{ bonusMalusSettings: customBonusMalus }, bonusMalus] =
    await Promise.all([getBonusMalusesSettings(leagueId), getBonusMaluses()]);
  if (!customBonusMalus) return;

  return (
    <>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Bonus e malus
      </h2>
      <BonusMalusSettingsForm
        leagueId={leagueId}
        initialData={{ customBonusMalus }}
        bonusMaluses={bonusMalus}
      />
    </>
  );
}
