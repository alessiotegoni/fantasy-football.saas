import { ZodSchema } from "zod";

type ErrorResult = {
  error: true;
  message: string;
  data: null;
};

type SuccessResult<T = {}> = {
  error: false;
  message: string;
  data?: T;
};

type ValidateSchema<T> =
  | { isValid: true; data: T }
  | { isValid: false; error: ReturnType<typeof createError> };

export const VALIDATION_ERROR = "Errore di validazione";

export function validateSchema<T>(
  schema: ZodSchema,
  values: unknown,
  errorMessage = VALIDATION_ERROR
): ValidateSchema<T> {
  const { success, data } = schema.safeParse(values);

  if (!success) {
    return { isValid: false, error: createError(errorMessage) };
  }

  return { isValid: true, data };
}

export function createError(message: string): ErrorResult {
  return {
    error: true,
    message,
    data: null,
  };
}

export function createSuccess<T>(
  message = "",
  data?: T
): SuccessResult<T> {
  return {
    error: false,
    message,
    data,
  };
}
