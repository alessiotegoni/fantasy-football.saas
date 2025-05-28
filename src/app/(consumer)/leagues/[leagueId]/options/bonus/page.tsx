import { db } from "@/drizzle/db";
import { BonusMalusOptionsForm } from "@/features/leagueOptions/components/forms/BonusMalusOptionsForm";
import {
  getLeagueBonusMalusOptionsTag,
  getLeagueOptionsTag,
} from "@/features/leagueOptions/db/cache/option";
import { getBonusMaluses } from "@/features/leagueOptions/queries/leagueOptions";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function LeagueBonusMalusOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const [bonusMalusOptions, bonusMalus] = await Promise.all([
    getBonusMalusesOptions(leagueId),
    getBonusMaluses(),
  ]);
  if (!bonusMalusOptions) return;

  return (
    <>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Bonus e malus
      </h2>
      <BonusMalusOptionsForm
        leagueId={leagueId}
        initialData={bonusMalusOptions}
        bonusMaluses={bonusMalus}
      />
    </>
  );
}

async function getBonusMalusesOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueOptionsTag(leagueId),
    getLeagueBonusMalusOptionsTag(leagueId)
  );

  const bonusMalusOptions = await db.query.leagueOptions.findFirst({
    columns: {
      customBonusMalus: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return bonusMalusOptions;
}
