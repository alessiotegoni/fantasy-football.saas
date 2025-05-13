import {
  pgTable,
  uuid,
  smallint,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { splitMatchdays } from "./splitMatchdays";

export const leagueMatchdayCalcStatuses = ["calculated", "cancelled"] as const;
export type LeagueMatchdayCalcStatuses =
  (typeof leagueMatchdayCalcStatuses)[number];

export const leagueMatchdayCalcStatusEnum = pgEnum(
  "league_matchday_calc_status",
  leagueMatchdayCalcStatuses
);

export const leagueMatchdayCalculations = pgTable(
  "league_matchday_calculations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leagueId: uuid("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    matchdayId: smallint("matchday_id")
      .notNull()
      .references(() => splitMatchdays.id, { onDelete: "restrict" }),
    calculatedAt: timestamp("calculated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    status: leagueMatchdayCalcStatusEnum("satus").notNull(),
  }
);

export const leagueMatchdayCalculationsRelations = relations(
  leagueMatchdayCalculations,
  ({ one }) => ({
    league: one(leagues, {
      fields: [leagueMatchdayCalculations.leagueId],
      references: [leagues.id],
    }),
    matchday: one(splitMatchdays, {
      fields: [leagueMatchdayCalculations.matchdayId],
      references: [splitMatchdays.id],
    }),
  })
);
