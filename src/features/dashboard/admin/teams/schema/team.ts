import { z } from "zod";
import { getSerialIdSchema } from "@/schema/helpers";

export const teamSchema = z.object({
  name: z.string().min(3, "Il nome deve essere di almeno 3 caratteri"),
  displayName: z.string().min(3, "Il display name deve essere di almeno 3 caratteri"),
});

export const updateTeamSchema = z
  .object({
    id: getSerialIdSchema(),
  })
  .merge(teamSchema);

export type TeamSchema = z.infer<typeof teamSchema>;
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
