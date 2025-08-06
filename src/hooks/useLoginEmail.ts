"use client";

import { login } from "@/features/auth/actions/login";
import useActionToast from "./useActionToast";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "authEmail";

export function useEmailLogin() {
  const [email, setEmail] = useLocalStorage(STORAGE_KEY, "");

  const toast = useActionToast();

  const saveEmail = setEmail;
  const clearEmail = () => setEmail("");

  const resendCode = async () => {
    const res = await login({ type: "email", email });
    if (!res.error) res.message = "Codice inviato con successo";
    toast(res);
    return res;
  };

  return {
    email,
    saveEmail,
    clearEmail,
    resendCode,
  };
}
