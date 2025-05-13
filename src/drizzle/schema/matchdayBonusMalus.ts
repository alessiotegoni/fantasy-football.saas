import {
  pgTable,
  uuid,
  smallint,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { players } from "./players";
import { splitMatchdays } from "./splitMatchdays";
import { bonusMalusTypes } from "./bonusMalusTypes";

export const matchdayBonusMalus = pgTable(
  "matchday_bonus_malus",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    matchdayId: smallint("matchday_id")
      .notNull()
      .references(() => splitMatchdays.id, { onDelete: "set null" }),
    count: smallint("count").default(1),
    bonusMalusTypeId: smallint("bonus_malus_type_id")
      .notNull()
      .references(() => bonusMalusTypes.id, { onDelete: "restrict" }),
  },
  (t) => ({
    uniquePlayerMatchdayBonusType: uniqueIndex(
      "unique_player_matchday_bonus_type"
    ).on(t.playerId, t.matchdayId, t.bonusMalusTypeId),
    playerMatchIdIndex: index("idx_bonus_malus_player_match").on(
      t.playerId,
      t.matchdayId
    ),
  })
);

export const matchdayBonusMalusRelations = relations(
  matchdayBonusMalus,
  ({ one }) => ({
    player: one(players, {
      fields: [matchdayBonusMalus.playerId],
      references: [players.id],
    }),
    matchday: one(splitMatchdays, {
      fields: [matchdayBonusMalus.matchdayId],
      references: [splitMatchdays.id],
    }),
    bonusMalusType: one(bonusMalusTypes, {
      fields: [matchdayBonusMalus.bonusMalusTypeId],
      references: [bonusMalusTypes.id],
    }),
  })
);
