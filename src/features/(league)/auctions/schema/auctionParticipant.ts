import { z } from "zod";
import { getUUIdSchema } from "@/schema/helpers";

const participantActionSchema = z.object({
  auctionId: getUUIdSchema(),
  teamId: getUUIdSchema(),
});

// export const updateAuctionParticipantSchema = z.object({
//   participantId: getUUIdSchema(),
//   credits: z.number().optional(),
//   isOnline: z.boolean().optional(),
//   order: z.number().optional(),
//   isCurrent: z.boolean().optional(),
// });

export const deleteAuctionParticipantSchema = participantActionSchema;

// export type JoinAuctionSchema = z.infer<typeof joinAuctionSchema>;
// export type UpdateAuctionParticipantSchema = z.infer<
//   typeof updateAuctionParticipantSchema
// >;
export type DeleteAuctionParticipantSchema = z.infer<
  typeof deleteAuctionParticipantSchema
>;
