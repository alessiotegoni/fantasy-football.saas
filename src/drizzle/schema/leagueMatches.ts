import { pgTable, uuid, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splitMatchdays } from "./splitMatchdays";
import { leagues } from "./leagues";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { leagueMatchResults } from "./leagueMatchResults";

export const leagueMatches = pgTable(
  "league_matches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    splitMatchdayId: smallint("split_matchday_id")
      .notNull()
      .references(() => splitMatchdays.id, { onDelete: "restrict" }),
    leagueId: uuid("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    homeTeamId: uuid("home_team_id")
      .notNull()
      .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
    awayTeamId: uuid("away_team_id")
      .notNull()
      .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
  },
  (table) => ({
    oneMatchPerAwayTeamPerDay: uniqueIndex(
      "one_match_per_away_team_per_day"
    ).on(table.splitMatchdayId, table.awayTeamId),
    oneMatchPerHomeTeamPerDay: uniqueIndex(
      "one_match_per_home_team_per_day"
    ).on(table.splitMatchdayId, table.homeTeamId),
    uniqueTeamsPerDay: uniqueIndex("unique_teams_per_day").on(
      table.splitMatchdayId,
      table.homeTeamId,
      table.awayTeamId
    ),
  })
);

export const leagueMatchesRelations = relations(leagueMatches, ({ one, many }) => ({
  splitMatchday: one(splitMatchdays, {
    fields: [leagueMatches.splitMatchdayId],
    references: [splitMatchdays.id],
  }),
  league: one(leagues, {
    fields: [leagueMatches.leagueId],
    references: [leagues.id],
  }),
  homeTeam: one(leagueMemberTeams, {
    fields: [leagueMatches.homeTeamId],
    references: [leagueMemberTeams.id],
  }),
  awayTeam: one(leagueMemberTeams, {
    fields: [leagueMatches.awayTeamId],
    references: [leagueMemberTeams.id],
  }),
  matchResults: many(leagueMatchResults)
}));
