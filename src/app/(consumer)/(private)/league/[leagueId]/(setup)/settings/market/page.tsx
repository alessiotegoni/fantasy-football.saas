import { MarketSettingsForm } from "@/features/(league)/settings/components/forms/MarketSettingsForm";
import { getMarketSettings } from "@/features/(league)/settings/queries/setting";

export default async function LeagueMarketSettingsPage({
  params,
}: PageProps<"/leagues/[leagueId]/settings/market">) {
  const { leagueId } = await params;

  const marketSettings = await getMarketSettings(leagueId);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">Mercato</h2>
      <MarketSettingsForm leagueId={leagueId} initialData={marketSettings} />
    </div>
  );
}
