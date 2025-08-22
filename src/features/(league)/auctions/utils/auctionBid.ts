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

export function isTimeExpired({
  expiresAt,
  othersCallsTime,
}: {
  expiresAt: Date;
  othersCallsTime: number;
}) {
  const now = new Date();
  const remainingTime = expiresAt.getTime() - now.getTime();

  return remainingTime >= othersCallsTime * 1000;
}
