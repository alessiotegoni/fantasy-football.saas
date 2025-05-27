import { z } from "zod";
import { baseLeagueFields } from "./leagueBase";

export const publicLeagueSchema = z
  .object({ visibility: z.literal("public") })
  .merge(baseLeagueFields);
