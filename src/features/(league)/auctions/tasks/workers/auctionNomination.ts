import { getNomination } from "@/features/(league)/auctions/queries/auctionNomination";
import { getHighestBid } from "@/features/(league)/auctions/queries/auctionBid";
import {
  getNominationExpiryJobName,
  NominationExpiryJobData,
} from "../jobs/auctionNomination";
import { boss } from "@/lib/pg-boss";
import { updateNomination } from "../../db/auctionNomination";
import { db } from "@/drizzle/db";
import { insertAcquisition } from "../../db/auctionAcquisition";
import { WorkHandler } from "pg-boss";
import {
  auctionAcquisitions,
  auctionBids,
  auctionNominations,
  auctionSettings,
} from "@/drizzle/schema";
import {
  getAuctionParticipants,
  getParticipantPlayersCountByRole,
} from "../../queries/auctionParticipant";
import { isRoleFull } from "../../utils/auctionParticipant";
import { setAuctionTurn } from "../../db/auctionParticipant";

const handler: WorkHandler<NominationExpiryJobData> = async ([job]) => {
  const {
    nomination,
    auctionSettings: { playersPerRole },
    player,
  } = job.data;

  if (!nomination || nomination.status !== "bidding") return;

  const highestBid = await getHighestBid(nomination.id);

  await db.transaction(async (tx) => {
    const acquisitionData = getAcquisitionData(nomination, highestBid);

    await insertAcquisition(acquisitionData, tx);
    await updateNomination(nomination.id, { status: "sold" }, tx);

    const participants = await getAuctionParticipants(nomination.auctionId);
    if (!participants.length) return;

    const currentIndex = participants.findIndex((p) => p.isCurrent);
    let nextIndex = (currentIndex + 1) % participants.length;

    let nextParticipant = participants[nextIndex];
    let attempts = 0;

    while (attempts < participants.length) {
      const playerCounts = await getParticipantPlayersCountByRole(
        nomination.auctionId,
        nextParticipant.id,
        tx
      );
      if (!isRoleFull(playerCounts, playersPerRole, player.role.id)) {
        break;
      }
      nextIndex = (nextIndex + 1) % participants.length;
      nextParticipant = participants[nextIndex];
      attempts++;
    }

    if (attempts < participants.length) {
      await setAuctionTurn(nomination.auctionId, nextParticipant.id, tx);
    }
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
