"use server";

import { createClient } from "@/services/supabase/server/supabase";
import { loginSchema, LoginSchemaType } from "../schema/login";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { getUrl } from "@/lib/utils";

export async function login(values: LoginSchemaType) {
  const { success, data } = loginSchema.safeParse(values);

  if (!success) return { error: true, message: "Errore nel login, riprovare" };

  let res;

  if (data.type === "email") {
    res = await emailLogin(data.email);
  } else {
    res = await oauthLogin(data.type);
  }

  if (res.error) return { error: true, message: "Errore nel login, riprovare" };

  return { error: false, url: res.url };
}

async function emailLogin(email: string) {
  const supabase = await createClient();

  const res = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getUrl("/api/auth/verify-token"),
    },
  });

  return { error: res.error, url: null };
}

async function oauthLogin(provider: SignInWithOAuthCredentials["provider"]) {
  const supabase = await createClient();

  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl("/api/auth/callback"),
    },
  });

  return { error: res.error, url: res.error ? null : res.data.url };
}
