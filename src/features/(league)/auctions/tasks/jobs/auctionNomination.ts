import { getJobKey, getJobName } from "@/jobs/helpers";
import { boss } from "@/lib/pg-boss";
import {
  auctionNominations,
  auctionSettings,
  PlayersPerRole,
} from "@/drizzle/schema";

export const getNominationExpiryJobName = () => getJobName("nomination-expiry");

export const getNominationExpiryKey = (nominationId: string) =>
  getJobKey(nominationId, getNominationExpiryJobName());

export type NominationExpiryJobData = {
  nomination: typeof auctionNominations.$inferSelect;
  auctionSettings: typeof auctionSettings.$inferSelect;
  player: { role: { id: number } };
};

export async function scheduleExpiryJob(
  data: NominationExpiryJobData,
  startAfter: Date
) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(data.nomination.id);

  await boss.send(name, data, { startAfter, singletonKey: key });
}

export async function cancelExpiryJob(nominationId: string) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(nominationId);

  await boss.cancel(name, key);
}
