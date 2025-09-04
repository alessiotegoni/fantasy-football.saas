import { getLeaguePremium } from "@/features/(league)/leagues/queries/league";
import { redirect } from "next/navigation";

export default async function PremiumLayout({
  params,
  children,
}: LayoutProps<"/leagues/[leagueId]/premium">) {
  const { leagueId } = await params;

  const hasLeaguePremium = await getLeaguePremium(leagueId);
  if (!hasLeaguePremium) redirect(`/leagues/${leagueId}`);

  return children;
}
