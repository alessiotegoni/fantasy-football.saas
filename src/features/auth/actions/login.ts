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
  LOGIN = "Login effettuato con successo",
  LOGOUT = "Logout effettuato con successo",
}

export async function login(
  values: LoginSchemaType,
  options?: { redirectUrl?: string | null }
) {
  const schemaValidation = validateSchema<LoginSchemaType>(loginSchema, values);
  if (!schemaValidation.isValid) return schemaValidation.error;

  const redirectUrl = options?.redirectUrl ? `next=${options.redirectUrl}` : "";

  const { data } = schemaValidation;

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

  if (error) return createError(AUTH_ERRORS.LOGIN);

  return createSuccess(AUTH_SUCCESS.LOGIN, {
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

  return {
    error: false,
    url: data.url,
    message: "",
  };
}

export async function verifyOtp(values: OtpSchema) {
  const schemaValidation = validateSchema<OtpSchema>(
    otpSchema,
    values,
    AUTH_ERRORS.INVALID_CODE
  );
  if (!schemaValidation.isValid) return schemaValidation.error;

  const [supabase, isEmailConfirmed] = await Promise.all([
    createClient(),
    hasConfirmedEmail(schemaValidation.data.email),
  ]);

  const { error } = await supabase.auth.verifyOtp({
    type: isEmailConfirmed ? "magiclink" : "signup",
    ...schemaValidation.data,
  });

  if (error) return createError(AUTH_ERRORS.INVALID_CODE);
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return createError(AUTH_ERRORS.LOGOUT);

  return createSuccess(AUTH_SUCCESS.LOGOUT);
}

async function hasConfirmedEmail(email: string) {
  const [res] = await db
    .select({ emailConfirmed: isNotNull(authUsers.emailConfirmedAt) })
    .from(authUsers)
    .where(eq(authUsers.email, email));

  return res.emailConfirmed;
}
