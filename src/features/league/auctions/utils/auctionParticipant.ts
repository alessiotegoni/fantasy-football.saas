import { PlayersPerRole } from "@/drizzle/schema";
import { AuctionParticipant } from "../queries/auctionParticipant";
import { AuctionWithSettings } from "../queries/auction";
import { ParticipantAcquisition } from "../queries/auctionAcquisition";

export function isRoleFull(
  playerCounts: Record<number, number>,
  playersPerRole: PlayersPerRole,
  playerRoleId: number
) {
  if (!playerCounts) return false

  const currentRoleCount = playerCounts[playerRoleId] || 0;
  const maxRoleCount = playersPerRole[playerRoleId] || 1;

  return currentRoleCount >= maxRoleCount;
}

export function sumValues(obj: Record<string | number, number>) {
  return Object.values(obj).reduce((acc, value) => acc + value, 0);
}

export function getRemainingSlots(
  playerCounts: Record<number, number>,
  playersPerRole: PlayersPerRole
) {
  const requiredPlayers = sumValues(playersPerRole);
  const acquiredPlayers = sumValues(playerCounts);

  return requiredPlayers - acquiredPlayers;
}

export function calculateRemainingSlots(
  acquisitions: ParticipantAcquisition[],
  participant: AuctionParticipant | undefined,
  auction: NonNullable<AuctionWithSettings>
) {
  if (!participant) return 0;

  const playerCounts = acquisitions
    .filter((a) => a.participantId === participant.id)
    .reduce((counts, acq) => {
      const roleId = acq.player!.roleId;
      counts[roleId] = (counts[roleId] || 0) + 1;
      return counts;
    }, {} as Record<number, number>);

  return getRemainingSlots(playerCounts, auction.settings.playersPerRole);
}
