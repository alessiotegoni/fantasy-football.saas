import {
  pgTable,
  uuid,
  smallint,
  jsonb,
  check,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { leagues } from "./leagues";

export type PlayersPerRole = Record<string, number>;
export type AvailableTacticalModules = number[];
export type CustomBonusMalus = Record<string, number>;
export type GoalThresholdSettings = {
  base: number;
  interval: number;
};

export const leagueSettings = pgTable(
  "league_settings",
  {
    leagueId: uuid("league_id")
      .primaryKey()
      .references(() => leagues.id, { onDelete: "cascade" }),
    initialCredits: smallint("initial_credits").notNull().default(500),
    playersPerRole: jsonb("players_per_role")
      .notNull()
      .default('{"2": 3, "3": 4, "4": 3, "5": 1}')
      .$type<PlayersPerRole>(),
    tacticalModules: jsonb("tactical_modules")
      .notNull()
      .default("[1, 2, 3, 4]")
      .$type<AvailableTacticalModules>(),
    customBonusMalus: jsonb("custom_bonus_malus")
      .notNull()
      .default(
        '{"1": 2, "2": 3, "3": -2, "4": 1, "5": 2, "6": -2, "7": 3, "8": -3, "9": 3, "10": -3, "11": -1, "12": -3, "13": 2, "14": -1, "15": 2, "16": 2, "17": 3}'
      )
      .$type<CustomBonusMalus>(),
    goalThresholdSettings: jsonb("goal_threshold_settings")
      .notNull()
      .default('{"base": 58, "interval": 6}')
      .$type<GoalThresholdSettings>(),

    maxMembers: smallint("max_members").notNull().default(20),
    isTradingMarketOpen: boolean("trading_market_open")
      .notNull()
      .default(false),
    releasePercentage: smallint("release_percentage").notNull().default(50),
  },
  () => ({
    leaguesInitialCreditsCheck: check(
      "leagues_initialCredits_check",
      sql`(initial_credits >= 200) and (initial_credits <= 5000)`
    ),
    leagueSettingsMaxMembersCheck: check(
      "league__max_members_check",
      sql`(max_members >= 4) and (max_members <= 12)`
    ),
  })
);

export const leagueSettingsRelations = relations(leagueSettings, ({ one }) => ({
  league: one(leagues, {
    fields: [leagueSettings.leagueId],
    references: [leagues.id],
  }),
}));
