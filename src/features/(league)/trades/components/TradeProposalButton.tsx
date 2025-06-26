import { Button } from "@/components/ui/button";
import { isTradeMarketOpen } from "../permissions/trade";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";
import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  leagueId: string;
  userTeamId: string;
} & React.ComponentPropsWithoutRef<typeof Button>;

export default async function TradeProposalButton({
  text = "Scambia giocatori",
  leagueId,
  userTeamId,
  className,
  ...buttonProps
}: Props) {
  const isMarketOpen = await isTradeMarketOpen(leagueId);
  if (!isMarketOpen) return null;

  return (
    <Button
      asChild
      className={cn("w-fit !px-7 mt-8", className)}
      {...buttonProps}
    >
      <Link
        href={`/leagues/${leagueId}/my-trades/proposal?proposerTeamId=${userTeamId}`}
      >
        {text}
        <NavArrowRight />
      </Link>
    </Button>
  );
}
