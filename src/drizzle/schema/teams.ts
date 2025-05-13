import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teamPresidents } from "./presidents";
import { players } from "./players";
import { leagueMatchResults } from "./leagueMatchResults";

export const teams = pgTable("teams", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamPresidents: many(teamPresidents),
  players: many(players),
  matchResults: many(leagueMatchResults),
}));
