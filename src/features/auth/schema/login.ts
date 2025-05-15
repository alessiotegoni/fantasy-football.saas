import { z } from "zod";

export const oauthProviders = ["google", "twitch"] as const;

export const loginSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("email"),
    email: z.string({ message: "Email non valida" }).email("Email non valida"),
  }),
  ...oauthProviders.map((provider) => z.object({ type: z.literal(provider) })),
]);

export type LoginSchemaType = z.infer<typeof loginSchema>;
