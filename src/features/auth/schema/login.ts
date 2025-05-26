import { z } from "zod";

export const oauthProviders = ["google", "twitch"] as const;
export type OauthProviderType = (typeof oauthProviders)[number]

export const loginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: z.string({ message: "Email non valida" }).email("Email non valida"),
  }),
  ...oauthProviders.map((provider) => z.object({ type: z.literal(provider) })),
]);

export const otpSchema = z.union([
  z.object({
    email: z.string().email("Email non valida"),
    token: z.string().length(6, "Codice invalido"),
  }),
  z.object({
    token_hash: z.string().startsWith("pkce_", "Token non valido"),
  }),
]);

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
