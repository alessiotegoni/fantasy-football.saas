import { pgTable, uuid, smallint, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMatches } from "./leagueMatches";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { tacticalModules } from "./tacticalModules";

export const leagueMatchTeamLineup = pgTable("league_match_team_lineup", {
  id: uuid("id").defaultRandom().primaryKey(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => leagueMatches.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
  tacticalModuleId: smallint("tactical_module_id")
    .notNull()
    .references(() => tacticalModules.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const leagueMatchTeamLineupRelations = relations(
  leagueMatchTeamLineup,
  ({ one }) => ({
    leagueMatch: one(leagueMatches, {
      fields: [leagueMatchTeamLineup.matchId],
      references: [leagueMatches.id],
    }),
    team: one(leagueMemberTeams, {
      fields: [leagueMatchTeamLineup.teamId],
      references: [leagueMemberTeams.id],
    }),
    tacticalModule: one(tacticalModules, {
      fields: [leagueMatchTeamLineup.tacticalModuleId],
      references: [tacticalModules.id],
    }),
  })
);
