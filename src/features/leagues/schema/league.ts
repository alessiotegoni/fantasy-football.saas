import { z } from "zod";

export const JOIN_CODE_LENGTH = 10;

export const joinPrivateLeagueSchema = z.object({
  join_code: z
    .string()
    .length(
      JOIN_CODE_LENGTH,
      `Il codice di invito deve contenere almeno ${JOIN_CODE_LENGTH} caratteri`
    )
    .trim(),
});

export type JoinPrivateLeagueFormValues = z.infer<
  typeof joinPrivateLeagueSchema
>;

const leagueSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Il nome deve contenere almeno 3 caratteri" })
    .max(50, { message: "Il nome non può superare i 50 caratteri" })
    .trim(),
  image_url: z.string().nullable(),
  description: z
    .string()
    .min(10, { message: "La descrizione deve contenere almeno 10 caratteri" })
    .max(500, { message: "La descrizione non può superare i 500 caratteri" })
    .trim(),
});

export const createLeagueSchema = z.discriminatedUnion("visibility", [
  z.object({ visibility: z.literal("public") }).merge(leagueSchema),
  z
    .object({ visibility: z.literal("private") })
    .merge(leagueSchema.merge(joinPrivateLeagueSchema)),
]);

export type CreateLeagueSchema = z.infer<typeof createLeagueSchema>;
