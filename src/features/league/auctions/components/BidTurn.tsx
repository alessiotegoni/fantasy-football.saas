import { Badge } from "@/components/ui/badge";
import { useAuction } from "@/contexts/AuctionProvider";
import { cn } from "@/lib/utils";
import { Trophy } from "iconoir-react";

export default function BidTurn() {
  const { canBid, userParticipant, turnParticipant } =
    useAuction();

  const isMyTurn = userParticipant?.isCurrent ?? false;

  return (
    <>
      {isMyTurn && (
        <div
          className={cn(
            "flex flex-col justify-center items-center gap-2",
            !isMyTurn && !canBid && "h-full"
          )}
        >
          <Trophy className="size-8 mx-auto text-primary" />
          <h2 className="text-lg font-bold">È IL TUO TURNO</h2>
          <p className="text-sm text-center text-muted-foreground">
            Seleziona un giocatore dal menu alla tua sinistra e chiamalo
          </p>
        </div>
      )}
      {!isMyTurn && turnParticipant?.team && (
        <div
          className={cn(
            "flex flex-col justify-center items-center gap-2",
            !isMyTurn && !canBid && "h-full"
          )}
        >
          <Trophy className="size-8 mx-auto text-primary" />
          <h2 className="text-lg font-heading font-bold">È IL TURNO DI</h2>
          <Badge className="p-2 px-4 rounded-lg bg-primary w-fit text-md font-semibold mt-1.5">
            {turnParticipant.team.name}
          </Badge>
        </div>
      )}
    </>
  );
}
