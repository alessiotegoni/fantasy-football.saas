import {
  pgTable,
  uuid,
  boolean,
  index,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueTradeProposals } from "./leagueTradeProposals";
import { players } from "./players";

export const leagueTradeProposalPlayers = pgTable(
  "league_trade_proposal_players",
  {
    tradeProposalId: uuid("trade_proposal_id")
      .notNull()
      .references(() => leagueTradeProposals.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    offeredByProposer: boolean("offered_by_proposer").notNull(),
  },
  (table) => ({
    tradeProposalIdIndex: index("idx_trade_proposal_id").on(
      table.tradeProposalId
    ),
    uniqueTradePlayerPkey: primaryKey({
      name: "league_trade_proposal_players_pkey",
      columns: [table.tradeProposalId, table.playerId],
    }),
  })
);

export const leagueTradeProposalPlayersRelations = relations(
  leagueTradeProposalPlayers,
  ({ one }) => ({
    tradeProposal: one(leagueTradeProposals, {
      fields: [leagueTradeProposalPlayers.tradeProposalId],
      references: [leagueTradeProposals.id],
    }),
    player: one(players, {
      fields: [leagueTradeProposalPlayers.playerId],
      references: [players.id],
    }),
  })
);
