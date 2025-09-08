import { getSplitsMatchdaysTag, getSplitsTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export const getSplitIdTag = (splitId: number) =>
  getIdTag("splits", splitId.toString());

export const getSplitMatchdaysIdTag = (matchdayId: number) =>
  getIdTag("splits-matchdays", matchdayId.toString());

export const revalidateSplitsCache = (splitId: number) => {
  revalidateTag(getSplitsTag());
  revalidateTag(getSplitIdTag(splitId));
};

export const revalidateSplitMatchdaysCache = (matchdayId: number) => {
  revalidateTag(getSplitsMatchdaysTag());
  revalidateTag(getSplitMatchdaysIdTag(matchdayId));
};
