import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teams } from "./teams";

export const teamPresidents = pgTable("team_presidents", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  teamId: smallint("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  avatarUrl: text("avatar_url").notNull(),
});

export const teamPresidentsRelations = relations(teamPresidents, ({ one }) => ({
  team: one(teams, {
    fields: [teamPresidents.teamId],
    references: [teams.id],
  }),
}));
