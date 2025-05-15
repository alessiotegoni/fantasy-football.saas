"use server";

import { createClient } from "@/services/supabase/server/supabase";
import { OtpSchema, otpSchema } from "../schema/otp";

export async function verifyOtp(values: OtpSchema) {
  const { success, data } = otpSchema.safeParse(values);

  if (!success) return { error: true, message: "Codice non valido" };

  const supabase = await createClient();

  console.log(data);

  const { error } = await supabase.auth.verifyOtp({
    type: "magiclink",
    ...data,
  });

  console.log(error);

  if (error) return { error: true, message: "Codice non valido" };
}
