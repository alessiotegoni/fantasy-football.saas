export function checkMaxPlayersPerRole(
  playerCounts: Record<number, number>,
  playersPerRole: Record<number, number>,
  playerRoleId: number
) {
  const currentRoleCount = playerCounts[playerRoleId] || 0;
  const maxRoleCount = playersPerRole[playerRoleId] || 0;
  return currentRoleCount < maxRoleCount;
}

export function validateBidCredits({
  currentCredits,
  bidAmount,
  slotsRemaining,
}: {
  currentCredits: number;
  bidAmount: number;
  slotsRemaining: number;
}) {
  if (currentCredits - bidAmount >= slotsRemaining) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: "Crediti insufficienti per completare la rosa.",
  };
}
