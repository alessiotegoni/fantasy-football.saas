import {
  Split,
  SplitMatchday,
} from "@/features/dashboard/admin/splits/queries/split";
import { Match } from "../../admin/calendar/regular/queries/calendar";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  calendar?: Match[];
  firstUpcomingMatchday?: SplitMatchday;
  upcomingMatches?: Match[];
  liveMatchday?: SplitMatchday;
  liveMatches?: Match[];
  lastEndedMatchday?: SplitMatchday;
  endedMatches?: Match[];
  lastSplit?: Split;
  userId?: string;
};

export default function LeagueWidget({
  leagueTeams,
  userId,
  upcomingMatches,
  liveMatches,
  endedMatches,
}: Props) {
  const userTeam = leagueTeams.find((team) => team.userId === userId);

  const userUpcomingMatch = upcomingMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userLiveMatch = liveMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );
  const userEndedMatch = endedMatches?.find((match) =>
    [match.homeTeam, match.awayTeam].find((team) => team.id === userTeam?.id)
  );

  return (
    <div className="p-6 bg-input/30 w-full h-80 rounded-3xl flex justify-center items-center">dw</div>
  );
}

// TODO: Creare un componente LeagueMatchCard che dovra integrare il componente MatchCard
// e al di sotto mostrare il componente LinkButton che manda sempre a /league/[leagueId]/matches/[matchId]
// ed a seconda del contesto cambia colore e testo
// TODO: se userUpcomingMatch c'e e userLiveMatch non c'e mostrare LeagueMatchCard
// con il LinkButton che deve essere blue con testo Inserisci formazione
// TODO: se userLiveMatch c'e mostarre LeagueMatchCard con il LinkButton che deve essere verde
// con il testo Vedi match
// TODO: se userEndedMatch c'e e userLiveMatch non c'e mostrare LeagueMatchCard.
// Se matchResult e' un array vuoto e isBye e' false il LinkButton deve essere verde scuro
// con il testo Vedi finale, se invece MatchResult non e' vuoto e isBye e' false se lo userTeam ha perso
//  mostrare qualcosa di customizzato che lo dimostri, se ha vinto uguale

// TODO: e' possibile che userUpcomingMatch e userEndedMatch vengano mostrati insieme
// in quel caso quest'ultimo deve essere mostrato a sinistra mentre l'altro a destra
