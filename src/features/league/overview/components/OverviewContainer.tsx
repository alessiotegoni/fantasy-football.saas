"use client";

import Container from "@/components/Container";
import { useLeague } from "@/contexts/LeagueProvider";

export default function OverviewContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { league } = useLeague();

  return (
    <Container headerLabel={league.name} className="max-w-4xl">
      {children}
    </Container>
  );
}

// TODO: Select per le leghe dell'utente
