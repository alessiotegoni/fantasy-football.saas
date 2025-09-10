import { getUserId } from "@/features/dashboard/user/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { isAdmin, isSuperadmin } from "@/features/dashboard/user/utils/roles";
import { createClient } from "@/services/supabase/server/supabase";

enum SPLIT_ERRORS {
  REQUIRE_ADMIN = "Devi essere un admin per gestire gli splits",
}

export async function canManageSplit() {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  if (isSuperadmin(userId)) return createSuccess("", null);

  const supabase = await createClient();
  const userIsAdmin = await isAdmin(supabase, userId);

  if (!userIsAdmin) {
    return createError(SPLIT_ERRORS.REQUIRE_ADMIN);
  }

  return createSuccess("", null);
}
