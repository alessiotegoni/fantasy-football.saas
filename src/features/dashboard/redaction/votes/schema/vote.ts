import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const assignVoteSchema = z.object({
  playerId: getSerialIdSchema(),
  matchdayId: getSerialIdSchema(),
  vote: z
    .number()
    .min(0, "Il voto non può essere minore di 0")
    .max(10, "Il voto non può essere maggiore di 10"),
});

export const createVotesSchema = z.object({
  votes: z.array(assignVoteSchema),
});

export const editVoteSchema = z
  .object({
    id: getUUIdSchema(),
  })
  .merge(assignVoteSchema);

export const deleteVoteSchema = z.object({
  voteId: getUUIdSchema(),
  matchdayId: getSerialIdSchema(),
});

export type AssignVoteSchema = z.infer<typeof assignVoteSchema>;
export type CreateVotesSchema = z.infer<typeof createVotesSchema>;
export type EditVoteSchema = z.infer<typeof editVoteSchema>;
export type DeleteVoteSchema = z.infer<typeof deleteVoteSchema>;
