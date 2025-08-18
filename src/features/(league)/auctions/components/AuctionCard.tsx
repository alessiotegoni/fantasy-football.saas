"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AuctionWithCreator } from "../queries/auction";
import ActionButton from "@/components/ActionButton";
import { deleteAuction } from "../actions/auction";
import AuctionStatus from "../components/AuctionStatus";

type Props = {
  auction: AuctionWithCreator;
  leagueId: string;
  isLeagueAdmin: boolean;
  canEdit: boolean;
};

export default function AuctionCard({
  auction,
  leagueId,
  isLeagueAdmin,
  canEdit,
}: Props) {
  const canUpdateAuction = canEdit && auction.status !== "ended";

  // FIXME: quando elimino un'asta l'overlay dell'alert dialog di ActionButton rimane aperto

  return (
    <div className="bg-input/30 border border-border rounded-4xl p-5 min-h-40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-card-foreground flex-1 min-w-0">
            {auction.name}
          </h3>

          <div className="flex items-center gap-2 flex-shrink-0">
            <AuctionStatus
              auction={auction}
              canUpdate={isLeagueAdmin && canUpdateAuction}
            />

            {isLeagueAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0 rounded-full">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="space-y-1"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {canUpdateAuction && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/leagues/${leagueId}/premium/auctions/${auction.id}/edit`}
                      >
                        <Edit />
                        Modifica asta
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <ActionButton
                    variant="destructive"
                    loadingText="Elimino"
                    action={deleteAuction.bind(null, auction.id)}
                    requireAreYouSure
                    areYouSureDescription="Sei sicuro di voler eliminare l'asta ? L'azione e' irreversibile"
                    className="text-white px-2 py-1.5 rounded-lg text-sm"
                  >
                    <Trash2 />
                    Elimina asta
                  </ActionButton>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:mt-1">
          Creata da{" "}
          <span className="font-semibold">{auction.creator.managerName}</span>
        </div>
      </div>

      {auction.description && (
        <p className="text-sm text-muted-foreground leading-relaxed sm:mb-3 mt-1.5">
          {auction.description}
        </p>
      )}

      <Button asChild className="self-end w-fit mt-3 sm:mt-0">
        <Link href={`/leagues/${leagueId}/auctions/${auction.id}`}>
          Partecipa
        </Link>
      </Button>
    </div>
  );
}
