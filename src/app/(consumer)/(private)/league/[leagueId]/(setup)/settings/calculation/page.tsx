import { CalculationSettingsForm } from "@/features/(league)/settings/components/forms/CalculationSettingsForm";
import { getCalculationSettings } from "@/features/(league)/settings/queries/setting";

export default async function LeagueCalculationSettingsPage({
  params,
}: PageProps<"/league/[leagueId]/settings/calculation">) {
  const { leagueId } = await params;
  const calculationSettings = await getCalculationSettings(leagueId);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Calcolo giornate
      </h2>
      <CalculationSettingsForm
        leagueId={leagueId}
        initialData={calculationSettings}
      />
    </div>
  );
}
