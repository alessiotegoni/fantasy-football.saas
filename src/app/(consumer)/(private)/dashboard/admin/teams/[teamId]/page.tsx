import Container from "@/components/Container";
import { notFound } from "next/navigation";
import { getTeam } from "@/features/dashboard/admin/teams/queries/team";
import TeamForm from "@/features/dashboard/admin/teams/components/TeamForm";

export default async function TeamEditPage({ params }: PageProps<"/league/[leagueId]/teams/[teamId]/edit">) {
  const p = await params

  const team = await getTeam(parseInt(p.teamId));
  if (!team) notFound();

  return (
    <Container headerLabel={`Modifica team ${team.name}`}>
      <TeamForm team={team} />
    </Container>
  );
}
