import { leagueVisibilityStatuses } from "@/drizzle/schema";
import { baseLeagueFields } from "@/features/leagues/schema/leagueBase";
import { password } from "@/features/leagues/schema/privateLeague";
import { z } from "zod";

// Schema per le opzioni generali
export const generalOptionsSchema = z
  .object({
    initialCredits: z
      .number()
      .min(200, "I crediti iniziali devono essere almeno 200")
      .max(5000, "I crediti iniziali non possono superare 5000"),
    maxMembers: z
      .number()
      .min(4, "Il numero minimo di membri è 4")
      .max(20, "Il numero massimo di membri è 20"),
    isTradingMarketOpen: z.boolean(),
    password: password.nullable(),
    visibility: z.enum(leagueVisibilityStatuses),
  })
  .merge(baseLeagueFields.pick({ description: true }));

// Schema per i ruoli dei giocatori
export const playerRoleSchema = z.object({
  role: z.string(),
  label: z.string(),
  count: z
    .number()
    .nonnegative("Il numero non può essere negativo")
    .max(10, "Massimo 10 giocatori per ruolo"),
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
  customBonusMalusalus: z.record(
    z.string(),
    z
      .number()
      .min(-10, "Il valore minimo è -10")
      .max(10, "Il valore massimo è 10")
  ),
});

// Schema completo per le opzioni della lega
export const leagueOptionsSchema = z.object({
  general: generalOptionsSchema,
  rosterModules: rosterModulesSchema,
  bonusMalus: bonusMalusSchema,
});

export type GeneralOptionsSchema = z.infer<typeof generalOptionsSchema>;
export type RosterModulesSchema = z.infer<typeof rosterModulesSchema>;
export type BonusMalusSchema = z.infer<typeof bonusMalusSchema>;
export type LeagueOptionsSchema = z.infer<typeof leagueOptionsSchema>;
