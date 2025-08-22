import { getJobKey, getJobName } from "@/jobs/helpers";
import { boss } from "@/lib/pg-boss";

export const getNominationExpiryJobName = () => getJobName("nomination-expiry");

export const getNominationExpiryKey = (nominationId: string) =>
  getJobKey(nominationId, getNominationExpiryJobName());

export async function scheduleExpiryJob(
  nominationId: string,
  startAfter: Date,
) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(nominationId);

  await boss.send(name, { nominationId }, { startAfter, singletonKey: key });
}

export async function cancelExpiryJob(nominationId: string) {
  const name = getNominationExpiryJobName();
  const key = getNominationExpiryKey(nominationId);

  await boss.cancel(name, key);
}
