import {
  boolean,
  jsonb,
  pgTable,
  smallint,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { auctions } from "./auctions";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { relations, sql } from "drizzle-orm";

export const auctionParticipants = pgTable(
  "auction_participants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auctionId: uuid("auction_id")
      .notNull()
      .references(() => auctions.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => leagueMemberTeams.id, {
      onDelete: "set null",
    }),
    credits: smallint("credits").notNull(),
    isOnline: boolean("is_online").default(true).notNull(),
    order: smallint("order").notNull(),
    isCurrent: boolean("is_current").default(false).notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      auctionIdTeamIdKey: uniqueIndex(
        "auction_participants_auction_id_team_id_key"
      ).on(table.auctionId, table.teamId),
      idxAuctionParticipantsSingleCurrent: uniqueIndex(
        "idx_auction_participants_single_current"
      )
        .on(table.auctionId)
        .where(sql`is_current = true`),
      idxAuctionParticipantsAuctionId: uniqueIndex(
        "idx_auction_participants_auction_id"
      ).on(table.auctionId),
      idxAuctionParticipantsTeamId: uniqueIndex(
        "idx_auction_participants_team_id"
      ).on(table.teamId),
    };
  }
);

export const auctionParticipantsRelations = relations(
  auctionParticipants,
  ({ one }) => ({
    auction: one(auctions, {
      fields: [auctionParticipants.auctionId],
      references: [auctions.id],
    }),
    team: one(leagueMemberTeams, {
      fields: [auctionParticipants.teamId],
      references: [leagueMemberTeams.id],
    }),
  })
);