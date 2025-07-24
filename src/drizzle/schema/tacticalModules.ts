import { pgTable, text, smallint, jsonb } from "drizzle-orm/pg-core";
import { PRESIDENT_ROLE_ID } from "./playerRoles";

export const positions = ["PR", "GK", "FB", "MF", "ST"] as const;

export const PRESIDENT_POSITION_ID = `${positions[0]}-${PRESIDENT_ROLE_ID}`;

export type Position = (typeof positions)[number];
export type PositionId = `${Position}-${number}`;

export type RolePosition = {
  roleId: number;
  positionsIds: PositionId[];
};

export const tacticalModules = pgTable("tactical_modules", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  layout: jsonb("layout").notNull().$type<RolePosition[]>(),
});

export type TacticalModule = typeof tacticalModules.$inferSelect;
