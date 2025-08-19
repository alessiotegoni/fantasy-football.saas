import { pgTable, uuid, smallint, pgEnum, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctions } from "./auctions";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { players } from "./players";
import { auctionBids } from "./auctionBids";

export const auctionNominationStatuses = ["bidding", "sold"] as const;
export const auctionNominationStatusEnum = pgEnum(
  "auction_nomination_status",
  auctionNominationStatuses
);

export const auctionNominations = pgTable("auction_nominations", {
  id: uuid("id").defaultRandom().primaryKey(),
  auctionId: uuid("auction_id")
    .notNull()
    .references(() => auctions.id, { onDelete: "cascade" }),
  nominatedBy: uuid("nominated_by")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "set null" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  initialPrice: smallint("initial_price").notNull().default(1),
  status: auctionNominationStatusEnum("status").notNull().default("bidding"),
});

export const auctionNominationsRelations = relations(
  auctionNominations,
  ({ one, many }) => ({
    auction: one(auctions, {
      fields: [auctionNominations.auctionId],
      references: [auctions.id],
    }),
    nominatedByTeam: one(leagueMemberTeams, {
      fields: [auctionNominations.nominatedBy],
      references: [leagueMemberTeams.id],
    }),
    player: one(players, {
      fields: [auctionNominations.playerId],
      references: [players.id],
    }),
    bids: many(auctionBids),
  })
);
