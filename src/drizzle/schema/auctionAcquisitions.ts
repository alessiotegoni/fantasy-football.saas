import {
  integer,
  pgTable,
  smallint,
  timestamp,
  unique,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { auctions } from "./auctions";
import { auctionParticipants } from "./auctionParticipants";
import { players } from "./players";
import { relations } from "drizzle-orm";

export const auctionAcquisitions = pgTable(
  "auction_acquisitions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auctionId: uuid("auction_id")
      .notNull()
      .references(() => auctions.id, { onDelete: "cascade" }),
    participantId: uuid("participant_id")
      .notNull()
      .references(() => auctionParticipants.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    price: smallint("price").notNull(),
    acquiredAt: timestamp("acquired_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    auctionIdParticipantIdPlayerIdKey: unique(
      "auction_acquisitions_auction_id_participant_id_player_id_key"
    ).on(table.auctionId, table.participantId, table.playerId),
    idxAuctionId: index("idx_auction_acquisitions_auction_id").on(
      table.auctionId
    ),
    idxParticipantId: index("idx_auction_acquisitions_participant_id").on(
      table.participantId
    ),
    idxPlayerId: index("idx_auction_acquisitions_player_id").on(table.playerId),
  })
);

export const auctionAcquisitionsRelations = relations(
  auctionAcquisitions,
  ({ one }) => ({
    auction: one(auctions, {
      fields: [auctionAcquisitions.auctionId],
      references: [auctions.id],
    }),
    participant: one(auctionParticipants, {
      fields: [auctionAcquisitions.participantId],
      references: [auctionParticipants.id],
    }),
    player: one(players, {
      fields: [auctionAcquisitions.playerId],
      references: [players.id],
    }),
  })
);
