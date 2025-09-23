import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import SplitSelect from "@/features/dashboard/admin/splits/components/SplitSelect";
import {
  getSplits,
  Split,
} from "@/features/dashboard/admin/splits/queries/split";
import { getFinalPhaseAccess } from "@/features/league/admin/calendar/final-phase/utils/calendar";
import StandingWrapper from "@/features/league/standing/components/StandingWrapper";
import {
  getAdjustedStandingData,
  getDefaultStandingData,
  getLeagueStandingData,
  StandingData,
} from "@/features/league/standing/queries/standing";
import {
  getLeagueTeams,
  LeagueTeam,
} from "@/features/league/teams/queries/leagueTeam";
import { validateSerialId } from "@/schema/helpers";;
import { ComponentPropsWithoutRef, Suspense } from "react";

export default async function LeagueStandingPage({
  params,
  searchParams,
}: PageProps<"/league/[leagueId]/standing">) {
  const [splits, { leagueId }] = await Promise.all([getSplits(), params]);

  const leagueTeams = await getLeagueTeams(leagueId);

  const standingData = getDefaultStandingData(leagueTeams);
  const finalPhaseAccess = getFinalPhaseAccess(standingData);

  return (
    <Container
      leagueId={leagueId}
      headerLabel="Classifica"
      className="max-w-[700px]"
      renderHeaderRight={() => (
        <SplitSelect splits={splits} defaultSplit={splits.at(-1)} />
      )}
    >
      <Suspense
        fallback={
          <StandingWrapper
            data={standingData}
            finalPhaseAccess={finalPhaseAccess}
          />
        }
      >
        <SuspenseBoundary
          defaultStandingData={standingData}
          leagueTeams={leagueTeams}
          leagueId={leagueId}
          selectedSplitPromise={searchParams.then(
            (sp) => sp.splitId as string | undefined
          )}
          splits={splits}
          lastSplit={splits.at(-1)}
        />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({
  defaultStandingData,
  leagueTeams,
  leagueId,
  selectedSplitPromise,
  splits,
  lastSplit,
}: {
  leagueId: string;
  selectedSplitPromise: Promise<string | undefined>;
  leagueTeams: LeagueTeam[];
  defaultStandingData: StandingData[];
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
      <StandingEmptyState description="La classifica sara disponibile quando lo split sara' annunciato ed avrai calcolato la prima giornata" />
    );
  }

  let standingData = await getLeagueStandingData(leagueId, selectedSplit.id);

  if (!standingData.length && selectedSplit.status === "ended") {
    return (
      <StandingEmptyState
        description={`La classifica non e' disponibile perche questa lega non ha partecipato allo split ${selectedSplit.id}`}
        />
      );
  }

  if (
    standingData.length !== leagueTeams.length &&
    selectedSplit.status !== "ended"
  ) {
    standingData = getAdjustedStandingData(standingData, defaultStandingData);
  }

  const finalPhaseAccess = getFinalPhaseAccess(standingData);

  return (
    <StandingWrapper
      data={standingData}
      isSplitEnded={selectedSplit.status === "ended"}
      finalPhaseAccess={finalPhaseAccess}
      isDefaultStanding={false}
    />
  );
}

function StandingEmptyState(
  props: Omit<ComponentPropsWithoutRef<typeof EmptyState>, "title">
) {
  return <EmptyState title="Classifica non disponibile" {...props} />;
}
