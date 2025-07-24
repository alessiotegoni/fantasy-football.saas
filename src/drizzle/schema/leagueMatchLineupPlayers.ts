import {
  pgTable,
  uuid,
  smallint,
  pgEnum,
  integer,
  text,
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

export const leagueMatchLineupPlayers = pgTable("league_match_lineup_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  lineupId: uuid("lineup_id")
    .notNull()
    .references(() => leagueMatchTeamLineup.id, { onDelete: "cascade" }),
  positionId: text("position_id").$type<PositionId>(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id, { onDelete: "cascade" }),
  playerType: lineupPlayerTypeEnum("player_type").notNull().default("bench"),
  positionOrder: smallint("position_order").notNull(),
});

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
