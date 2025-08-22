import { getNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getNominationExpiryJobName } from "../jobs/auctionNomination";
import { boss } from "@/lib/pg-boss";
import { updateNomination } from "../../db/auctionNomination";
import { db } from "@/drizzle/db";
import { insertAcquisition } from "../../db/auctionAcquisition";
import { WorkHandler } from "pg-boss";
import {
  auctionAcquisitions,
  auctionBids,
  auctionNominations,
} from "@/drizzle/schema";

type NominationExpiryData = {
  nominationId: string;
};

const handler: WorkHandler<NominationExpiryData> = async ([job]) => {
  const { nominationId } = job.data;

  const nomination = await getNomination(nominationId);
  if (!nomination || nomination.status !== "bidding") return;

  const highestBid = await getHighestBid(nominationId);

  await db.transaction(async (tx) => {
    const acquisitionData = getAcquisitionData(nomination, highestBid);
    
    await insertAcquisition(acquisitionData, tx);
    await updateNomination(nominationId, { status: "sold" }, tx);
  });
};

function getAcquisitionData(
  nomination: typeof auctionNominations.$inferSelect,
  highestBid: typeof auctionBids.$inferSelect | undefined
): typeof auctionAcquisitions.$inferInsert {
  if (highestBid) {
    return {
      auctionId: nomination.auctionId,
      playerId: nomination.playerId,
      participantId: highestBid.participantId,
      price: highestBid.amount,
    };
  } else {
    return {
      auctionId: nomination.auctionId,
      playerId: nomination.playerId,
      participantId: nomination.nominatedBy,
      price: nomination.initialPrice,
    };
  }
}

export async function registerNominationExpiryWorker() {
  const jobName = getNominationExpiryJobName();

  await boss.work(jobName, handler);
}

registerNominationExpiryWorker();
