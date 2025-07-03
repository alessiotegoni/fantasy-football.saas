import Container from "@/components/Container";
import ResetCreditsDialog from "@/features/(league)/(admin)/handle-credits/components/ResetCreditsDialog";
import { getGeneralOptions } from "@/features/(league)/options/queries/leagueOptions";
import { Suspense } from "react";

export default async function HandleCreditsPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <Container
      leagueId={leagueId}
      headerLabel="Gestisci crediti"
      renderHeaderRight={() => (
        <Suspense>
          <ResetCreditsDialog
            leagueId={leagueId}
            defaultCreditsPromise={getGeneralOptions(leagueId).then(
              (options) => options?.initialCredits ?? 500
            )}
          />
        </Suspense>
      )}
    ></Container>
  );
}
