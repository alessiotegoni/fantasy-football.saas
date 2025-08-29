"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Accordion } from "@/components/ui/accordion";
import AcquisitionsRoleSlots from "./AcquisitionsRoleSlots";
import AuctionParticipant from "./AuctionParticipant";
import useParticipantsAccordion from "@/hooks/useParticipantsAccordion";
import useParticipantsPresence from "@/hooks/useParticipantsPresence";

export function ParticipantsWithAcquisitions() {
  const { participants, playersRoles } = useAuction();

  const { isOnline } = useParticipantsPresence();
  const accordion = useParticipantsAccordion();

  return (
    <div className="flex justify-center w-full">
      <Accordion type="multiple" className="flex gap-2" {...accordion}>
        {participants.map((participant) => (
          <div key={participant.id}>
            <AuctionParticipant
              key={participant.id}
              participant={participant}
              isOnline={isOnline(participant)}
            />
            <div className="space-y-1.5">
              {playersRoles.map((role) => (
                <AcquisitionsRoleSlots
                  key={`${participant.id}-${role.id}`}
                  participant={participant}
                  role={role}
                />
              ))}
            </div>
          </div>
        ))}
      </Accordion>
    </div>
  );
}
