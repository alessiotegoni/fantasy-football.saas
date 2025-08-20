import { createError, createSuccess } from "@/lib/helpers";
import { CreateBidSchema } from "../schema/auctionBid";
import { getNomination } from "../queries/auctionNomination";
import { db } from "@/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { auctionBids } from "@/drizzle/schema";
import { baseAuctionPermissions, validatePlayerAndCredits } from "./shared";

enum BID_ERRORS {
  INSUFFICENT_CREDITS = "Non hai abbastanza crediti",
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  BID_TOO_LOW = "La tua offerta è troppo bassa",
}

export async function canCreateBid({ nominationId, amount }: CreateBidSchema) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(BID_ERRORS.NOMINATION_NOT_FOUND);
  }

  const permissions = await baseAuctionPermissions(nomination.auctionId);
  if (permissions.error) return permissions;

  const { participant, auction } = permissions.data;

  const highestBid = await getHighestBid(nominationId);
  const minBid = highestBid ? highestBid.amount + 1 : nomination.initialPrice;

  if (amount < minBid) {
    return createError(BID_ERRORS.BID_TOO_LOW);
  }

  const playerAndCreditValidation = await validatePlayerAndCredits({
    playerId: nomination.playerId,
    auctionId: auction.id,
    participantId: participant.id,
    bidAmount: amount,
    currentCredits: participant.credits,
  });

  if (playerAndCreditValidation.error) return playerAndCreditValidation;

  return createSuccess("", { participant });
}

async function getHighestBid(nominationId: string) {
  const [highestBid] = await db
    .select()
    .from(auctionBids)
    .where(eq(auctionBids.nominationId, nominationId))
    .orderBy(desc(auctionBids.amount))
    .limit(1);

  return highestBid;
}
