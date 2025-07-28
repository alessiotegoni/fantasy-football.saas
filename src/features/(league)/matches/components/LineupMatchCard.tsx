import { LineupPlayer } from "../queries/match";
import { calculateLineupTotalVote } from "../utils/LineupPlayers";
import { LineupTeam } from "../utils/match";
import MatchCard from "./MatchCard";

type Props = {
  id: string;
  isBye: boolean;
  leagueId: string;
  homeTeam: LineupTeam;
  awayTeam: LineupTeam;
  matchResults: {
    teamId: string;
    totalScore: string;
    goals: number;
  }[];
  players: LineupPlayer[];
};

export default function LineupMatchCard({
  leagueId,
  players,
  homeTeam,
  awayTeam,
  ...match
}: Props) {
  const homeModule = homeTeam.lineup?.tacticalModule ?? null;
  const awayModule = awayTeam.lineup?.tacticalModule ?? null;

  const teamTotalVotes = calculateLineupTotalVote(players, {
    homeTeam: { ...homeTeam, tacticalModule: homeModule },
    awayTeam: { ...awayTeam, tacticalModule: awayModule },
  });

  return (
    <MatchCard
      leagueId={leagueId}
      homeTeam={homeTeam}
      homeModule={homeModule?.name}
      awayTeam={awayTeam}
      awayModule={awayModule?.name}
      className="!rounded-4xl border-b border-border"
      isLink={false}
      {...match}
    />
  );
}
