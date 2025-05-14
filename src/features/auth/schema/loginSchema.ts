import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email non valida"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
