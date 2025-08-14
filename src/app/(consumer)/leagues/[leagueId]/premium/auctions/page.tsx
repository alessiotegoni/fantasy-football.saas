import Container from "@/components/Container";
import SplitSelect from "@/features/splits/components/SplitSelect";
import { getSplits, Split } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { NavArrowRight } from "iconoir-react";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import BackButton from "@/components/BackButton";
import { getLeagueAuctions } from "@/features/(league)/auctions/queries/auction";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ splitId?: string }>;
};

export default async function LeagueAuctionsPage({
  params,
  searchParams,
}: Props) {
  const [{ leagueId }, splits] = await Promise.all([params, getSplits()]);

  const lastSplit = splits.at(-1);

  return (
    <Container
      headerLabel="Aste"
      leagueId={leagueId}
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

  if (!lastSplit) {
    return (
      <EmptyState
        title="Split non ancora iniziato"
        description="Qui vedrai tutte le aste della tua lega create dopo l'annuncio dello split"
        renderButton={() => <BackButton />}
      />
    );
  }

  const selectedSplitId = parseInt((await selectedSplitPromise) ?? "0");
  if (selectedSplitId && validateSerialId(selectedSplitId).success) {
    selectedSplit = splits.find((split) => split.id === selectedSplitId);
  }

  if (!selectedSplit) {
    return (
      <EmptyState
        title="Split invalido"
        description="La tua lega non ha aste in questo split"
        renderButton={() => <BackButton />}
      />
    );
  }

  const auctions = await getLeagueAuctions(leagueId, selectedSplit.id);

  if (!auctions.length) {
    const isSplitEnded = selectedSplit.status === "ended";
    return (
      <EmptyState
        title="Aste non trovate"
        description="La lega non ha aste in questo split"
        renderButton={() =>
          isSplitEnded ? (
            <BackButton />
          ) : (
            <Button asChild className="min-w-36">
              <Link href={`/leages/${leagueId}/premium/auctions/create`}>
                Crea asta
                <NavArrowRight className="size-5" />
              </Link>
            </Button>
          )
        }
      />
    );
  }

  const groupedMatches = Object.groupBy(auctions, (match) => match.type);

  console.log(groupedMatches);

  return <div className="space-y-8"></div>;
}
