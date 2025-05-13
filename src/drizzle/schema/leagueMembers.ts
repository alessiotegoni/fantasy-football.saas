import {
  pgTable,
  uuid,
  timestamp,
  uniqueIndex,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagues } from "./leagues";
import { leagueMemberTeams } from "./leagueMemberTeams";
import { authUsers } from "drizzle-orm/supabase";

const leagueMemberRoles = ["admin", "member"] as const;
const leagueMemberRoleEnum = pgEnum("league_member_role", leagueMemberRoles);

export const leagueMembers = pgTable(
  "league_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leagueId: uuid("league_id")
      .notNull()
      .references(() => leagues.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    role: leagueMemberRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniqueUserPerLeague: uniqueIndex("unique_user_per_league").on(
      t.userId,
      t.leagueId
    ),
    leagueMemberUserIdIndex: index("idx_league_members_user_id").on(t.userId),
  })
);

export const leagueMembersRelations = relations(
  leagueMembers,
  ({ one, many }) => ({
    league: one(leagues, {
      fields: [leagueMembers.leagueId],
      references: [leagues.id],
    }),
    user: one(authUsers, {
      fields: [leagueMembers.userId],
      references: [authUsers.id],
    }),
    teams: many(leagueMemberTeams),
  })
);
