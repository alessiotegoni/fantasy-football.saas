import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import SplitSelect from "@/features/splits/components/SplitSelect";
import { getSplits, Split } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { Suspense } from "react";

export default async function LeagueStandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ splitId?: string }>;
}) {
  const [splits, { leagueId }] = await Promise.all([getSplits(), params]);

  const lastSplit = splits.at(-1);

  return (
    <Container
      leagueId={leagueId}
      headerLabel="Classifica"
      className="max-w-[700px]"
      renderHeaderRight={() => (
        <SplitSelect splits={splits} defaultSplit={lastSplit} />
      )}
    >
      <Suspense>
        <SuspenseBoundary
          leagueId={leagueId}
          selectedSplitPromise={searchParams.then((sp) => sp.splitId)}
          splits={splits}
          lastSplit={lastSplit}
        />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  leagueId,
  selectedSplitPromise,
  splits,
  lastSplit,
}: {
  leagueId: string;
  selectedSplitPromise: Promise<string | undefined>;
  splits: Split[];
  lastSplit?: Split;
}) {
  let selectedSplit = lastSplit;

  const selectedSplitId = parseInt((await selectedSplitPromise) ?? "0");

  if (selectedSplitId && validateSerialId(selectedSplitId).success) {
    selectedSplit = splits.find((split) => split.id === selectedSplitId);
  }

  if (!selectedSplit) {
    return (
      <EmptyState
        title="Classifica non disponibile"
        description="La classifica sara disponibile quando lo split sara' annunciato ed avrai calcolato la prima giornata"
      />
    );
  }
}
