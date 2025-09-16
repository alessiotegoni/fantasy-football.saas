import { db } from "@/drizzle/db";
import { redactions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getRedaction(id: string) {
  const [res] = await db.select().from(redactions).where(eq(redactions.id, id));

  return res;
}

export type Redaction = typeof redactions.$inferSelect;
