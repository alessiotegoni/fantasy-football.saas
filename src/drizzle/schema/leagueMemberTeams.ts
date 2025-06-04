import {
  pgTable,
  uuid,
  text,
  smallint,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueMembers } from "./leagueMembers";
import { leagueMemberTeamPlayers } from "./leagueMemberTeamPlayers";
import { leagueMatches } from "./leagueMatches";
import { leagues } from "./leagues";

export const leagueMemberTeams = pgTable(
  "league_member_teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leagueId: uuid("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    leagueMemberId: uuid("league_member_id")
      .notNull()
      .references(() => leagueMembers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    managerName: text("manager_name").notNull(),
    imageUrl: text("image_url"),
    credits: smallint("credits").notNull().default(0),
  },
  (t) => ({
    uniqueLeagueMemberTeam: uniqueIndex("unique_team_per_league").on(
      t.leagueId,
      t.leagueMemberId
    ),
  })
);

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
