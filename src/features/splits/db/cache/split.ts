import { getSplitsMatchdaysTag, getSplitsTag } from "@/cache/global";
import { getIdTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export const getSplitMatchdayIdTag = (splitId: number) =>
  getIdTag("split-matchdays", splitId.toString());

export const revalidateSplitsCache = () => revalidateTag(getSplitsTag());

export const revalidateSplitMatchdaysCache = (splitId: number) => {
  revalidateTag(getSplitsMatchdaysTag());
  revalidateTag(getSplitMatchdayIdTag(splitId));
};
