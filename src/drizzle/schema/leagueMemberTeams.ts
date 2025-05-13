import { pgTable, uuid, text, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMembers } from "./leagueMembers";
import { leagueMemberTeamPlayers } from "./leagueMemberTeamPlayers";
import { leagueMatches } from "./leagueMatches";

export const leagueMemberTeams = pgTable("league_member_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  leagueMemberId: uuid("league_member_id")
    .notNull()
    .references(() => leagueMembers.id, { onDelete: "cascade" })
    .unique("league_member_teams_league_member_id_key"),
  name: text("name").notNull(),
  managerName: text("manager_name").notNull(),
  imageUrl: text("image_url"),
  credits: smallint("credits").notNull().default(0),
});

export const leagueMemberTeamsRelations = relations(
  leagueMemberTeams,
  ({ one, many }) => ({
    leagueMember: one(leagueMembers, {
      fields: [leagueMemberTeams.leagueMemberId],
      references: [leagueMembers.id],
    }),
    players: many(leagueMemberTeamPlayers),
    matches: many(leagueMatches),
  })
);
