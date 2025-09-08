import { GeneralSettingsForm } from "@/features/league/settings/components/forms/GeneralSettingsForm";
import { getGeneralSettings } from "@/features/league/settings/queries/setting";

export default async function LeagueGeneralSettingsPage({
  params,
}: PageProps<"/league/[leagueId]/settings/general">) {
  const { leagueId } = await params;
  const generalSettings = await getGeneralSettings(leagueId);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">Generali</h2>
      <GeneralSettingsForm leagueId={leagueId} initialData={generalSettings} />
    </div>
  );
}
