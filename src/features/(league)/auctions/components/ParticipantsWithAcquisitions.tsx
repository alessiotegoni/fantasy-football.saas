"use client";

import { useAuction } from "@/contexts/AuctionProvider";
import { Accordion } from "@/components/ui/accordion";
import AcquisitionsRoleSlots from "./AcquisitionsRoleSlots";
import AuctionParticipant from "./AuctionParticipant";
import { useCallback, useEffect, useState } from "react";

export function ParticipantsWithAcquisitions() {
  const { participants, playersRoles } = useAuction();
  const accordion = useAccordion();

  return (
    <div className="flex justify-center w-full">
      <Accordion type="multiple" className="flex gap-2" {...accordion}>
        {participants.map((participant) => (
          <div key={participant.id}>
            <AuctionParticipant
              key={participant.id}
              participant={participant}
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

function useAccordion() {
  const { auction, playersRoles, participants, acquisitions } = useAuction();

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const notFullRoleSlots = playersRoles.filter((role) => {
      const maxPlayers = auction.settings.playersPerRole[role.id] ?? 1;

      const roleAcquisitions = acquisitions.filter(
        (a) => a.player.roleId === role.id
      );

      return maxPlayers * participants.length > roleAcquisitions.length;
    });

    setValue(notFullRoleSlots.map((role) => role.id.toString()));
  }, [playersRoles, acquisitions]);

  const onValueChange = useCallback(setValue, []);

  return { value, onValueChange };
}
