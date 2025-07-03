import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

export const updateCreditsSchema = z.object({
  leagueId: getUUIdSchema("Id della lega invalido"),
  credits: z
    .number()
    .positive("I crediti devono essere un numero positivo")
    .max(5000, "I crediti non devono superare il numero 5.000"),
});

export type UpdateCreditsSchema = z.infer<typeof updateCreditsSchema>;
