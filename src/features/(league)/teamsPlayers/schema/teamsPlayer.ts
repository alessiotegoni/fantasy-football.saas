import { z } from "zod";

export const teamPlayerSchema = z.object({
  leagueId: z.string(),
  memberTeamId: z.string(),
});

export type TeamPlayerSchema = z.infer<typeof teamPlayerSchema>;

export const insertTeamPlayerSchema = z
  .object({
    player: z.object({
      id: z.string(),
      roleId: z.number().positive(),
    }),
    purchaseCost: z
      .number({ message: "Deve essere un numero" })
      .nonnegative(
        "Il numero dei crediti di acquisto deve essere maggiore o pari a zero"
      ),
  })
  .merge(teamPlayerSchema);
export const removeTeamPlayerSchema = z
  .object({
    playerId: z.string(),
    releaseCost: z
      .number({ message: "Deve essere un numero" })
      .positive(
        "Il numero dei crediti di svincolo deve essere maggiore a zero"
      ),
  })
  .merge(teamPlayerSchema);

export type InsertTeamPlayerSchema = z.infer<typeof insertTeamPlayerSchema>;
export type RemoveTeamPlayerSchema = z.infer<typeof removeTeamPlayerSchema>;
