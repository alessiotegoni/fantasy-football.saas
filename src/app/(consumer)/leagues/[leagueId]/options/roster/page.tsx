import { db } from "@/drizzle/db";
import { RosterOptionsForm } from "@/features/leagueOptions/components/forms/RosterOptionForm";
import {
  getLeagueOptionsTag,
  getLeagueRosterOptionsTag,
} from "@/features/leagueOptions/db/cache/option";
import {
  getPlayersRoles,
  getTacticalModules,
} from "@/features/leagueOptions/queries/leagueOptions";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function LeagueRosterOptionsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const rosterOptions = await getRosterOptions(leagueId);
  if (!rosterOptions) return;

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Rose e moduli
      </h2>
      <RosterOptionsForm
        leagueId={leagueId}
        initialData={rosterOptions}
        tacticalModulesPromise={getTacticalModules()}
        playersRolesPromise={getPlayersRoles()}
      />
    </div>
  );
}

async function getRosterOptions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueOptionsTag(leagueId), getLeagueRosterOptionsTag(leagueId));

  const rosterOptions = await db.query.leagueOptions.findFirst({
    columns: {
      tacticalModules: true,
      playersPerRole: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return rosterOptions;
}
