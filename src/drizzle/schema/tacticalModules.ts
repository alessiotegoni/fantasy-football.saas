import { pgTable, text, smallint, jsonb } from "drizzle-orm/pg-core";

export const positions = ["PR", "GK", "FB", "MF", "ST"] as const;

export type Position = (typeof positions)[number];
export type PositionId = `${Position}-${number}`;

export type RolePosition = {
  count: number;
  roleId: number;
  positionsIds: PositionId[];
};

export const tacticalModules = pgTable("tactical_modules", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  layout: jsonb("layout").notNull().$type<RolePosition[]>(),
});

export type TacticalModule = typeof tacticalModules.$inferSelect;
