"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Arc3dCenterPoint } from "iconoir-react";
import ActionButton from "@/components/ActionButton";
import { updateAuctionStatus } from "../actions/auction";

export default function TerminateAuction() {
  const { auction } = useAuction();

  return (
    <div className="flex flex-col justify-between items-center text-center gap-2 h-full">
      <div className="flex flex-col justify-center items-center gap-2">
        <Arc3dCenterPoint className="size-10 text-primary" />
        <h2 className="font-bold text-lg">TERMINA ASTA</h2>
        <h3 className="">Asta durata</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Dopo aver terminato l'asta non potrai piu riattivarla. Tutti gli
          acquisti verranno automaticamente importati all'interno della lega.
        </p>
      </div>

      <ActionButton
        className="max-w-36"
        variant="destructive"
        loadingText="Termino"
        action={updateAuctionStatus.bind(null, {
          id: auction.id,
          status: "ended",
        })}
      >
        Termina
      </ActionButton>
    </div>
  );
}
