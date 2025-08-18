"use client";

import { useTransition } from "react";
import useActionToast from "./useActionToast";
import { useParams, useRouter } from "next/navigation";

export default function useHandleSubmit<T>(
  submitFn: (args: T) => Promise<{ error: boolean; message: string }>,
  options?: { pushTo?: string; isLeaguePrefix?: boolean }
) {
  const toast = useActionToast();

  const [isPending, startTransition] = useTransition();

  const { leagueId } = useParams<{ leagueId?: string }>();
  const router = useRouter();

  const { pushTo, isLeaguePrefix = true } = options ?? {};

  function onSubmit(args: T) {
    startTransition(async () => {
      const result = await submitFn(args);
      toast(result);

      handleRedirect();
    });
  }

  function handleRedirect() {
    if (!pushTo) return;

    if (isLeaguePrefix && leagueId) {
      router.push(`/leagues/${leagueId}${pushTo}`);
      return;
    }

    router.push(pushTo);
  }

  return { isPending, onSubmit };
}
