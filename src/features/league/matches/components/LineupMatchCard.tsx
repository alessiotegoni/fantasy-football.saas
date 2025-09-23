import { LineupPlayer } from "../queries/match";
import { calculateLineupsTotalVote } from "../utils/lineup";
import { LineupTeam } from "../utils/match";
import MatchCard from "./MatchCard";
import LiveMatchScore from "./LiveMatchScore";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";

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
  splitMatchday: SplitMatchday;
  currentMatchday?: SplitMatchday;
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

  const teamTotalVotes = calculateLineupsTotalVote(players, {
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
      matchScore={<LiveMatchScore totalVotes={teamTotalVotes} {...match} />}
      {...match}
    />
  );
}
