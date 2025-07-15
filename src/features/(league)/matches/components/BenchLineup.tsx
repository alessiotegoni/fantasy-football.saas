import { LineupPlayer, LineupTeam } from "../queries/match";

type Props = {
  team: LineupTeam;
  canEditLineup: boolean;
  benchLineupsPromise: Promise<LineupPlayer[]>;
};

export default async function BenchLineup({
  team,
  canEditLineup,
  benchLineupsPromise,
}: Props) {
  const benchLineups = await benchLineupsPromise;
  const teamLineupPlayers = benchLineups.filter(
    (player) => player.leagueTeamId === team?.id
  );

  return (
    <div
      className="bg-input/30 rounded-3xl min-h-[500px]
              2xl:border-l border-border"
    ></div>
  );
}
