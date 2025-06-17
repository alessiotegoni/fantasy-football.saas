import Container from "@/components/Container";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams?: Promise<{ proposerTeamId?: string; receiverTeamId?: string }>;
};

export default async function TradeProposalPage(props: Props) {
  return (
    <Container headerLabel="Proponi scambio">
      <Suspense>
        <SuspenseBoundary {...props} />
      </Suspense>
    </Container>
  );
}

async function SuspenseBoundary({ params, searchParams }: Props) {
  const [{ leagueId }, searchP] = await Promise.all([params, searchParams]);
  
  if (!searchP?.proposerTeamId) notFound();



  return <></>;
}
