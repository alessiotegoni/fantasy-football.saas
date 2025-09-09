import Container from "@/components/Container";
import { SplitMatchdayCard } from "@/features/dashboard/admin/splits/components/SplitMatchdayCard";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getSplitIdTag,
  getSplitMatchdaysIdTag,
} from "@/features/dashboard/admin/splits/db/cache/split";
import { db } from "@/drizzle/db";
import { notFound } from "next/navigation";
import SplitDetailRight from "@/features/dashboard/admin/splits/components/SplitDetailRight";

export default async function SplitDetailPage({
  params,
}: PageProps<"/dashboard/admin/splits/[splitId]">) {
  const { splitId } = await params;

  const split = await getSplitWithMatchdays(parseInt(splitId));
  if (!split) notFound();

  return (
    <Container
      headerLabel={split.name}
      renderHeaderRight={() => <SplitDetailRight split={split} />}
    >
      <h2 className="text-xl font-semibold mb-4">Giornate</h2>
      <div className="space-y-2">
        {split.matchdays.map((matchday) => (
          <SplitMatchdayCard key={matchday.id} matchday={matchday} />
        ))}
      </div>
    </Container>
  );
}

async function getSplitWithMatchdays(splitId: number) {
  "use cache";
  cacheTag(getSplitIdTag(splitId));

  const result = await db.query.splits.findFirst({
    with: {
      matchdays: true,
    },
    where: (split, { eq }) => eq(split.id, splitId),
  });

  if (result) {
    cacheTag(
      ...result.matchdays.map((matchday) => getSplitMatchdaysIdTag(matchday.id))
    );
  }

  return result
    ? {
        ...result,
        matchdays: result.matchdays.sort((a, b) => a.number - b.number),
      }
    : undefined;
}
