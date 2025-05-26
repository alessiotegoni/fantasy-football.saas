import { z } from "zod";

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export const JOIN_CODE_LENGTH = 10;

export const joinPrivateLeagueSchema = z.object({
  joinCode: z
    .string()
    .length(
      JOIN_CODE_LENGTH,
      `Il codice di invito deve contenere esattamente ${JOIN_CODE_LENGTH} caratteri`
    ),
  password: z
    .string()
    .min(6, "La password deve contenere almeno 6 caratteri")
    .max(32, "La password non deve superare i 32 caratteri")
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/.test(password),
      "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero. Non sono ammessi caratteri speciali."
    ),
});

const leagueSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Il nome deve contenere almeno 3 caratteri" })
    .max(30, { message: "Il nome non può superare i 30 caratteri" })
    .trim(),
  image: z
    .instanceof(File)
    .refine(isValidImage, "Immagine troppo pesante o non supportata")
    .nullable(),
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

export function isValidImage(file: File) {
  const isValidExt = file.type.startsWith("image/");
  const isValidSize = file.size <= MAX_IMAGE_SIZE;

  return isValidExt && isValidSize;
}
