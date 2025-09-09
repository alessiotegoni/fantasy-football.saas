import { pgTable, smallint, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splits } from "./splits";
import { leagueMatches } from "./leagueMatches";
import { leagueMatchdayCalculations } from "./leagueMatchdayCalculations";
import { pgEnum } from "drizzle-orm/pg-core";

export const matchdayTypes = [
  "regular",
  "play_in",
  "quarter_final",
  "semi_final",
  "final",
] as const;

export type MatchdayType = (typeof matchdayTypes)[number];
export const matchdayTypeEnum = pgEnum("matchday_type", matchdayTypes);

export const splitMatchdayStatusEnum = pgEnum("split_matchday_status", [
  "upcoming",
  "live",
  "ended",
]);

export const splitMatchdays = pgTable("split_matchdays", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  splitId: smallint("split_id")
    .notNull()
    .references(() => splits.id, { onDelete: "restrict" }),
  number: smallint("number").notNull().default(1),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  status: splitMatchdayStatusEnum("status").notNull().default("upcoming"),
  type: matchdayTypeEnum("type").notNull().default("regular"),
});

export const splitMatchdaysRelations = relations(
  splitMatchdays,
  ({ one, many }) => ({
    split: one(splits, {
      fields: [splitMatchdays.splitId],
      references: [splits.id],
    }),
    votes: many(splitMatchdays),
    leagueMatches: many(leagueMatches),
    leagueMatchdayCalculations: many(leagueMatchdayCalculations),
  })
);
