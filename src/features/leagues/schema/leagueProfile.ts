import { z } from "zod";
import { password } from "./privateLeague";
import { leagueVisibilityStatuses } from "@/drizzle/schema";
import { baseLeagueFields } from "./leagueBase";

export const leagueProfileSchema = z
  .object({
    password: password.nullable(),
    visibility: z.enum(leagueVisibilityStatuses),
  })
  .merge(baseLeagueFields.pick({ description: true, image: true }));

export type LeagueProfileSchema = z.infer<typeof leagueProfileSchema>;
