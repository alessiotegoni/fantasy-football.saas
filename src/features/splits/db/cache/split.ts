import { getSplitsTag } from "@/cache/global";
import { revalidateTag } from "next/cache";

export const revalidateSplitsCache = () => revalidateTag(getSplitsTag());
