import { Button } from "@/components/ui/button";
import { isTradeMarketOpen } from "../permissions/trade";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";
import { cn } from "@/lib/utils";

type Props = {
  text?: string;
  leagueId: string;
  userTeamId: string;
  showButtonIfMarketDisabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Button>;

export default async function TradeProposalButton({
  text = "Scambia giocatori",
  leagueId,
  userTeamId,
  className,
  ...buttonProps
}: Props) {
  const isMarketOpen = await isTradeMarketOpen(leagueId);

  return (
    <Button
      asChild
      className={cn(
        "w-fit !px-7 mt-8",
        !isMarketOpen &&
          "bg-primary/60 text-muted-foreground hover:bg-primary/60 cursor-default",
        className
      )}
      disabled={!isMarketOpen}
      {...buttonProps}
    >
      {isMarketOpen ? (
        <Link
          href={`/leagues/${leagueId}/my-trades/proposal?proposerTeamId=${userTeamId}`}
        >
          {text}
          <NavArrowRight />
        </Link>
      ) : (
        <div>Mercato scambi chiuso</div>
      )}
    </Button>
  );
}
