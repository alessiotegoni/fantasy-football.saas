import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { Plus } from "iconoir-react";
import { SplitCard } from "@/features/dashboard/admin/splits/components/SplitCard";
import { Split } from "@/features/dashboard/admin/splits/queries/split";

export default async function SplitsPage() {
  return (
    <Container
      headerLabel="Splits"
      renderHeaderRight={() => (
        <LinkButton href="/admin/splits/create" className="w-fit">
          <Plus className="size-5" />
          Crea split
        </LinkButton>
      )}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    name: "Split 1 - Regular Season",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: "live",
  },
  {
    id: 2,
    name: "Split 2 - Playoffs",
    startDate: "2026-01-01",
    endDate: "2026-02-28",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Split 3 - Pre-Season",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    status: "ended",
  },
];
