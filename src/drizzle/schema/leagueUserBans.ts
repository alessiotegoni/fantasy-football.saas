import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { authUsers } from "drizzle-orm/supabase";

export const leagueUserBans = pgTable("league_user_bans", {
  id: uuid("id").primaryKey().defaultRandom(),
  leagueId: uuid("league_id")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  reason: text("reason"),
  bannedAt: timestamp("banned_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const leagueUserBansRelations = relations(leagueUserBans, ({ one }) => ({
  league: one(leagues, {
    fields: [leagueUserBans.leagueId],
    references: [leagues.id],
  }),
  user: one(authUsers, {
    fields: [leagueUserBans.userId],
    references: [authUsers.id],
  }),
}));
