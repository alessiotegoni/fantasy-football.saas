import {
  pgTable,
  numeric,
  uuid,
  smallint,
  uniqueIndex,
  index,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { players } from "./players";
import { splitMatchdays } from "./splitMatchdays";

export const matchdayVotes = pgTable(
  "matchday_votes",
  {
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    matchdayId: smallint("matchday_id")
      .notNull()
      .references(() => splitMatchdays.id, { onDelete: "restrict" }),
    vote: numeric("vote").notNull(),
  },
  (t) => ({
    uniquePlayerMatchdayVote: uniqueIndex("unique_player_matchday_vote").on(
      t.playerId,
      t.matchdayId
    ),
    matchdayVotesPlayerIdIndex: index("idx_matchday_votes_player_id").on(
      t.playerId
    ),
    matchdayVotesMatchdayIdIndex: index("idx_matchday_votes_matchday_id").on(
      t.matchdayId
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
}));
