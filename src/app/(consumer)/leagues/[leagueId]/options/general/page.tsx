import { db } from "@/drizzle/db";
import { GeneralOptionsForm } from "@/features/leagues/components/forms/GeneralOptionsForm";
import {
  getLeagueGeneralOptionsTag,
  getLeagueOptionsTag,
} from "@/features/leagues/db/cache/league";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function LeagueGeneralOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const generalOptions = await getGeneralOptions(leagueId);

  return <GeneralOptionsForm initialData={generalOptions} />;
}

async function getGeneralOptions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueOptionsTag(leagueId), getLeagueGeneralOptionsTag(leagueId));

  return db.query.leagueOptions.findFirst({
    columns: {
      initialCredits: true,
      maxMembers: true,
      isTradingMarketOpen: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });
}
