import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getFinalPhaseAccess } from "@/features/league/admin/calendar/final-phase/utils/calendar";
import StandingWrapper from "@/features/league/standing/components/StandingWrapper";
import {
  getDefaultStandingData,
  getLeagueStandingData,
} from "@/features/league/standing/queries/standing";
import SplitSelect from "@/features/splits/components/SplitSelect";
import { getSplits, Split } from "@/features/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { NavArrowRight } from "iconoir-react";
import Link from "next/link";
import { ComponentPropsWithoutRef, Suspense } from "react";

export default async function LeagueStandingPage({
  params,
  searchParams,
}: PageProps<"/league/[leagueId]/standing">) {
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
      <StandingEmptyState description="La classifica sara disponibile quando lo split sara' annunciato ed avrai calcolato la prima giornata" />
    );
  }

  let standingData = await getLeagueStandingData(leagueId, selectedSplit.id);
  let isDefaultStainding = false;

  if (!standingData.length && selectedSplit.status === "ended") {
    return (
      <StandingEmptyState
        description={`La classifica non e' disponibile perche questa lega non ha partecipato allo split ${selectedSplit.id}`}
      />
    );
  }

  if (!standingData.length && selectedSplit.status !== "ended") {
    const defaultData = await getDefaultStandingData(leagueId);

    // FIXME: Replace mockStandingData with standingData

    if (mockStandingsData.length < 4) {
      return (
        <StandingEmptyState
          description="Per vedere la classifica sono necessarie almeno 4 squadre all'interno della lega"
          renderButton={() => (
            <Button className="w-44" asChild>
              <Link href={`/league/${leagueId}/teams`}>
                Vedi squadre <NavArrowRight className="size-5" />
              </Link>
            </Button>
          )}
        />
      );
    }

    standingData = defaultData;
    isDefaultStainding = true;
  }

  // FIXME: Replace mockStandingData with standingData

  const finalPhaseAccess = getFinalPhaseAccess(mockStandingsData);

  return (
    <StandingWrapper
      data={mockStandingsData}
      isSplitEnded={selectedSplit.status === "ended"}
      isDefaultStanding={true} //FIXME: add isDefaultStanding variable
      finalPhaseAccess={finalPhaseAccess}
    />
  );
}

function StandingEmptyState(
  props: Omit<ComponentPropsWithoutRef<typeof EmptyState>, "title">
) {
  return <EmptyState title="Classifica non disponibile" {...props} />;
}

const mockStandingsData = [
  {
    team: {
      id: "1",
      name: "RESTIVO FC",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1250",
    points: "45",
    goalsScored: "28",
    goalsConceded: "12",
    goalDifference: 16,
    wins: 14,
    draws: 3,
    losses: 1,
  },
  {
    team: {
      id: "2",
      name: "botafiga fc",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1180",
    points: "42",
    goalsScored: "25",
    goalsConceded: "15",
    goalDifference: 10,
    wins: 13,
    draws: 3,
    losses: 2,
  },
  {
    team: {
      id: "3",
      name: "VillainsAlwaysWin",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1165",
    points: "38",
    goalsScored: "22",
    goalsConceded: "18",
    goalDifference: 4,
    wins: 11,
    draws: 5,
    losses: 2,
  },
  {
    team: {
      id: "4",
      name: "FREEBOSSETTIFC",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1145",
    points: "35",
    goalsScored: "20",
    goalsConceded: "16",
    goalDifference: 4,
    wins: 10,
    draws: 5,
    losses: 3,
  },
  {
    team: {
      id: "5",
      name: "Coca Juniors",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1120",
    points: "32",
    goalsScored: "19",
    goalsConceded: "20",
    goalDifference: -1,
    wins: 9,
    draws: 5,
    losses: 4,
  },
  {
    team: {
      id: "6",
      name: "poggioletto",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1095",
    points: "28",
    goalsScored: "16",
    goalsConceded: "22",
    goalDifference: -6,
    wins: 8,
    draws: 4,
    losses: 6,
  },
  {
    team: {
      id: "7",
      name: "BERLUSCA DORTMUND",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1070",
    points: "25",
    goalsScored: "14",
    goalsConceded: "25",
    goalDifference: -11,
    wins: 7,
    draws: 4,
    losses: 7,
  },
  {
    team: {
      id: "8",
      name: "riportainvitailveccjioditatore",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1080",
    points: "22",
    goalsScored: "12",
    goalsConceded: "28",
    goalDifference: -16,
    wins: 6,
    draws: 4,
    losses: 8,
  },
  {
    team: {
      id: "9",
      name: "riportainvitailveccjioditatore",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1080",
    points: "22",
    goalsScored: "12",
    goalsConceded: "28",
    goalDifference: -16,
    wins: 6,
    draws: 4,
    losses: 8,
  },
  {
    team: {
      id: "10",
      name: "riportainvitailveccjioditatore",
      imageUrl: "/placeholder.svg?height=32&width=32",
    },
    totalScore: "1080",
    points: "22",
    goalsScored: "12",
    goalsConceded: "28",
    goalDifference: -16,
    wins: 6,
    draws: 4,
    losses: 8,
  },
  // {
  //   team: {
  //     id: "11",
  //     name: "riportainvitailveccjioditatore",
  //     imageUrl: "/placeholder.svg?height=32&width=32",
  //   },
  //   totalScore: "1080",
  //   points: "22",
  //   goalsScored: "12",
  //   goalsConceded: "28",
  //   goalDifference: -16,
  //   wins: 6,
  //   draws: 4,
  //   losses: 8,
  // },
  // {
  //   team: {
  //     id: "12",
  //     name: "riportainvitailveccjioditatore",
  //     imageUrl: "/placeholder.svg?height=32&width=32",
  //   },
  //   totalScore: "1080",
  //   points: "22",
  //   goalsScored: "12",
  //   goalsConceded: "28",
  //   goalDifference: -16,
  //   wins: 6,
  //   draws: 4,
  //   losses: 8,
  // },
];
