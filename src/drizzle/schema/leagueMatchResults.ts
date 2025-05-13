import {
  pgTable,
  uuid,
  smallint,
  numeric,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMatches } from "./leagueMatches";
import { leagueMemberTeams } from "./leagueMemberTeams";

export const leagueMatchResults = pgTable(
  "league_match_results",
  {
    leagueMatchId: uuid("league_match_id")
      .primaryKey()
      .references(() => leagueMatches.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
    points: smallint("points").notNull(),
    totalScore: numeric("total_score").notNull(),
  },
  (table) => ({
    uniqueMatchTeamPerLeague: uniqueIndex("unique_match_team_per_league").on(
      table.leagueMatchId,
      table.teamId
    ),
  })
);

export const leagueMatchResultsRelations = relations(
  leagueMatchResults,
  ({ one }) => ({
    leagueMatch: one(leagueMatches, {
      fields: [leagueMatchResults.leagueMatchId],
      references: [leagueMatches.id],
    }),
    team: one(leagueMemberTeams, {
      fields: [leagueMatchResults.teamId],
      references: [leagueMemberTeams.id],
    }),
  })
);
