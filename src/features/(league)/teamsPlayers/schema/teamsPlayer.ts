import { z } from "zod";

export const teamPlayerSchema = z.object({
  leagueId: z.string(),
  memberTeamId: z.string(),
});

export type TeamPlayerSchema = z.infer<typeof teamPlayerSchema>;

export const insertTeamPlayerSchema = z
  .object({
    player: z.object({
      id: z.number(),
      roleId: z.number().positive(),
    }),
    purchaseCost: z
      .number({ message: "Deve essere un numero" })
      .nonnegative(
        "Il numero dei crediti di acquisto deve essere maggiore o pari a zero"
      ),
  })
  .merge(teamPlayerSchema);
export const releaseTeamPlayerSchema = z
  .object({
    playerId: z.number(),
    releaseCost: z
      .number({ message: "Deve essere un numero" })
      .nonnegative("I crediti di svincolo devono essere un valore tra 0 e 5000")
      .max(5000),
  })
  .merge(teamPlayerSchema);

export type InsertTeamPlayerSchema = z.infer<typeof insertTeamPlayerSchema>;
export type ReleaseTeamPlayerSchema = z.infer<typeof releaseTeamPlayerSchema>;
