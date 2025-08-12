import { z } from "zod";
import { initialCredits, playersPerRole } from "../../settings/schema/setting";

const baseAuctionSchema = z.object({
  firstCallTime: z
    .number()
    .int()
    .min(10, "Il tempo minimo della prima chiamata e' di 10 secondi")
    .max(60, "Il tempo massimo della prima chiamata e' di 1 minuto"),
  otherCallsTime: z
    .number()
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

export type AuctionSchema = z.infer<typeof auctionSchema>
