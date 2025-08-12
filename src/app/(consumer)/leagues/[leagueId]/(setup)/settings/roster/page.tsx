import { PRESIDENT_ROLE_ID } from "@/drizzle/schema";
import { RosterSettingsForm } from "@/features/(league)/settings/components/forms/RosterSettingsForm";
import {
  getRosterSettings,
  getTacticalModules,
} from "@/features/(league)/settings/queries/setting";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";

export default async function LeagueRosterSettingsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  const [rosterSettings, tacticalModules, playersRoles] = await Promise.all([
    getRosterSettings(leagueId),
    getTacticalModules(),
    getRolesWithoutPresident(),
  ]);

  return (
    <div className="max-w-[700px] mx-auto">
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Rose e moduli
      </h2>
      <RosterSettingsForm
        leagueId={leagueId}
        initialData={rosterSettings}
        tacticalModules={tacticalModules}
        playersRoles={playersRoles}
      />
    </div>
  );
}

async function getRolesWithoutPresident() {
  return getPlayersRoles().then((roles) =>
    roles.filter((role) => role.id !== PRESIDENT_ROLE_ID)
  );
}
