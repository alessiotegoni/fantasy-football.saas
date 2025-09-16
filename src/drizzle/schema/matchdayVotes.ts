import {
  pgTable,
  numeric,
  smallint,
  uniqueIndex,
  check,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { players } from "./players";
import { splitMatchdays } from "./splitMatchdays";
import { redactions } from "./redactions";

export const matchdayVotes = pgTable(
  "matchday_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    matchdayId: smallint("matchday_id")
      .notNull()
      .references(() => splitMatchdays.id, { onDelete: "restrict" }),
    redactionId: uuid("redaction_id")
      .notNull()
      .references(() => redactions.id, { onDelete: "set null" }),
    vote: numeric("vote").notNull(),
  },
  (t) => ({
    uniquePlayerMatchdayVote: uniqueIndex("unique_player_matchday_vote").on(
      t.playerId,
      t.matchdayId,
      t.redactionId
    ),
    voteCheck: check(
      "matchday_votes_vote_check",
      sql`(
      (vote >= (0)::numeric)
      and (vote <= (10)::numeric)
    )`
    ),
  })
);

export const matchdayVotesRelations = relations(matchdayVotes, ({ one }) => ({
  player: one(players, {
    fields: [matchdayVotes.playerId],
    references: [players.id],
  }),
  matchday: one(splitMatchdays, {
    fields: [matchdayVotes.matchdayId],
    references: [splitMatchdays.id],
  }),
  redaction: one(redactions, {
    fields: [matchdayVotes.redactionId],
    references: [redactions.id],
  }),
}));
