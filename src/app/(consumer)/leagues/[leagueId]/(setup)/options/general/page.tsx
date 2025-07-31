import { GeneralSettingsForm } from "@/features/(league)/settings/components/forms/GeneralSettingsForm";
import { getGeneralOptions } from "@/features/(league)/settings/queries/setting";

export default async function LeagueGeneralOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const generalOptions = await getGeneralOptions(leagueId);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">Generali</h2>
      <GeneralSettingsForm leagueId={leagueId} initialData={generalOptions} />
    </div>
  );
}
