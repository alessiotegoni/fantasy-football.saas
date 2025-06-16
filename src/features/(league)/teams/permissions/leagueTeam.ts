import { db } from "@/drizzle/db";
import { leagueMemberTeams } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";

export async function memberHasTeam(memberId: string) {
  const [res] = await db
    .select({ count: count() })
    .from(leagueMemberTeams)
    .where(eq(leagueMemberTeams.leagueMemberId, memberId));

  return res.count === 1;
}
