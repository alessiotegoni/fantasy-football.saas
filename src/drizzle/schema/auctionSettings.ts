import { pgTable, uuid, smallint, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctions } from "./auctions";
import { PlayersPerRole } from "./leagueSettings";

export const auctionSettings = pgTable("auction_settings", {
  auctionId: uuid("auction_id")
    .primaryKey()
    .references(() => auctions.id, { onDelete: "cascade" }),
  firstCallTime: smallint("first_call_time").notNull().default(20),
  otherCallsTime: smallint("others_calls_time").notNull().default(10),
  initialCredits: smallint("initial_credits").notNull().default(500),
  playersPerRole: jsonb("players_per_role")
    .notNull()
    .default('{"2": 3, "3": 4, "4": 3, "5": 1}')
    .$type<PlayersPerRole>(),
});

export const auctionsRelations = relations(auctionSettings, ({ one }) => ({
  auction: one(auctions, {
    fields: [auctionSettings.auctionId],
    references: [auctions.id],
  }),
}));
