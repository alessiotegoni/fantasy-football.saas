import { createError, ErrorResult } from "@/utils/helpers";
import { z, ZodSchema } from "zod";

export type ValidateSchema<T> =
  | { isValid: true; data: T; error?: ErrorResult }
  | { isValid: false; error: ErrorResult; data?: T };

export const VALIDATION_ERROR = "Errore di validazione dei dati";

export function validateSchema<T>(
  schema: ZodSchema,
  values: unknown,
  errorMessage = VALIDATION_ERROR
): ValidateSchema<T> {
  const { success, data, error } = schema.safeParse(values);

  console.error(error);
  

  if (!success) {
    return { isValid: false, error: createError(errorMessage) };
  }

  return { isValid: true, data };
}

export function validateUUIds<T extends Record<string, string>>(uuids: T) {
  const validations = Object.values(uuids).map((id) => validateUUId(id));

  const success = validations.some((validation) => validation.success);
  if (!success) return { success, ...uuids } as const;

  return { success, ...uuids };
}

export const validateUUId = (id: string) => getUUIdSchema().safeParse(id);
export const validateSerialId = (id: number) =>
  getSerialIdSchema().safeParse(id);

export const getSerialIdSchema = (errorMessage = "id invalido") =>
  z.number().int(errorMessage).positive(errorMessage);

export const getUUIdSchema = (errorMessage = "id invalido") =>
  z.string().uuid(errorMessage);
