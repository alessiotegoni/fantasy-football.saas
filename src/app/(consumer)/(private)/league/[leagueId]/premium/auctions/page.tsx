import Container from "@/components/Container";
import { validateSerialId } from "@/schema/helpers";
import { NavArrowRight } from "iconoir-react";
import { Suspense } from "react";
import EmptyState from "@/components/EmptyState";
import BackButton from "@/components/BackButton";
import {
  type AuctionWithCreator,
  getLeagueAuctions,
} from "@/features/league/auctions/queries/auction";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserId } from "@/features/dashboard/user/utils/user";
import AuctionsList from "@/features/league/auctions/components/AuctionsList";
import Disclaimer from "@/components/Disclaimer";
import { isLeagueAdmin } from "@/features/league/members/permissions/leagueMember";
import {
  getSplits,
  Split,
} from "@/features/dashboard/admin/splits/queries/split";
import SplitSelect from "@/features/dashboard/admin/splits/components/SplitSelect";

export default async function LeagueAuctionsPage({
  params,
  searchParams,
}: PageProps<"/league/[leagueId]/premium/auctions">) {
  const [{ leagueId }, splits] = await Promise.all([params, getSplits()]);

  const lastSplit = splits.at(-1);

  return (
    <Container
      headerLabel="Aste della lega"
      leagueId={leagueId}
      renderHeaderRight={() => (
        <SplitSelect splits={splits} defaultSplit={lastSplit} />
      )}
    >
      <Suspense>
        <SuspenseBoundary
          leagueId={leagueId}
          selectedSplitPromise={searchParams.then((sp) => sp.splitId as string)}
          splits={splits}
          lastSplit={lastSplit}
        />
      </Suspense>
      <Disclaimer />
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

  const selectedSplitId = Number.parseInt((await selectedSplitPromise) ?? "0");
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
              <Link href={`/league/${leagueId}/premium/auctions/create`}>
                Crea asta
                <NavArrowRight className="size-5" />
              </Link>
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <AuctionsList
            leagueId={leagueId}
            auctions={auctions}
            selectedSplit={selectedSplit}
          />
        }
      >
        <SuspendedAuctionsList
          leagueId={leagueId}
          auctions={auctions}
          selectedSplit={selectedSplit}
        />
      </Suspense>
    </div>
  );
}

async function SuspendedAuctionsList({
  leagueId,
  auctions,
  selectedSplit,
}: {
  leagueId: string;
  auctions: AuctionWithCreator[];
  selectedSplit: Split;
}) {
  const userId = await getUserId();
  if (!userId) return null;

  const isAdmin = await isLeagueAdmin(userId, leagueId);

  return (
    <AuctionsList
      leagueId={leagueId}
      auctions={auctions}
      isLeagueAdmin={isAdmin}
      selectedSplit={selectedSplit}
    />
  );
}
