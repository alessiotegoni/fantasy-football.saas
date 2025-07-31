import { MarketSettingsForm } from "@/features/(league)/settings/components/forms/MarketSettingsForm";
import { getMarketOptions } from "@/features/(league)/settings/queries/setting";

export default async function LeagueMarketOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const marketOptions = await getMarketOptions(leagueId);
  if (!marketOptions) return;

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">Mercato</h2>
      <MarketSettingsForm leagueId={leagueId} initialData={marketOptions} />
    </div>
  );
}
