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
  const MIN_PRICE_PER_SLOT = 1;
  const remainingCredits = currentCredits - bidAmount;
  const minRequired = slotsRemaining * MIN_PRICE_PER_SLOT;

  if (bidAmount > currentCredits) {
    return { valid: false, reason: "Non hai abbastanza crediti disponibili." };
  }

  if (remainingCredits < minRequired) {
    return {
      valid: false,
      reason: `Devi conservare almeno ${minRequired} crediti per completare la rosa.`,
    };
  }

  return { valid: true };
}
