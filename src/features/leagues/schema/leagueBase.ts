import { imageSchema } from "@/schema/image";
import { z } from "zod";

export const JOIN_CODE_LENGTH = 10;

export const baseLeagueFields = z
  .object({
    name: z.string().min(3).max(30).trim(),
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
  })
  .merge(imageSchema);
