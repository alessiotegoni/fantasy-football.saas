import { pgTable, smallint, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splits, splitStatusEnum } from "./splits";
import { leagueMatches } from "./leagueMatches";
import { leagueMatchdayCalculations } from "./leagueMatchdayCalculations";

export const splitMatchdays = pgTable("split_matchdays", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  splitId: smallint("split_id")
    .notNull()
    .references(() => splits.id, { onDelete: "restrict" }),
  number: smallint("number").notNull().default(1),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  status: splitStatusEnum("status").notNull().default("upcoming"),
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
