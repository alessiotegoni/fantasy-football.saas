import { getUserId } from "@/features/users/utils/user";
import { getAuction } from "../queries/auction";
import { createError, createSuccess } from "@/lib/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { getLeagueAdmin } from "../../leagues/queries/league";
import { getNomination } from "../queries/auctionNomination";
import { AUCTION_PERMISSION_ERRORS } from "./shared";
import { getAcquisition } from "../queries/auctionAcquisition";

enum ACQUISITION_ERRORS {
  NOMINATION_NOT_FOUND = "Nomina non trovata",
  NOMINATION_ALREADY_SOLD = "Questo giocatore è già stato venduto",
  ACQUISITION_NOT_FOUND = "Acquisto non trovato",
  ADMIN_REQUIRED = "Solo un admin può eseguire questa azione",
}

export async function canAcquirePlayer(nominationId: string) {
  const nomination = await getNomination(nominationId);
  if (!nomination) {
    return createError(ACQUISITION_ERRORS.NOMINATION_NOT_FOUND);
  }

  if (nomination.status === "sold") {
    return createError(ACQUISITION_ERRORS.NOMINATION_ALREADY_SOLD);
  }

  const adminPermissions = await basePermissions(nomination.auctionId);
  if (adminPermissions.error) return adminPermissions;

  return createSuccess("", {
    nomination,
    auction: adminPermissions.data.auction,
  });
}

export async function canDeleteAcquisition(acquisitionId: string) {
  const acquisition = await getAcquisition(acquisitionId);
  if (!acquisition) {
    return createError(ACQUISITION_ERRORS.ACQUISITION_NOT_FOUND);
  }

  const adminPermissions = await basePermissions(acquisition.auctionId);
  if (adminPermissions.error) return adminPermissions;

  return createSuccess("", { acquisition });
}

async function basePermissions(auctionId: string) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const auction = await getAuction(auctionId);
  if (!auction) {
    return createError(AUCTION_PERMISSION_ERRORS.AUCTION_NOT_FOUND);
  }

  const isLeagueAdmin = await getLeagueAdmin(userId, auction.leagueId);
  if (!isLeagueAdmin) {
    return createError(ACQUISITION_ERRORS.ADMIN_REQUIRED);
  }

  return createSuccess("", { auction, userId });
}
