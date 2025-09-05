import { getLeaguePremium } from "@/features/(league)/leagues/queries/league";
import { redirect } from "next/navigation";

export default async function PremiumLayout({
  params,
  children,
}: LayoutProps<"/league/[leagueId]/premium">) {
  const { leagueId } = await params;

  const hasLeaguePremium = await getLeaguePremium(leagueId);
  if (!hasLeaguePremium) redirect(`/league/${leagueId}`);

  return children;
}
