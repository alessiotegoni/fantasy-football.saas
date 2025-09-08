import { RosterSettingsForm } from "@/features/(league)/settings/components/forms/RosterSettingsForm";
import { getRosterSettings } from "@/features/(league)/settings/queries/setting";
import { getRolesWithoutPresident } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import { getTacticalModules } from "@/features/dashboard/admin/tacticalModules/queries/tacticalModule";

export default async function LeagueRosterSettingsPage({
  params,
}: PageProps<"/league/[leagueId]/settings/roster">) {
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
