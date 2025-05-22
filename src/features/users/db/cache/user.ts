import { getuserTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type USER_TAG = "user-leagues" | "user-email";

export const getUserLeaguesTag = (userId: string) =>
  getuserTag("user-leagues", userId);

export const getUserEmailTag = (userId: string) =>
  getuserTag("user-email", userId);

export const revalidateUserLeagues = (userId: string) =>
  revalidateTag(getUserLeaguesTag(userId));
