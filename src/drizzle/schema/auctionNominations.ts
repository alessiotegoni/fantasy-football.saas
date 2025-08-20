import {
  pgTable,
  uuid,
  smallint,
  pgEnum,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctions } from "./auctions";
import { players } from "./players";
import { auctionBids } from "./auctionBids";
import { auctionParticipants } from "./auctionParticipants";

export const auctionNominationStatuses = ["bidding", "sold"] as const;
export type NominationStatus = (typeof auctionNominationStatuses)[number];

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
    .references(() => auctionParticipants.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  initialPrice: smallint("initial_price").notNull().default(1),
  status: auctionNominationStatusEnum("status").notNull().default("bidding"),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auctionNominationsRelations = relations(
  auctionNominations,
  ({ one, many }) => ({
    auction: one(auctions, {
      fields: [auctionNominations.auctionId],
      references: [auctions.id],
    }),
    nominatedBy: one(auctionParticipants, {
      fields: [auctionNominations.nominatedBy],
      references: [auctionParticipants.id],
    }),
    player: one(players, {
      fields: [auctionNominations.playerId],
      references: [players.id],
    }),
    bids: many(auctionBids),
  })
);
