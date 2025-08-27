import { PlayersPerRole } from "@/drizzle/schema";
import { AuctionAcquisition } from "../queries/auctionAcquisition";
import { AuctionParticipant } from "../queries/auctionParticipant";
import { AuctionWithSettings } from "../queries/auction";

export function isRoleFull(
  playerCounts: Record<number, number>,
  playersPerRole: PlayersPerRole,
  playerRoleId: number
) {
  const currentRoleCount = playerCounts[playerRoleId] || 0;
  const maxRoleCount = playersPerRole[playerRoleId] || 0;
  return currentRoleCount >= maxRoleCount;
}

export function getRemainingSlots(
  playerCounts: Record<number, number>,
  playersPerRole: PlayersPerRole
) {
  const requiredPlayers = Object.values(playersPerRole).reduce(
    (acc, value) => acc + value,
    0
  );
  const acquiredPlayers = Object.values(playerCounts).reduce(
    (acc, value) => acc + value,
    0
  );

  return requiredPlayers - acquiredPlayers;
}

export function calculateRemainingSlots(
  acquisitions: AuctionAcquisition[],
  userParticipant: AuctionParticipant | undefined,
  auction: NonNullable<AuctionWithSettings>
) {
  const playerCounts: Record<number, number> = {};
  if (userParticipant) {
    const userAcquisitions = acquisitions.filter(
      (a) => a.participantId === userParticipant.id
    );

    for (const acq of userAcquisitions) {
      if (acq.player) {
        playerCounts[acq.player.roleId] =
          (playerCounts[acq.player.roleId] || 0) + 1;
      }
    }
  }

  const slotsRemaining = getRemainingSlots(
    playerCounts,
    auction.settings.playersPerRole
  );

  return slotsRemaining;
}
