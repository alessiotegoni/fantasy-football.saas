"use server";

import { createClient } from "@/services/supabase/server/supabase";
import {
  loginSchema,
  LoginSchemaType,
  otpSchema,
  OtpSchema,
} from "../schema/login";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { getUrl } from "@/lib/utils";
import { authUsers } from "drizzle-orm/supabase";
import { db } from "@/drizzle/db";
import { eq, isNotNull } from "drizzle-orm";
import { validateSchema } from "@/schema/helpers";
import { createError, createSuccess } from "@/lib/helpers";

enum AUTH_ERRORS {
  LOGIN = "Errore nel login, riprovare",
  LOGOUT = "Errore nel logout, riprovare",
  INVALID_CODE = "Codice non valido",
  INVALID_DATA = "Dati non validi",
}

enum AUTH_SUCCESS {
  CODE_SENT = "Codice inviato con successo alla tua email",
  LOGIN = "Login effettuato con successo",
  LOGOUT = "Logout effettuato con successo",
}

export async function login(
  values: LoginSchemaType,
  options?: { redirectUrl?: string | null }
) {
  const { isValid, error, data } = validateSchema<LoginSchemaType>(
    loginSchema,
    values
  );
  if (!isValid) return error;

  const redirectUrl = options?.redirectUrl ? `next=${options.redirectUrl}` : "";

  if (data.type === "email") {
    return emailLogin(data.email, redirectUrl);
  } else {
    return oauthLogin(data.type, redirectUrl);
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

  if (error) return createError(AUTH_ERRORS.LOGIN);

  return createSuccess(AUTH_SUCCESS.CODE_SENT, {
    url: `/auth/verify-otp?${redirectTo}`,
  });
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

  if (error) return createError(AUTH_ERRORS.LOGIN);

  return createSuccess(AUTH_SUCCESS.LOGIN, { url: data.url });
}

export async function verifyOtp(values: OtpSchema) {
  const { isValid, error, data } = validateSchema<OtpSchema>(
    otpSchema,
    values,
    AUTH_ERRORS.INVALID_CODE
  );
  if (!isValid) return error;

  const [supabase, isEmailConfirmed] = await Promise.all([
    createClient(),
    hasConfirmedEmail(data.email),
  ]);

  const result = await supabase.auth.verifyOtp({
    type: isEmailConfirmed ? "magiclink" : "signup",
    ...data,
  });

  if (result.error) return createError(AUTH_ERRORS.INVALID_CODE);

  return createSuccess(AUTH_SUCCESS.LOGIN, null);
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return createError(AUTH_ERRORS.LOGOUT);

  return createSuccess(AUTH_SUCCESS.LOGOUT, null);
}

async function hasConfirmedEmail(email: string) {
  const [res] = await db
    .select({ emailConfirmed: isNotNull(authUsers.emailConfirmedAt) })
    .from(authUsers)
    .where(eq(authUsers.email, email));

  return res.emailConfirmed;
}
