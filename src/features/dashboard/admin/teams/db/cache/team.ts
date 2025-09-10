import { revalidateTag } from "next/cache";
import { getTeamsTag } from "@/cache/global";

export const revalidateTeamsCache = () => {
  revalidateTag(getTeamsTag());
}
