import { z } from "zod";

export const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

export const imageSchema = z.object({
  image: z
    .instanceof(File, { message: "L'immagine deve essere un file valido" })
    .refine(isValidImage, "Immagine troppo pesante o non supportata")
    .nullable(),
});

export function isValidImage(file: File) {
  const isValidExt = file.type.startsWith("image/");
  const isValidSize = file.size <= MAX_IMAGE_SIZE;
  return isValidExt && isValidSize;
}
