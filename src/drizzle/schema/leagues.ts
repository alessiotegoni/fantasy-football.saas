import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { leagueSettings } from "./leagueSettings";
import { leagueUserBans } from "./leagueUserBans";
import { leagueMatches } from "./leagueMatches";
import { leagueMatchdayCalculations } from "./leagueMatchdayCalculations";
import { authUsers } from "drizzle-orm/supabase";
import { auctions } from "./auctions";
import { leagueMembers } from "./leagueMembers";
import { leagueTradeProposals } from "./leagueTradeProposals";

export const leagueVisibilityStatuses = ["public", "private"] as const;
export type LeagueVisibilityStatusType =
  (typeof leagueVisibilityStatuses)[number];

export const leagueVisibilityStatusEnum = pgEnum(
  "league_visibility_status",
  leagueVisibilityStatuses
);

export const leagues = pgTable(
  "leagues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    visibility: leagueVisibilityStatusEnum("visibility")
      .notNull()
      .default("public"),
    description: text("description"),
    password: text("password"),
    joinCode: text("join_code").notNull().unique("leagues_join_code_key"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    leagueVisibilityIndex: index("idx_leagues_visibility").on(t.visibility),
  })
);

export const leaguesRelations = relations(leagues, ({ many, one }) => ({
  owner: one(authUsers, {
    fields: [leagues.ownerId],
    references: [authUsers.id],
  }),
  settings: many(leagueSettings),
  members: many(leagueMembers),
  usersBans: many(leagueUserBans),
  tradeProposals: many(leagueTradeProposals),
  matches: many(leagueMatches),
  calculations: many(leagueMatchdayCalculations),
  auctions: many(auctions),
}));
