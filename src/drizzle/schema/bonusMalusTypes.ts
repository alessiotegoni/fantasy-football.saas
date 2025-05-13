import {
  pgTable,
  smallint,
  uniqueIndex,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { matchdayBonusMalus } from "./matchdayBonusMalus";

export const bonusMalusCategories = [
  "goals",
  "penalties",
  "assists",
  "goalkeeper_bonus",
  "discipline",
  "performance",
  "shotouts",
] as const;
export type BonusMalusCategoriesType = (typeof bonusMalusCategories)[number];

export const bonusMalusCategoriesEnum = pgEnum(
  "bonus_malus_categories",
  bonusMalusCategories
);

export const bonusMalusCodes = [
  "goals",
  "penalties",
  "assists",
  "goalkeeper_bonus",
  "discipline",
  "performance",
  "shotouts",
] as const;
export type BonusMalusCodesType = (typeof bonusMalusCodes)[number];

export const bonusMalusCodesEnum = pgEnum("bonus_malus_codes", bonusMalusCodes);

export const bonusMalusTypes = pgTable(
  "bonus_malus_types",
  {
    id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    value: smallint("value").notNull(),
    category: bonusMalusCategoriesEnum("category").notNull(),
    code: bonusMalusCodesEnum("code").notNull(),
  },
  (t) => ({
    bonusMalusTypesCodeKey: uniqueIndex("bonus_malus_types_code_key").on(
      t.code
    ),
  })
);

export const bonusMalusTypesRelations = relations(
  bonusMalusTypes,
  ({ many }) => ({
    matchdayBonusMaluses: many(matchdayBonusMalus),
  })
);
