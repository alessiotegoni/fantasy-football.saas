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
              type="multiple"
              className="w-full space-y-1.5"
              defaultValue={playersRoles.map((role) => role.id.toString())}
            >
              {playersRoles.map((role) => (
                <AcquisitionsRoleSlots
                  key={role.id.toString()}
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
