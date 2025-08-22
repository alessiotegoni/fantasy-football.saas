import { getJobKey, getJobName } from "@/jobs/helpers";
import { boss } from "@/lib/pg-boss";
import { auctionSettings } from "@/drizzle/schema";

export const getNominationExpiryJobName = () => getJobName("nomination-expiry");

export const getNominationExpiryKey = (nominationId: string) =>
  getJobKey(nominationId, getNominationExpiryJobName());

export async function scheduleExpiryJob(
  data: {
    nominationId: string;
    auctionSettings: Omit<typeof auctionSettings.$inferSelect, "auctionId">
  },
  startAfter: Date
) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(data.nominationId);

  await boss.send(name, data, { startAfter, singletonKey: key });
}

export async function cancelExpiryJob(nominationId: string) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(nominationId);

  await boss.cancel(name, key);
}
