import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { Plus } from "iconoir-react";
import { getTeams } from "@/features/dashboard/admin/teams/queries/team";
import TeamCard from "@/features/dashboard/admin/teams/components/TeamCard";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <Container
      headerLabel="Teams"
      renderHeaderRight={() => (
        <LinkButton href="/dashboard/admin/teams/create" className="w-fit">
          <Plus className="size-5" />
          Crea team
        </LinkButton>
      )}
    >
      <div className="space-y-2">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </Container>
  );
}
