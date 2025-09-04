import {
  pgTable,
  text,
  smallint,
  primaryKey,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splitMatchdays } from "./splitMatchdays";

export const splitStatuses = ["upcoming", "live", "ended"] as const;
export type SplitStatusType = (typeof splitStatuses)[number];

export const splitStatusEnum = pgEnum("split_status", splitStatuses);

export const splits = pgTable("splits", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: splitStatusEnum("status").notNull().default("upcoming"),
});

export const splitRelations = relations(splits, ({ many }) => ({
  matchdays: many(splitMatchdays),
}));
