import { pgTable, uuid, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import { teams } from "./teams";

export const redactions = pgTable("redactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  teamId: smallint("team_id").references(() => teams.id, {
    onDelete: "cascade",
  }),
});

export const redactionsRelations = relations(redactions, ({ one }) => ({
  user: one(authUsers, {
    fields: [redactions.userId],
    references: [authUsers.id],
  }),
  team: one(teams, {
    fields: [redactions.teamId],
    references: [teams.id],
  }),
}));
