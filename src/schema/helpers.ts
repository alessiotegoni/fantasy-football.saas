import { z } from "zod";

export const getSerialIdSchema = (errorMessage = "id invalido") =>
  z.number().int(errorMessage).positive(errorMessage);

export const getUUIdSchema = (errorMessage = "id invalido") =>
  z.string().uuid(errorMessage);
