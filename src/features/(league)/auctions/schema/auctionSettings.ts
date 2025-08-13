import { z } from "zod";
import { initialCredits, playersPerRole } from "../../settings/schema/setting";
import { getUUIdSchema } from "@/schema/helpers";

const baseAuctionSchema = z.object({
  leagueId: getUUIdSchema(),
  name: z
    .string({ message: "Nome obbligatorio" })
    .min(4, "Il nome deve avere almeno 4 caratteri")
    .max(20, "Il nome non puo superare i 20 caratteri"),
  description: z
    .string()
    .min(10, "La descrizione deve avere almeno 10 caratteri")
    .max(500, "La descrizione non puo superare i 500 caratteri")
    .nullable(),
  firstCallTime: z
    .number({ message: "Numero invalido" })
    .int()
    .min(10, "Il tempo minimo della prima chiamata e' di 10 secondi")
    .max(60, "Il tempo massimo della prima chiamata e' di 1 minuto"),
  othersCallsTime: z
    .number({ message: "Numero invalido" })
    .int()
    .min(5, "Il tempo minimo della altre chiamate e' di 5 secondi")
    .max(50, "Il tempo massimo delle altre chiamate e' di 50 secondi"),
});

const classicAuctionSchema = z
  .object({ type: z.literal("classic"), initialCredits, playersPerRole })
  .merge(baseAuctionSchema);

const repairAuctionSchema = z
  .object({
    type: z.literal("repair"),
    creditsToAdd: z.number().int().min(0).max(5000),
  })
  .merge(baseAuctionSchema);

export const auctionSchema = z.discriminatedUnion("type", [
  classicAuctionSchema,
  repairAuctionSchema,
]);

export type AuctionSchema = z.infer<typeof auctionSchema>;

export const createAuctionSchema = auctionSchema
export const updateAuctionSchema = z.discriminatedUnion("type", [
  classicAuctionSchema
    .omit({ leagueId: true, initialCredits: true })
    .merge(z.object({ id: getUUIdSchema() })),
  repairAuctionSchema
    .omit({ leagueId: true, creditsToAdd: true })
    .merge(z.object({ id: getUUIdSchema() })),
]);

export type CreateAuctionSchema = z.infer<typeof createAuctionSchema>;
export type UpdateAuctionSchema = z.infer<typeof updateAuctionSchema>;
