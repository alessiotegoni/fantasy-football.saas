"use client";

import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteAuction } from "../actions/auction";
import { PropsWithChildren } from "react";
import { Href } from "@/utils/helpers";

type Props = {
  auction: { id: string };
  canUpdate: boolean;
  leagueId: string;
};

export default function AuctionDropdownMenu({
  auction,
  canUpdate,
  leagueId,
  children,
}: PropsWithChildren<Props>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0 rounded-full">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="space-y-1">
        {children}
        {canUpdate && (
          <DropdownMenuItem asChild>
            <Link
              href={
                `/leagues/${leagueId}/premium/auctions/${auction.id}/edit` as Href
              }
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
          redirectTo={`/premium/auctions` as Href}
          requireAreYouSure
          areYouSureDescription="Sei sicuro di voler eliminare l'asta ? L'azione e' irreversibile"
          className="justify-start text-white px-2 py-1.5 rounded-lg text-sm"
        >
          <Trash2 />
          Elimina asta
        </ActionButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
