import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const createNominationSchema = z.object({
  auctionId: getUUIdSchema(),
  playerId: getSerialIdSchema(),
  initialPrice: z.number().int().positive().max(5000),
});

export type CreateNominationSchema = z.infer<
  typeof createNominationSchema
>;
