import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { players } from "./players";
import { leagueMatchResults } from "./leagueMatchResults";

export const teams = pgTable("teams", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  matchResults: many(leagueMatchResults),
}));
