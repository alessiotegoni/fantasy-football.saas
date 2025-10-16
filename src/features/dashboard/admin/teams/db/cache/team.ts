import { updateTag } from "next/cache";
import { getTeamsTag } from "@/cache/global";

export const revalidateTeamsCache = () => {
  updateTag(getTeamsTag());
}
