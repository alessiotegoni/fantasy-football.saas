"use server";

import { createClient } from "@/services/supabase/server/supabase";
import { loginSchema, LoginSchemaType } from "../schema/login";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";

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
    options: { emailRedirectTo: "/" },
  });

  return { error: res.error, url: null };
}

async function oauthLogin(provider: SignInWithOAuthCredentials["provider"]) {
  const supabase = await createClient();

  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl(),
    },
  });

  return { error: res.error, url: res.error ? null : res.data.url };
}

function getUrl() {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}
