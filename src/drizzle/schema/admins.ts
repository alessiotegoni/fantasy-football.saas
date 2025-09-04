import { pgTable, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
});

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(authUsers, {
    fields: [admins.userId],
    references: [authUsers.id],
  }),
}));
