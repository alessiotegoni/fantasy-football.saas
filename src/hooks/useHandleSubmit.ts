"use client";

import { useTransition } from "react";
import useActionToast from "./useActionToast";
import { useParams, useRouter } from "next/navigation";

export default function useHandleSubmit<T>(
  submitFn: (args: T) => Promise<{ error: boolean; message: string }>,
  options?: { redirectTo?: string; isLeaguePrefix?: boolean }
) {
  const toast = useActionToast();

  const [isPending, startTransition] = useTransition();

  const { leagueId } = useParams<{ leagueId?: string }>();
  const router = useRouter();

  const { redirectTo, isLeaguePrefix = true } = options ?? {};

  function onSubmit(args: T) {
    startTransition(async () => {
      const result = await submitFn(args);
      toast(result);

      if (!result.error) handleRedirect();
    });
  }

  function handleRedirect() {
    if (!redirectTo) return;

    if (isLeaguePrefix && leagueId) {
      router.push(`/leagues/${leagueId}${redirectTo}`);
      return;
    }

    router.push(redirectTo);
  }

  return { isPending, onSubmit };
}
