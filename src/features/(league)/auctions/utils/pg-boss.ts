import { getBoss } from "@/lib/pg-boss";
import {
  getNominationExpiryJobName,
  getNominationExpiryKey,
} from "../jobs/auctionNomination";

export async function scheduleExpiryJob(
  nominationId: string,
  expiresAt: Date
) {
  const boss = getBoss();
  const jobId = getNominationExpiryJobName();
  const key = getNominationExpiryKey(nominationId);

  await boss.send(jobId, { nominationId }, { startAfter: expiresAt, singletonKey: key });
}

export async function cancelExpiryJob(nominationId: string) {
  const boss = getBoss();
  const key = getNominationExpiryKey(nominationId);

  await boss.cancel(key);
}
