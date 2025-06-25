import {
  pgTable,
  uuid,
  smallint,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { leagueTradeProposalPlayers } from "./leagueTradeProposalPlayers";

export const tradeProposalStatuses = [
  "pending",
  "accepted",
  "rejected",
] as const
export type TradeProposalStatusType = (typeof tradeProposalStatuses)[number];

export const tradeProposalStatusEnum = pgEnum(
  "trade_proposal_status",
  tradeProposalStatuses
);

export const leagueTradeProposals = pgTable("league_trade_proposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueId: uuid("league_id")
    .notNull()
    .references(() => leagues.id, { onDelete: "cascade" }),
  proposerTeamId: uuid("proposer_team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  receiverTeamId: uuid("receiver_team_id")
    .notNull()
    .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
  creditOfferedByProposer: smallint("credit_offered_by_proposer"),
  creditRequestedByProposer: smallint("credit_requested_by_proposer"),
  status: tradeProposalStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const leagueTradeProposalsRelations = relations(
  leagueTradeProposals,
  ({ one, many }) => ({
    league: one(leagues, {
      fields: [leagueTradeProposals.leagueId],
      references: [leagues.id],
    }),
    proposerTeam: one(leagueMemberTeams, {
      fields: [leagueTradeProposals.proposerTeamId],
      references: [leagueMemberTeams.id],
    }),
    receiverTeam: one(leagueMemberTeams, {
      fields: [leagueTradeProposals.receiverTeamId],
      references: [leagueMemberTeams.id],
    }),
    proposalPlayers: many(leagueTradeProposalPlayers),
  })
);
