import { pgTable, text, smallint } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { splits } from "./splits";

export const seasons = pgTable("seasons", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
});

export const seasonRelations = relations(seasons, ({ many }) => ({
  splits: many(splits),
}));
