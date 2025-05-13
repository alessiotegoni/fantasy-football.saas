import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { auctionNominations } from "./auctionNominations";

export const auctionTypes = ["waiting", "active", "paused", "ended"] as const;
export type AuctionType = (typeof auctionTypes)[number];

export const auctionTypesEnum = pgEnum("auction_types", auctionTypes);

export const auctions = pgTable("auctions", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }).notNull().defaultNow(),
  status: auctionTypesEnum("status").notNull().default("waiting"),
  name: text("name").notNull(),
  description: text("description"),
});

export const auctionsRelations = relations(auctions, ({ one, many }) => ({
  league: one(leagues, {
    fields: [auctions.leagueId],
    references: [leagues.id],
  }),
  creator: one(leagueMemberTeams, {
    fields: [auctions.createdBy],
    references: [leagueMemberTeams.id],
  }),
  nominations: many(auctionNominations),
}));
