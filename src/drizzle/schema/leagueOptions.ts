import { pgTable, uuid, smallint, jsonb, check, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { leagues } from "./leagues";

type PlayersPerRole = Record<string, number>;
type AvailableTacticalModules = number[];
type CustomBonusMalus = Record<string, number>;

export const leagueOptions = pgTable(
  "league_options",
  {
    leagueId: uuid("league_id")
      .primaryKey()
      .references(() => leagues.id, { onDelete: "cascade" }),
    initialCredits: smallint("initial_credits").notNull().default(500),
    playersPerRole: jsonb("players_per_role")
      .notNull()
      .default('{"1": 2, "2": 3, "3": 4, "4": 3, "5": 1}')
      .$type<PlayersPerRole>(),
    availableTacticalModules: jsonb("available_tactical_modules")
      .notNull()
      .default("[1, 2, 3, 4]")
      .$type<AvailableTacticalModules>(),
    customBonusMalus: jsonb("custom_bonus_malus")
      .notNull()
      .default(
        '{"1": 2, "2": 3, "3": -2, "4": 1, "5": 2, "6": -2, "7": 3, "8": -3, "9": 3, "10": -3, "11": -1, "12": -3, "13": 2, "14": -1, "15": 2, "16": 2, "17": 3}'
      )
      .$type<CustomBonusMalus>(),
    maxMembers: smallint("max_members").notNull().default(20),
    isTradingMarketOpen: boolean("trading_market_open").notNull().default(false)
  },
  () => ({
    leaguesInitialCreditsCheck: check(
      "leagues_initialCredits_check",
      sql`(initial_credits >= 200) and (initial_credits <= 5000)`
    ),
    leagueOptionsMaxMembersCheck: check(
      "league_options_max_members_check",
      sql`(max_members >= 4) and (max_members <= 12)`
    ),
  })
);

export const leagueOptionsRelations = relations(leagueOptions, ({ one }) => ({
  league: one(leagues, {
    fields: [leagueOptions.leagueId],
    references: [leagues.id],
  }),
}));
