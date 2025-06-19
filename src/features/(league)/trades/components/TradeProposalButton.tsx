import { Button } from "@/components/ui/button";
import { isTradeMarketOpen } from "../permissions/trade";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";

type Props = {
  text?: string;
  leagueId: string;
  userTeamId: string;
};

export default async function TradeProposalButton({
  text = "Scambia giocatori",
  leagueId,
  userTeamId,
}: Props) {
  const isMarketOpen = await isTradeMarketOpen(leagueId);
  if (!isMarketOpen) return null;

  return (
    <Button asChild className="w-fit !px-7 mt-8">
      <Link
        href={`/leagues/${leagueId}/my-trades/proposal?proposerTeamId=${userTeamId}`}
      >
        {text}
        <NavArrowRight />
      </Link>
    </Button>
  );
}
