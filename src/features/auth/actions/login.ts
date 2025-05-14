"use server";

import { createClient } from "@/services/supabase/server/supabase";
import { loginSchema, LoginSchemaType } from "../schema/loginSchema";
import { redirect } from "next/navigation";

export async function login(values: LoginSchemaType) {
  const { success, data } = loginSchema.safeParse(values);

  if (!success) return { error: true, message: "Errore nel login, riprovare" };

  const supabase = await createClient();

  const { data: res, error } = await supabase.auth.signInWithOtp({
    email: data.email,
    // options: { emailRedirectTo:  }
  });

  console.log(error);
  if (error) return { error: true, message: "Errore nel login, riprovare" };
  console.log(res);

  redirect("/verify");
}
