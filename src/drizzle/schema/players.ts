import { pgTable, text, smallint, index, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { teams } from "./teams";
import { playerRoles } from "./playerRoles";
import { matchdayVotes } from "./matchdayVotes";
import { leagueMemberTeamPlayers } from "./leagueMemberTeamPlayers";

export const players = pgTable(
  "players",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    displayName: text("display_name").notNull(),
    roleId: smallint("role_id")
      .notNull()
      .references(() => playerRoles.id, { onDelete: "restrict" }),
    teamId: smallint("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    avatarUrl: text("avatar_url"),
  },
  (t) => ({ playerTeamIdIndex: index("idx_players_team_id").on(t.teamId) })
);

export const playersRelations = relations(players, ({ one, many }) => ({
  role: one(playerRoles, {
    fields: [players.roleId],
    references: [playerRoles.id],
  }),
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  votes: many(matchdayVotes),
  leagueTeams: many(leagueMemberTeamPlayers),
}));
