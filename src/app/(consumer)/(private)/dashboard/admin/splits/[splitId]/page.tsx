import Container from "@/components/Container";
import LinkButton from "@/components/LinkButton";
import { Plus } from "iconoir-react";
import { SplitMatchdayCard } from "@/features/dashboard/admin/splits/components/SplitMatchdayCard";
import { notFound } from "next/navigation";
import SplitForm from "@/features/dashboard/admin/splits/components/SplitForm";
import {
  getSplit,
  getSplitMatchdays,
} from "@/features/dashboard/admin/splits/queries/split";

export default async function SplitDetailPage({
  params,
}: PageProps<"/dashboard/admin/splits/[splitId]">) {
  const p = await params;

  const splitId = parseInt(p.splitId);

  const [split, splitMatchdays] = await Promise.all([
    getSplit(splitId),
    getSplitMatchdays(splitId),
  ]);
  if (!split) notFound();

  return (
    <Container
      headerLabel={split.name}
      renderHeaderRight={() => (
        <LinkButton
          href={`/admin/splits/${split.id}/matchdays/create`}
          className="w-fit"
        >
          <Plus className="size-5" />
          Crea giornate
        </LinkButton>
      )}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifica</h2>
          {/* <SplitStatus
            status={split.status}
            onStatusChange={() =>
              new Promise((resolve) =>
                resolve({ error: false, message: "Status updated" })
              )
            }
            canUpdate
          /> */}
        </div>
        <SplitForm split={split} />
      </div>

      <h2 className="text-xl font-semibold mb-4">Giornate</h2>
      <div className="space-y-2">
        {splitMatchdays.map((matchday) => (
          <SplitMatchdayCard key={matchday.id} matchday={matchday} />
        ))}
      </div>
    </Container>
  );
}

{
  /* <SplitStatus
        status={split.status}
        onStatusChange={() =>
          new Promise((resolve) => resolve({ error: false, message: "dwd" }))
        }
        canUpdate
      /> */
}
