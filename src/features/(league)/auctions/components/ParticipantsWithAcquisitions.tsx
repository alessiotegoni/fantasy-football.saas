"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Accordion } from "@/components/ui/accordion";
import AcquisitionsRoleSlots from "./AcquisitionsRoleSlots";
import AuctionParticipant from "./AuctionParticipant";

export function ParticipantsWithAcquisitions() {
  const { participants, playersRoles } = useAuction();

  return (
    <div className="flex justify-center w-full">
      <div className="flex gap-2">
        {participants.map((participant) => (
          <div key={participant.id}>
            <AuctionParticipant
              key={participant.id}
              participant={participant}
            />
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-1.5"
            >
              {playersRoles.map((role) => (
                <AcquisitionsRoleSlots
                  key={`${participant.id}-${role.id}`}
                  participant={participant}
                  role={role}
                />
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
