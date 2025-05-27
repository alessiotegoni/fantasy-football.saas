import { z } from "zod";
import { baseLeagueFields } from "./leagueBase";

export const password = z
  .string()
  .min(6, "Minimo 6 caratteri")
  .max(32, "Massimo 32 caratteri")
  .refine(
    (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/.test(val),
    "La password deve contenere almeno una maiuscola, una minuscola e un numero"
  );

export const joinPrivateLeagueSchema = z.object({
  password,
}).merge(baseLeagueFields.pick({ joinCode: true }));

export const privateLeagueSchema = z
  .object({ visibility: z.literal("private") })
  .merge(baseLeagueFields)
  .merge(joinPrivateLeagueSchema);
