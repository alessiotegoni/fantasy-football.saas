"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, Shield } from "iconoir-react";
import { AuctionParticipant } from "../queries/auctionParticipant";
import ActionButton from "@/components/ActionButton";
import { setAuctionTurn } from "../actions/auctionParticipant";
import { Badge } from "@/components/ui/badge";

export function ParticipantsList() {
  const {
    participants,
    isLeagueAdmin = false,
    userParticipant,
    turnParticipant,
  } = useAuction();

  return (
    <div className="flex gap-4">
      {participants.map((participant) => (
        <DropdownMenu key={participant.id} modal={false}>
          <DropdownMenuTrigger className="bg-input/60 p-4 border rounded-3xl hover:bg-muted/50 cursor-pointer transition-colors min-w-70 relative">
            {participant.id === userParticipant?.id && isLeagueAdmin && (
              <Badge className="absolute top-3 right-3 size-5 rounded-full bg-primary flex justify-center items-center p-0">
                <Shield className="size-3 fill-white" />
              </Badge>
            )}
            <div className="flex flex-col items-center justify-center gap-1">
              <h3 className="font-medium text-lg">
                {participant.team?.name || "Team eliminato"}
              </h3>
              <div className="flex items-center gap-2 text-primary">
                <Coins />
                <h2 className="font-semibold text-2xl">
                  {participant.credits}
                </h2>
              </div>
            </div>
          </DropdownMenuTrigger>
          <ParticipantDropdown participant={participant} />
        </DropdownMenu>
      ))}
    </div>
  );
}

function ParticipantDropdown({
  participant,
}: {
  participant: AuctionParticipant;
}) {
  return (
    <DropdownMenuContent className="w-56">
      {participant.teamId && (
        <DropdownMenuItem asChild>
          <ActionButton
            loadingText="Assegno turno"
            action={setAuctionTurn.bind(null, {
              auctionId: participant.auctionId,
              teamId: participant.teamId,
            })}
          >
            Assegna turno
          </ActionButton>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  );
}

//   <div className="space-y-1 text-xs text-muted-foreground">
//     <div className="flex justify-between">
//       <span>Giocatori:</span>
//       {/* <span className="font-medium">{participant.}</span> */}
//     </div>
//     <div className="flex justify-between">
//       <span>% Spesi:</span>
//       {/* <span className="font-medium">{participant.spent}%</span> */}
//     </div>
//   </div>
