"use server";

import { createClient } from "@/services/supabase/server/supabase";
import {
  loginSchema,
  LoginSchemaType,
  otpSchema,
  OtpSchema,
} from "../schema/login";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { getErrorObject, getUrl } from "@/lib/utils";
import { authUsers } from "drizzle-orm/supabase";
import { db } from "@/drizzle/db";
import { count, eq, isNotNull } from "drizzle-orm";

const getError = (message: string) => getErrorObject(message);

export async function login(values: LoginSchemaType) {
  const { success, data } = loginSchema.safeParse(values);

  if (!success) return getError("Errore nel login, riprovare");

  let res;

  if (data.type === "email") {
    res = await emailLogin(data.email);
  } else {
    res = await oauthLogin(data.type);
  }

  if (res.error) return getError("Errore nel login, riprovare");

  return {
    error: false,
    url: res.url,
    message: "Login effettuato con successo",
  };
}

async function emailLogin(email: string) {
  const supabase = await createClient();

  const res = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getUrl("/api/auth/verify-token"),
    },
  });

  return { error: res.error, url: "" };
}

async function oauthLogin(provider: SignInWithOAuthCredentials["provider"]) {
  const supabase = await createClient();

  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl("/api/auth/callback"),
    },
  });

  return { error: res.error, url: res.data.url ?? "" };
}

export async function verifyOtp(values: OtpSchema) {
  const { success, data } = otpSchema.safeParse(values);

  if (!success || !("email" in data)) return getError("Codice non valido");

  const [supabase, isEmailConfirmed] = await Promise.all([
    createClient(),
    hasConfirmedEmail(data.email),
  ]);

  const { error } = await supabase.auth.verifyOtp({
    type: isEmailConfirmed ? "magiclink" : "signup",
    ...data,
  });

  console.log(error);

  if (error) return getError("Codice non valido");
}

async function hasConfirmedEmail(email: string) {
  const [res] = await db
    .select({ emailConfirmed: isNotNull(authUsers.emailConfirmedAt) })
    .from(authUsers)
    .where(eq(authUsers.email, email));

  console.log(res);

  return res.emailConfirmed;
}
