"use client";

import { login } from "@/features/auth/actions/login";
import { actionToast } from "@/lib/utils";
import { useCallback } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "authEmail";

export function useEmailLogin() {
  const saveEmail = useCallback((email: string) => {
    sessionStorage.setItem(STORAGE_KEY, email);
  }, []);

  const getEmail = useCallback((): string | null => {
    return sessionStorage.getItem(STORAGE_KEY);
  }, []);

  const clearEmail = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const resendCode = useCallback(async () => {
    const email = sessionStorage.getItem(STORAGE_KEY) ?? "";
    const res = await login({ type: "email", email });
    if (!res.error) res.message = "Codice inviato con successo";
    actionToast(res);
    return res;
  }, []);

  return {
    saveEmail,
    getEmail,
    clearEmail,
    resendCode,
  };
}
