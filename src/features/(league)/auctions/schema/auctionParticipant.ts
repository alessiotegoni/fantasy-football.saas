// import { z } from "zod";
// import { getUUIdSchema } from "@/schema/helpers";

// export const joinAuctionSchema = z.object({
//   auctionId: getUUIdSchema(),
//   credits: z.number(),
//   order: z.number(),
// });

// export const updateAuctionParticipantSchema = z.object({
//   participantId: getUUIdSchema(),
//   credits: z.number().optional(),
//   isOnline: z.boolean().optional(),
//   order: z.number().optional(),
//   isCurrent: z.boolean().optional(),
// });

// export const deleteAuctionParticipantSchema = z.object({
//   participantId: getUUIdSchema(),
// });

// export type JoinAuctionSchema = z.infer<typeof joinAuctionSchema>;
// export type UpdateAuctionParticipantSchema = z.infer<
//   typeof updateAuctionParticipantSchema
// >;
// export type DeleteAuctionParticipantSchema = z.infer<
//   typeof deleteAuctionParticipantSchema
// >;
