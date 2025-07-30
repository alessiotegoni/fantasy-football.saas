"use server";

import { getUUIdSchema, validateSchema } from "@/schema/helpers";
import {
  calculateMatchdaySchema,
  CalculateMatchdaySchema,
  recalculateMatchdaySchema,
  RecalculateMatchdaySchema,
} from "../schema/calculate-matchday";
import { basePermissions } from "../permissions/calculate-matchday";
import { createError } from "@/lib/helpers";
import { db } from "@/drizzle/db";

enum MATCHDAY_CALCULATION_MESSAGES {
  CALCULATION_NOT_FODUND = "Calcolo della giornata non trovato",
}

export async function calculateMatchday(values: CalculateMatchdaySchema) {
  const { isValid, data, error } = validateSchema<CalculateMatchdaySchema>(
    calculateMatchdaySchema,
    values
  );
  if (!isValid) return error;
}

export async function recalculateMatchday(
  calculationId: string,
  values: CalculateMatchdaySchema
) {
  const { isValid, data, error } = validateSchema<RecalculateMatchdaySchema>(
    recalculateMatchdaySchema,
    { calculationId, ...values }
  );
  if (!isValid) return error;
}

export async function cancelCalculation(id: string) {
  const {
    isValid,
    data: calculationId,
    error,
  } = validateSchema<string>(getUUIdSchema(), id);
  if (!isValid) return error;

