import { z } from "zod";
import { privateLeagueSchema } from "./privateLeague";
import { publicLeagueSchema } from "./publicLeague";

export const createLeagueSchema = z.discriminatedUnion("visibility", [
  publicLeagueSchema,
  privateLeagueSchema,
]);

export type CreateLeagueSchema = z.infer<typeof createLeagueSchema>;
