import { pgTable, uuid, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { players } from "./players";

export const leagueMemberTeamPlayers = pgTable(
  "league_member_team_players",
  {
    memberTeamId: uuid("member_team_id")
      .primaryKey()
      .references(() => leagueMemberTeams.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    purchaseCost: smallint("purchase_cost").notNull().default(1),
  },
  (table) => ({
    uniquePlayerInTeam: uniqueIndex("unique_player_in_team").on(
      table.memberTeamId,
      table.playerId
    ),
  })
);

export const leagueMemberTeamPlayersRelations = relations(
  leagueMemberTeamPlayers,
  ({ one }) => ({
    memberTeam: one(leagueMemberTeams, {
      fields: [leagueMemberTeamPlayers.memberTeamId],
      references: [leagueMemberTeams.id],
    }),
    player: one(players, {
      fields: [leagueMemberTeamPlayers.playerId],
      references: [players.id],
    }),
  })
);
