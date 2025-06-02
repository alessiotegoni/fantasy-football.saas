import { z } from "zod";

export const JOIN_CODE_LENGTH = 10;
export const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export const baseLeagueFields = z.object({
  name: z.string().min(3).max(30).trim(),
  image: z
    .instanceof(File, { message: "L'immagine deve essere un file valido" })
    .refine(isValidImage, "Immagine troppo pesante o non supportata")
    .nullable(),
  description: z
    .string()
    .min(10, "Deve avere minimo 10 caratteri")
    .max(500, "Deve avere massimo 10 caratteri")
    .trim()
    .nullable(),
  joinCode: z
    .string()
    .length(
      JOIN_CODE_LENGTH,
      `Deve avere esattamente ${JOIN_CODE_LENGTH} caratteri`
    ),
});

export function isValidImage(file: File) {
  const isValidExt = file.type.startsWith("image/");
  const isValidSize = file.size <= MAX_IMAGE_SIZE;
  return isValidExt && isValidSize;
}
