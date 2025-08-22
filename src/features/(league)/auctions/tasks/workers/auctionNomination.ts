import { getNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import { getNominationExpiryJobName } from "../jobs/auctionNomination";
import { boss } from "@/lib/pg-boss";
import { updateNomination } from "../../db/auctionNomination";
import { db } from "@/drizzle/db";
import { insertAcquisition } from "../../db/auctionAcquisition";
import { Job, WorkHandler } from "pg-boss";

export async function registerNominationExpiryWorker() {
  const jobName = getNominationExpiryJobName();

  await boss.work(jobName, handler);
}

registerNominationExpiryWorker();

type NominationExpiryData = {
  nominationId: string;
};

const handler: WorkHandler<NominationExpiryData> = async ([job]) => {
  const { nominationId } = job.data;

  const nomination = await getNomination(nominationId);
  if (!nomination || nomination.status !== "bidding") return;

  const highestBid = await getHighestBid(nominationId);

  await db.transaction(async (tx) => {
    if (highestBid) {
      await insertAcquisition(
        {
          auctionId: nomination.auctionId,
          playerId: nomination.playerId,
          participantId: highestBid.participantId,
          price: highestBid.amount,
        },
        tx
      );
    } else {
      await insertAcquisition(
        {
          auctionId: nomination.auctionId,
          playerId: nomination.playerId,
          participantId: nomination.nominatedBy,
          price: nomination.initialPrice,
        },
        tx
      );
    }

    await updateNomination(nominationId, { status: "sold" }, tx);
  });
};
