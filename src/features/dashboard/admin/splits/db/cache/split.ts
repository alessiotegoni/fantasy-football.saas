import { getSplitsMatchdaysTag, getSplitsTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export const getSplitIdTag = (splitId: number) =>
  getIdTag("splits", splitId.toString());

export const getSplitMatchdaysIdTag = (matchdayId: number) =>
  getIdTag("splits-matchdays", matchdayId.toString());

export const revalidateSplitsCache = (splitId: number) => {
  updateTag(getSplitsTag());
  updateTag(getSplitIdTag(splitId));
};

export const revalidateSplitMatchdaysCache = (matchdayId: number) => {
  updateTag(getSplitsMatchdaysTag());
  updateTag(getSplitMatchdaysIdTag(matchdayId));
};
