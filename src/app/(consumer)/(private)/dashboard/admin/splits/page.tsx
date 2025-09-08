import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { getSplits } from "@/features/dashboard/admin/splits/queries/split";
import { Plus } from "iconoir-react";

export default async function SplitsPage() {
  const splits = await getSplits();

  return (
    <Container
      headerLabel="Splits"
      renderHeaderRight={() => (
        <LinkButton href="/dashboard/admin/splits/create" className="w-fit">
          <Plus className="size-5" />
          Crea split
        </LinkButton>
      )}
    >
        
    </Container>
  );
}
