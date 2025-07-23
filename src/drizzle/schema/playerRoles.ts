import { relations } from "drizzle-orm";
import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { players } from "./players";

export const PRESIDENT_ROLE_ID = 1

export const playerRoles = pgTable("player_roles", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
});

export const playerRolesRelations = relations(playerRoles, ({ many }) => ({
  players: many(players),
}));
