import { pgTable, uuid, smallint, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctionNominations } from "./auctionNominations";
import { leagueMemberTeams } from "./leagueMemberTeams";

export const auctionBids = pgTable("auction_bids", {
  id: uuid("id").defaultRandom().primaryKey(),
  nominationId: uuid("nomination_id")
    .notNull()
    .references(() => auctionNominations.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  amount: smallint("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const auctionBidsRelations = relations(auctionBids, ({ one }) => ({
  auctionNomination: one(auctionNominations, {
    fields: [auctionBids.nominationId],
    references: [auctionNominations.id],
  }),
  team: one(leagueMemberTeams, {
    fields: [auctionBids.teamId],
    references: [leagueMemberTeams.id],
  }),
}));

// TODO: aggiungere che se allo scadere del timer la nominations è sold si eliminano
// tutte le tabelle delle bids di quella nomination
