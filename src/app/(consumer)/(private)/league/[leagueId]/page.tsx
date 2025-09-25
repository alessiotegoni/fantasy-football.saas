import { getSplits } from "@/features/dashboard/admin/splits/queries/split";
import { InviteMembersBanner } from "@/features/league/members/components/InviteMembersBanner";
import OverviewContainer from "@/features/league/overview/components/OverviewContainer";
import { getLeagueTeams } from "@/features/league/teams/queries/leagueTeam";

export default async function LeagueOverviewPage({
  params,
}: PageProps<"/league/[leagueId]">) {
  const { leagueId } = await params;

  const [splits, leagueTeams] = await Promise.all([
    getSplits(),
    getLeagueTeams(leagueId),
  ]);

  const lastSplit = splits.at(-1);

  return (
    <OverviewContainer>
      {leagueTeams.length <= 4 && <InviteMembersBanner />}
    </OverviewContainer>
  );
}

// TODO: Banner invita utenti: se split e' upcoming e i partecipanti della lega sono meno di 4
// TODO: Banner genera calendario: se lo split e' upcoming e non e' ancora stato generato
// TODO: Banner calcola giornata: se l'ultima giornata non e' ancora stata calcolata
// TODO: Banner crea giornata: se l'ultima giornata non e' ancora stata calcolata

// TODO: Banner match della giornata corrente: se c'e un match (e quindi una giornata) in corso
// TODO: Banner match della giornata vinta: se c'e un match vinto e la giornata e' terminata
// TODO: Banner match della giornata persa: se c'e un match perso e la giornata e' terminata
// TODO: Banner match della giornata in arrivo: se c'e un match successivo e la giornata non e' live

// TODO: Classifica riassuntiva
