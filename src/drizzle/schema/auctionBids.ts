import { pgTable, uuid, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auctionNominations } from "./auctionNominations";
import { leagueMemberTeams } from "./leagueMemberTeams";

export const auctionBids = pgTable("auction_bids", {
  auctionNominationId: uuid("auction_nomination_id")
    .primaryKey()
    .references(() => auctionNominations.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  amount: smallint("amount").notNull().default(2),
});

export const auctionBidsRelations = relations(auctionBids, ({ one }) => ({
  auctionNomination: one(auctionNominations, {
    fields: [auctionBids.auctionNominationId],
    references: [auctionNominations.id],
  }),
  team: one(leagueMemberTeams, {
    fields: [auctionBids.teamId],
    references: [leagueMemberTeams.id],
  }),
}));

// TODO: aggiungere che se allo scadere del timer la nominations e' sold si eliminano
// tutte le tabelle delle bids di quella nomination
