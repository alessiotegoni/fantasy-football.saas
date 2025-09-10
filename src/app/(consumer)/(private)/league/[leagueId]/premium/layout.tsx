import { isPremiumUnlocked } from "@/features/league/leagues/permissions/league";
import { redirect } from "next/navigation";

export default async function LeaguePremiumLayout({
  params,
  children,
}: LayoutProps<"/league/[leagueId]/premium">) {
  const { leagueId } = await params;

  const leaguePremium = await isPremiumUnlocked(leagueId);
  if (!leaguePremium) redirect(`/league/${leagueId}`);

  return children;
}
