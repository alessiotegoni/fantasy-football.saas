import Container from "@/components/Container";
import TeamForm from "@/features/dashboard/admin/teams/components/TeamForm";

export default function CreateTeamPage() {
  return (
    <Container headerLabel="Crea team">
      <TeamForm />
    </Container>
  );
}
