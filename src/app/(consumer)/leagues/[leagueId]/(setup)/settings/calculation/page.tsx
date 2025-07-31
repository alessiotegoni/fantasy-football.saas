import { GeneralSettingsForm } from "@/features/(league)/settings/components/forms/GeneralSettingsForm";
import { getCalculationSettings } from "@/features/(league)/settings/queries/setting";

export default async function LeagueCalculationSettingsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const generalSettings = await getCalculationSettings(leagueId);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">Calcolo giornate</h2>
      <GeneralSettingsForm leagueId={leagueId} initialData={generalSettings} />
    </div>
  );
}
