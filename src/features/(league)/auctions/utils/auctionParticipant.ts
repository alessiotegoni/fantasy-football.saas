import { PlayersPerRole } from "@/drizzle/schema";

export function checkMaxPlayersPerRole(
  playerCounts: Record<number, number>,
  playersPerRole: PlayersPerRole,
  playerRoleId: number
) {
  const currentRoleCount = playerCounts[playerRoleId] || 0;
  const maxRoleCount = playersPerRole[playerRoleId] || 0;
  return currentRoleCount < maxRoleCount;
}

type CreditsValidation =
  | { isValid: true; reason: null }
  | { isValid: false; reason: string };

export function validateBidCredits({
  currentCredits,
  bidAmount,
  slotsRemaining,
}: {
  currentCredits: number;
  bidAmount: number;
  slotsRemaining: number;
}): CreditsValidation {
  const MIN_PRICE_PER_SLOT = 1;
  const remainingCredits = currentCredits - bidAmount;
  const minRequired = slotsRemaining * MIN_PRICE_PER_SLOT;

  if (bidAmount > currentCredits) {
    return {
      isValid: false,
      reason: "Non hai abbastanza crediti disponibili.",
    };
  }

  if (remainingCredits < minRequired) {
    return {
      isValid: false,
      reason: `Devi conservare almeno ${minRequired} crediti per completare la rosa.`,
    };
  }

  return { isValid: true, reason: null };
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
