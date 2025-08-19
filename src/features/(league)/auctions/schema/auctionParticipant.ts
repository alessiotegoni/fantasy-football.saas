import { z } from "zod";
import { getUUIdSchema } from "@/schema/helpers";

export const auctionParticipantSchema = z.object({
  auctionId: getUUIdSchema(),
  teamId: getUUIdSchema(),
});

export const updateParticipantsOrderSchema = z.object({
  auctionId: getUUIdSchema(),
  participantsIds: z.array(getUUIdSchema()),
});

export type UpdateParticipantsOrderSchema = z.infer<
  typeof updateParticipantsOrderSchema
>;
export type AuctionParticipantSchema = z.infer<typeof auctionParticipantSchema>;
