import { getJobKey, getJobName } from "@/jobs/helpers";

export const getNominationExpiryJobName = () => getJobName("nomination-expiry");

export const getNominationExpiryKey = (nominationId: string) =>
  getJobKey(nominationId, getNominationExpiryJobName());
