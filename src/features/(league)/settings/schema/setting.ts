import { getSerialIdSchema } from "@/schema/helpers";
import { z } from "zod";

// Schema per impostazioni generali
export const initialCredits = z
  .number()
  .int()
  .min(200, "I crediti iniziali devono essere almeno 200")
  .max(5000, "I crediti iniziali non possono superare 5000");

export const generalSettingsSchema = z.object({
  initialCredits,
  maxMembers: z
    .number()
    .int()
    .min(4, "Il numero minimo di membri è 4")
    .max(12, "Il numero massimo di membri è 12"),
});

// Schema per le rose e moduli
export const playersPerRole = z.record(
  z.string(),
  z
    .number()
    .int()
    .positive("Tutti i ruoli devono avere almeno 1 giocatore asegnato")
);

export const rosterModulesSchema = z.object({
  playersPerRole,
  tacticalModules: z
    .array(getSerialIdSchema())
    .min(1, "Deve essere selezionato almeno un modulo tattico")
    .max(5, "Massimo 5 moduli tattici"),
});

// Schema per bonus e malus
export const bonusMalusSchema = z.object({
  customBonusMalus: z.record(
    z.string(),
    z
      .number()
      .int()
      .min(-10, "Il valore minimo è -10")
      .max(10, "Il valore massimo è 10")
  ),
});

// Schema per calcolo delle giornate
export const calculationSettingsSchema = z.object({
  goalThresholdSettings: z.object({
    base: z
      .number({ message: "Deve essere un numero" })
      .int("Deve essere un numero intero")
      .min(40, "Deve essere un numero maggiore o uguale a 40")
      .max(100, "Deve essere un numero minore o uguale a 100"),
    interval: z
      .number({ message: "Deve essere un numero" })
      .int("Deve essere un numero intero")
      .min(1, "Deve essere un numero maggiore o uguale di 1")
      .max(20, "Deve essere un numero minore o uguale di 20"),
  }),
});

// Schema per impostazioni mercato
export const marketSettingsSchema = z.object({
  isTradingMarketOpen: z.boolean(),
  releasePercentage: z
    .number({ message: "Deve essere un numero valido" })
    .int()
    .min(0, "La percentuale di svincolo devono essere un valore tra 0 e 100")
    .max(100, "La percentuale di svincolo devono essere un valore tra 0 e 100"),
});

export type GeneralSettingsSchema = z.infer<typeof generalSettingsSchema>;
export type RosterModulesSchema = z.infer<typeof rosterModulesSchema>;
export type BonusMalusSchema = z.infer<typeof bonusMalusSchema>;
export type CalculationSettingsSchema = z.infer<
  typeof calculationSettingsSchema
>;
export type MarketSettingsSchema = z.infer<typeof marketSettingsSchema>;
