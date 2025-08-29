"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import AuctionParticipant from "./AuctionParticipant"

export function ParticipantsWithAcquisitions() {
  const { participants } = useAuction();

  return (
    <div className="flex justify-center w-full">
      <div className="flex gap-2">
        {participants.map((participant) => (
          <AuctionParticipant key={participant.id} participant={participant} renderAcquisitions={()} />
        ))}
      </div>
    </div>
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
