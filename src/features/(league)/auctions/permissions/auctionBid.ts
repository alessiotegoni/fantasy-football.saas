import { createError, createSuccess } from "@/utils/helpers";
import { CreateBidSchema } from "../schema/auctionBid";
import { getNomination } from "../queries/auctionNomination";
import { baseAuctionPermissions, validatePlayerAndCredits } from "./shared";
import { getHighestBid } from "../queries/auctionBid";
import { isTimeExpired } from "../utils/auctionBid";

enum BID_ERRORS {
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  BID_TOO_LOW = "La tua offerta è troppo bassa",
  NOMINATION_EXPIRED = "Nomina gia scaduta",
}

export async function canCreateBid({ nominationId, amount }: CreateBidSchema) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(BID_ERRORS.NOMINATION_NOT_FOUND);
  }

  const permissions = await baseAuctionPermissions(nomination.auctionId);
  if (permissions.error) return permissions;

  const { participant, auction } = permissions.data;

  // const highestBid = await getHighestBid(nominationId);
  // const minBid = highestBid ? highestBid.amount + 1 : nomination.initialPrice;

  // if (amount < minBid) {
  //   return createError(BID_ERRORS.BID_TOO_LOW);
  // }

  const playerAndCreditValidation = await validatePlayerAndCredits({
    playerId: nomination.playerId,
    auctionId: auction.id,
    participantId: participant.id,
    bidAmount: amount,
    participantCredits: participant.credits,
  });

  if (playerAndCreditValidation.error) return playerAndCreditValidation;

  if (
    isTimeExpired({
      ...nomination,
      ...playerAndCreditValidation.data.auctionSettings,
    })
  ) {
    return createError(BID_ERRORS.NOMINATION_EXPIRED);
  }

  return createSuccess("", {
    participant,
    nomination,
    ...playerAndCreditValidation.data,
  });
}
