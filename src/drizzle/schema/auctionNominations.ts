import {
  pgTable,
  uuid,
  smallint,
  timestamp,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
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
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  playerId: uuid("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  initialPrice: smallint("initial_price").notNull().default(1),
  finalPrice: smallint("final_price"),
  winningTeamId: uuid("winning_team_id").references(
    () => leagueMemberTeams.id,
    { onDelete: "cascade" }
  ),
  status: auctionNominationStatusEnum("status").notNull().default("bidding"),
  endAt: timestamp("end_at", { withTimezone: true })
    .notNull()
    .default(sql`now() + '00:00:25'::interval`),
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
    winningTeam: one(leagueMemberTeams, {
      fields: [auctionNominations.winningTeamId],
      references: [leagueMemberTeams.id],
    }),
    bids: many(auctionBids),
  })
);
