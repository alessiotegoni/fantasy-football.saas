"use client";

import { useTransition, useState } from "react";
import useActionToast from "./useActionToast";
import { useParams, useRouter } from "next/navigation";

export default function useHandleSubmit<T>(
  submitFn: (args: T) => Promise<{ error: boolean; message: string }>,
  options?: {
    redirectTo?: string;
    isLeaguePrefix?: boolean;
    onSuccess?: () => void;
    isDialogControlled?: boolean;
  }
) {
  const toast = useActionToast();

  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { leagueId } = useParams<{ leagueId?: string }>();
  const router = useRouter();

  const {
    redirectTo,
    isLeaguePrefix = true,
    onSuccess,
    isDialogControlled = false,
  } = options ?? {};

  function onSubmit(args: T) {
    startTransition(async () => {
      const result = await submitFn(args);
      toast(result);

      if (!result.error) {
        handleRedirect();
        onSuccess?.();
        if (isDialogControlled) setDialogOpen(false);
      }
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

  const dialogProps = isDialogControlled
    ? { open: dialogOpen, onOpenChange: setDialogOpen }
    : undefined;

  return { isPending, onSubmit, dialogProps };
}
