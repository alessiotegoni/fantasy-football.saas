import { imageSchema } from "@/schema/image";
import { z } from "zod";

export const leagueTeamSchema = z
  .object({
    name: z
      .string()
      .min(3, "Il nome della squadra deve avere almeno 3 caratteri"),
    managerName: z
      .string()
      .min(3, "Il nome dell'allenatore deve avere almeno 3 caratteri"),
  })
  .merge(imageSchema);

export type LeagueTeamSchema = z.infer<typeof leagueTeamSchema>;
