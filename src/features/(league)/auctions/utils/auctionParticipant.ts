import { PlayersPerRole } from "@/drizzle/schema";

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
