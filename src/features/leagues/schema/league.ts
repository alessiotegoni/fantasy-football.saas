import { z } from "zod";

export const JOIN_CODE_LENGTH = 10;

export const joinPrivateLeagueSchema = z.object({
  joinCode: z
    .string()
    .length(
      JOIN_CODE_LENGTH,
      `Il codice di invito deve contenere almeno ${JOIN_CODE_LENGTH} caratteri`
    )
    .trim(),
});

const leagueSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Il nome deve contenere almeno 3 caratteri" })
    .max(30, { message: "Il nome non può superare i 30 caratteri" })
    .trim(),
  image: z.instanceof(File).nullable(),
  description: z
    .string()
    .min(10, { message: "La descrizione deve contenere almeno 10 caratteri" })
    .max(500, { message: "La descrizione non può superare i 500 caratteri" })
    .trim()
    .nullable(),
});

export const createLeagueSchema = z.discriminatedUnion("visibility", [
  z.object({ visibility: z.literal("public") }).merge(leagueSchema),
  z
    .object({ visibility: z.literal("private") })
    .merge(leagueSchema.merge(joinPrivateLeagueSchema)),
]);

export type CreateLeagueSchema = z.infer<typeof createLeagueSchema>;

export type JoinPrivateLeagueFormValues = z.infer<
  typeof joinPrivateLeagueSchema
>;
