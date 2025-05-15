import { z } from "zod";

export const otpSchema = z.union([
  z.object({
    email: z.string().email("Email non valida"),
    token: z.string().length(6, "Codice invalido"),
  }),
  z.object({
    token_hash: z.string().startsWith("pkce_", "Token non valido"),
  }),
]);

export type OtpSchema = z.infer<typeof otpSchema>;
