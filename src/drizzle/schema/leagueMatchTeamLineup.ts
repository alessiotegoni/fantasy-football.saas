import { pgTable, uuid, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMatches } from "./leagueMatches";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { tacticalModules } from "./tacticalModules";

export const leagueMatchTeamLineup = pgTable("league_match_team_lineup", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueMatchId: uuid("league_match_id")
    .notNull()
    .references(() => leagueMatches.id, { onDelete: "cascade" }),
  leagueMemberTeamId: uuid("league_member_team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  tacticalModuleId: smallint("tactical_module_id")
    .notNull()
    .references(() => tacticalModules.id, { onDelete: "restrict" }),
});

export const leagueMatchTeamLineupRelations = relations(
  leagueMatchTeamLineup,
  ({ one }) => ({
    leagueMatch: one(leagueMatches, {
      fields: [leagueMatchTeamLineup.leagueMatchId],
      references: [leagueMatches.id],
    }),
    team: one(leagueMemberTeams, {
      fields: [leagueMatchTeamLineup.leagueMemberTeamId],
      references: [leagueMemberTeams.id],
    }),
    tacticalModule: one(tacticalModules, {
      fields: [leagueMatchTeamLineup.tacticalModuleId],
      references: [tacticalModules.id],
    }),
  })
);
