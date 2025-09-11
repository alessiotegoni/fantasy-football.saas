import { getBonusMalusTypes } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalusType";
import { BonusMalusSettingsForm } from "@/features/league/settings/components/forms/BonusMalusSettingsForm";
import { getBonusMalusesSettings } from "@/features/league/settings/queries/setting";


export default async function LeagueBonusMalusSettingsPage({
  params,
}: PageProps<"/league/[leagueId]/settings/bonus">) {
  const { leagueId } = await params;

  const [{ bonusMalusSettings: customBonusMalus }, bonusMalus] =
    await Promise.all([getBonusMalusesSettings(leagueId), getBonusMalusTypes()]);
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
