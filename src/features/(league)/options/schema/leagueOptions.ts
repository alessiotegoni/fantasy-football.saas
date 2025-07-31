import { z } from "zod";

// Schema per le opzioni generali
export const generalOptionsSchema = z.object({
  initialCredits: z
    .number()
    .min(200, "I crediti iniziali devono essere almeno 200")
    .max(5000, "I crediti iniziali non possono superare 5000"),
  maxMembers: z
    .number()
    .min(4, "Il numero minimo di membri è 4")
    .max(12, "Il numero massimo di membri è 12"),
});

// Schema per le rose e moduli
export const rosterModulesSchema = z.object({
  playersPerRole: z.record(
    z.string(),
    z
      .number()
      .positive("Tutti i ruoli devono avere almeno 1 giocatore asegnato")
  ),
  tacticalModules: z
    .array(z.number().positive())
    .min(1, "Deve essere selezionato almeno un modulo tattico")
    .max(5, "Massimo 5 moduli tattici"),
});

// Schema per bonus e malus
export const bonusMalusSchema = z.object({
  customBonusMalus: z.record(
    z.string(),
    z
      .number()
      .min(-10, "Il valore minimo è -10")
      .max(10, "Il valore massimo è 10")
  ),
});

export const marketOptionsSchema = z.object({
  isTradingMarketOpen: z.boolean(),
  releasePercentage: z
    .number({ message: "Deve essere un numero valido" })
    .min(0, "La percentuale di svincolo devono essere un valore tra 0 e 100")
    .max(100, "La percentuale di svincolo devono essere un valore tra 0 e 100"),
});

export type GeneralOptionsSchema = z.infer<typeof generalOptionsSchema>;
export type RosterModulesSchema = z.infer<typeof rosterModulesSchema>;
export type BonusMalusSchema = z.infer<typeof bonusMalusSchema>;
export type MarketOptionsSchema = z.infer<typeof marketOptionsSchema>;
