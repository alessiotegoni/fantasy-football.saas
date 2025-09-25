"use client";

import Container from "@/components/Container";
import { useLeague } from "@/contexts/LeagueProvider";

export default function OverviewContainer({
  children,
  headerRight,
}: {
  children: React.ReactNode;
  headerRight: React.ReactNode;
}) {
  const { league } = useLeague();

  return (
    <Container
      headerLabel={league.name}
      className="max-w-4xl"
      headerRight={headerRight}
    >
      {children}
    </Container>
  );
}
