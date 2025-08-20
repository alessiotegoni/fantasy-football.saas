import { getSerialIdSchema, getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const addAcquisitionPlayerSchema = z.object({
  auctionId: getUUIdSchema(),
  participantId: getUUIdSchema(),
  playerId: getSerialIdSchema(),
  price: z.number().int().min(0, "Il prezzo non può essere negativo"),
});

export type AddAcquisitionPlayerSchema = z.infer<
  typeof addAcquisitionPlayerSchema
>;
