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
import { eq, isNotNull } from "drizzle-orm";

const getError = (message: string) => getErrorObject(message);

export async function login(
  values: LoginSchemaType,
  options?: { redirectUrl?: string | null }
) {
  const { success, data } = loginSchema.safeParse(values);

  if (!success) return getError("Errore nel login, riprovare");

  const redirectUrl = options?.redirectUrl ? `next=${options.redirectUrl}` : "";

  if (data.type === "email") {
    return await emailLogin(data.email, redirectUrl);
  } else {
    return await oauthLogin(data.type, redirectUrl);
  }
}

async function emailLogin(email: string, redirectTo: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getUrl(`/api/auth/verify-token?${redirectTo}`),
    },
  });

  if (error) return getError("Errore nel login, riprovare");

  console.log(`/auth/verify-otp?${redirectTo}`);

  return {
    error: false,
    url: `/auth/verify-otp?${redirectTo}`,
    message: "",
  };
}

async function oauthLogin(
  provider: SignInWithOAuthCredentials["provider"],
  redirectTo: string
) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getUrl(`/api/auth/callback?${redirectTo}`),
    },
  });

  if (error) return getError("Errore nel login, riprovare");

  return {
    error: false,
    url: data.url,
    message: "",
  };
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

  if (error) return getError("Codice non valido");
}

async function hasConfirmedEmail(email: string) {
  const [res] = await db
    .select({ emailConfirmed: isNotNull(authUsers.emailConfirmedAt) })
    .from(authUsers)
    .where(eq(authUsers.email, email));

  return res.emailConfirmed;
}
