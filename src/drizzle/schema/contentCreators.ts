import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

export const contentCreators = pgTable("content_creators", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  discountCode: text("discount_code").unique(),
  discountCodeCount: integer("discount_code_count"),
});

export const contentCreatorsRelations = relations(
  contentCreators,
  ({ one }) => ({
    user: one(authUsers, {
      fields: [contentCreators.userId],
      references: [authUsers.id],
    }),
  })
);
