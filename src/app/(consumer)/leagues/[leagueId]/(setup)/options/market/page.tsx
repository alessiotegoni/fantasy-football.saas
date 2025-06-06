import { db } from "@/drizzle/db";
import { MarketOptionsForm } from "@/features/(league)/leagueOptions/components/forms/MarketOptionsForm";
import {
  getLeagueMarketOptionsTag,
  getLeagueOptionsTag,
} from "@/features/(league)/leagueOptions/db/cache/leagueOption";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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
      <MarketOptionsForm leagueId={leagueId} initialData={marketOptions} />
    </div>
  );
}

async function getMarketOptions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueOptionsTag(leagueId), getLeagueMarketOptionsTag(leagueId));

  const marketOptions = await db.query.leagueOptions.findFirst({
    columns: {
      isTradingMarketOpen: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return marketOptions;
}
