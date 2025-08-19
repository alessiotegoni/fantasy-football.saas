import { z } from "zod";
import { getUUIdSchema } from "@/schema/helpers";

const participantActionSchema = z.object({
  auctionId: getUUIdSchema(),
  teamId: getUUIdSchema(),
});

export const updateAuctionParticipantSchema = z
  .object({
    order: z.number().int().positive(),
    isCurrent: z.boolean(),
  })
  .merge(participantActionSchema);

export const deleteAuctionParticipantSchema = participantActionSchema;

export type UpdateAuctionParticipantSchema = z.infer<
  typeof updateAuctionParticipantSchema
>;
export type DeleteAuctionParticipantSchema = z.infer<
  typeof deleteAuctionParticipantSchema
>;
