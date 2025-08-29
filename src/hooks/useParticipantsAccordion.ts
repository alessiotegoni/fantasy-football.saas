import { useAuction } from "@/contexts/AuctionProvider";
import { useEffect, useState, useCallback } from "react";

export default function useParticipantsAccordion() {
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
