import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const createBidSchema = z.object({
  participantId: getUUIdSchema(),
  nominationId: getUUIdSchema(),
  amount: z.number().int().positive("L'importo deve essere positivo").max(5000),
});

export type CreateBidSchema = z.infer<typeof createBidSchema>;
