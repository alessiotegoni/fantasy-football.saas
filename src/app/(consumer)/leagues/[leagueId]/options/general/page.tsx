import { db } from "@/drizzle/db";
import { GeneralOptionsForm } from "@/features/leagueOptions/components/forms/GeneralOptionsForm";
import {
  getLeagueGeneralOptionsTag,
  getLeagueOptionsTag,
} from "@/features/leagueOptions/db/cache/leagueOption";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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
      <GeneralOptionsForm leagueId={leagueId} initialData={generalOptions} />
    </div>
  );
}

async function getGeneralOptions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueOptionsTag(leagueId), getLeagueGeneralOptionsTag(leagueId));

  const generalOptions = await db.query.leagues.findFirst({
    columns: {
      visibility: true,
      password: true,
      description: true,
    },
    with: {
      options: {
        columns: {
          initialCredits: true,
          maxMembers: true,
          isTradingMarketOpen: true,
        },
      },
    },
    where: (league, { eq }) => eq(league.id, leagueId),
  });

  if (!generalOptions) return;

  const { options, ...restOptions } = generalOptions;

  return { ...options[0], ...restOptions };
}
