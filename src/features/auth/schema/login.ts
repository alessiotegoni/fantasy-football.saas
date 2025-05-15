import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { z } from "zod";

export const oauthProviders: SignInWithOAuthCredentials["provider"][] = [
  "google",
  "twitch",
] as const;

export const loginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: z.string().email("Email non valida"),
  }),
  ...oauthProviders.map((provider) => z.object({ type: z.literal(provider) })),
]);

export type LoginSchemaType = z.infer<typeof loginSchema>;
