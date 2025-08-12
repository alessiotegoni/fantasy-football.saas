import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  smallint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { auctionNominations } from "./auctionNominations";
import { splits } from "./splits";
import { auctionSettings } from "./auctionSettings";

export const auctionTypes = ["classic", "repair"] as const;
export const auctionStatuses = [
  "waiting",
  "active",
  "paused",
  "ended",
] as const;

export type AuctionType = (typeof auctionTypes)[number];
export type AuctionStatus = (typeof auctionStatuses)[number];

export const auctionStatusEnum = pgEnum("auction_status", auctionStatuses);
export const auctionTypeEnum = pgEnum("auction_type", auctionTypes);

export const auctions = pgTable("auctions", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  splitId: smallint("split_id")
    .notNull()
    .references(() => splits.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  description: text("description"),
  type: auctionTypeEnum("type").notNull().default("classic"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
  status: auctionStatusEnum("status").notNull().default("waiting"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  league: one(leagues, {
    fields: [auctions.leagueId],
    references: [leagues.id],
  }),
  split: one(splits, {
    fields: [auctions.splitId],
    references: [splits.id],
  }),
  creator: one(leagueMemberTeams, {
    fields: [auctions.createdBy],
    references: [leagueMemberTeams.id],
  }),
  nominations: many(auctionNominations),
  settings: many(auctionSettings),
}));
