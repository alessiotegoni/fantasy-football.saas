import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { Plus } from "iconoir-react";
import { Split } from "@/features/dashboard/admin/splits/queries/split";
import SplitCard from "@/features/dashboard/admin/splits/components/SplitCard";

export default async function SplitsPage() {
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

const splits: Split[] = [
  {
    id: 1,
    name: "Split 1",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "live",
  },
  {
    id: 2,
    name: "Split 2",
    startDate: "2026-01-01",
    endDate: "2026-02-28",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Split 3",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    status: "ended",
  },
];
