import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { Plus } from "iconoir-react";
import { getSplits } from "@/features/dashboard/admin/splits/queries/split";
import SplitCard from "@/features/dashboard/admin/splits/components/SplitCard";

export default async function SplitsPage() {

  const splits = await getSplits()

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
      <div className="space-y-2">
        {splits.map((split) => (
          <SplitCard key={split.id} split={split} />
        ))}
      </div>
    </Container>
  );
}
