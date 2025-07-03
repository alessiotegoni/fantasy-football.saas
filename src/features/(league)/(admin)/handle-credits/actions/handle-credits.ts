"use server";

import { validateSchema } from "@/schema/helpers";
import {
  resetCreditsSchema,
  ResetCreditsSchema,
} from "../schema/handle-credits";
import { canUpdateCredits } from "../permissions/handle-credits";

export async function resetCredits(values: ResetCreditsSchema) {
  const { isValid, error, data } = validateSchema<ResetCreditsSchema>(
    resetCreditsSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateCredits(data.leagueId);
  if (permissions.error) return permissions.error;
}
