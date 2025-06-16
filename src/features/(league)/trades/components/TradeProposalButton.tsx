import { Button } from "@/components/ui/button";
import { isTradeMarketOpen } from "../permissions/trade";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";

type Props = {
  leagueId: string;
  userTeamId: string;
};

export default async function TradeProposalButton({ leagueId, userTeamId }: Props) {
  const isMarketOpen = await isTradeMarketOpen(leagueId);
  if (!isMarketOpen) return null;

  return (
    <Button asChild className="w-fit !px-7 mt-8">
      <Link
        href={`/leagues/${leagueId}/my-trades/proposal?proposerTeamId=${userTeamId}`}
      >
        Scambia giocatori
        <NavArrowRight />
      </Link>
    </Button>
  );
}
