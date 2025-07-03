import { getUUIdSchema } from "@/schema/helpers";
import { z } from "zod";

const credits = z
  .number()
  .positive("I crediti devono essere un numero positivo")
  .max(5000, "I crediti non devono superare il numero 5.000");

export const resetCreditsSchema = z.object({
  leagueId: getUUIdSchema("Id della lega invalido"),
  credits,
});

export const updateCreditsSchema = z.object({
  leagueId: getUUIdSchema("Id della lega invalido"),
  updatedTeamsCredits: z.array(
    z.object({ teamId: getUUIdSchema("Id del team non valido"), credits })
  ),
});

export type ResetCreditsSchema = z.infer<typeof resetCreditsSchema>;
export type UpdateCreditsSchema = z.infer<typeof updateCreditsSchema>;
