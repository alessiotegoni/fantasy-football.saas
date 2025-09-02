import { pgTable, uuid, smallint, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctionNominations } from "./auctionNominations";
import { auctionParticipants } from "./auctionParticipants";

export const auctionBids = pgTable("auction_bids", {
  id: uuid("id").defaultRandom().primaryKey(),
  nominationId: uuid("nomination_id")
    .notNull()
    .references(() => auctionNominations.id, { onDelete: "cascade" }),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => auctionParticipants.id, { onDelete: "cascade" }),
  amount: smallint("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auctionBidsRelations = relations(auctionBids, ({ one }) => ({
  nomination: one(auctionNominations, {
    fields: [auctionBids.nominationId],
    references: [auctionNominations.id],
  }),
  participant: one(auctionParticipants, {
    fields: [auctionBids.participantId],
    references: [auctionParticipants.id],
  }),
}));
