import { useAuction } from "@/contexts/AuctionProvider";
import { useMemo } from "react";

export default function useAcquisitionsRoleSlots() {
  const {
    auction: { settings },
    playersRoles,
    participants,
    acquisitions,
  } = useAuction();

  const unfilledRolesIds = useMemo(() => {
    const unfilledRoles = playersRoles.filter((role) => {
      const maxPlayers = settings.playersPerRole[role.id] ?? 1;

      const roleAcquisitions = acquisitions.filter(
        (a) => a.player.roleId === role.id
      );

      return maxPlayers * participants.length > roleAcquisitions.length;
    });

    return unfilledRoles.map((role) => role.id);
  }, [playersRoles, acquisitions, settings.playersPerRole]);

  return { unfilledRolesIds };
}
