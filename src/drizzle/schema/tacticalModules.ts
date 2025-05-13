import { pgTable, text, smallint, jsonb } from "drizzle-orm/pg-core";

type Position = "FB" | "MF" | "ST";
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
