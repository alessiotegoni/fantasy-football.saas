import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const createAuctionNominationSchema = z.object({
  auctionId: getUUIdSchema(),
  playerId: z.number(),
  initialPrice: z.number().min(1),
});

export type CreateAuctionNominationSchema = z.infer<
  typeof createAuctionNominationSchema
>;
