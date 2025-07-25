import {
  pgTable,
  uuid,
  smallint,
  pgEnum,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMatchTeamLineup } from "./leagueMatchTeamLineup";
import { players } from "./players";
import { PositionId } from "./tacticalModules";

export const lineupPlayerTypes = ["starter", "bench"] as const;
export type LineupPlayerType = (typeof lineupPlayerTypes)[number];

export const lineupPlayerTypeEnum = pgEnum(
  "lineup_player_type",
  lineupPlayerTypes
);

export const leagueMatchLineupPlayers = pgTable(
  "league_match_lineup_players",
  {
    lineupId: uuid("lineup_id")
      .notNull()
      .references(() => leagueMatchTeamLineup.id, { onDelete: "cascade" }),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    positionId: text("position_id").$type<PositionId>(),
    positionOrder: smallint("position_order").notNull(),
    playerType: lineupPlayerTypeEnum("player_type").notNull().default("bench"),
  },
  (table) => [primaryKey({ columns: [table.lineupId, table.playerId] })]
);

export const leagueMatchLineupPlayersRelations = relations(
  leagueMatchLineupPlayers,
  ({ one }) => ({
    lineup: one(leagueMatchTeamLineup, {
      fields: [leagueMatchLineupPlayers.lineupId],
      references: [leagueMatchTeamLineup.id],
    }),
    player: one(players, {
      fields: [leagueMatchLineupPlayers.playerId],
      references: [players.id],
    }),
  })
);
