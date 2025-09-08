"use client";

import { useTransition, useState } from "react";
import useActionToast from "./useActionToast";
import { useParams, useRouter } from "next/navigation";
import { Href } from "@/utils/helpers";

export default function useHandleSubmit<T>(
  submitFn:
    | ((args: T) => Promise<{ error: boolean; message: string }>)
    | undefined,
  options?: {
    redirectTo?: Href;
    isLeaguePrefix?: boolean;
    onSuccess?: () => void;
    onError?: () => void;
    isDialogControlled?: boolean;
    displayToast?: boolean;
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
    onError,
    isDialogControlled = false,
    displayToast = true,
  } = options ?? {};

  function onSubmit(args: T) {
    if (!submitFn) return;
    startTransition(async () => {
      const result = await submitFn(args);
      if (displayToast) toast(result);

      if (!result.error) {
        handleRedirect();
        onSuccess?.();
        if (isDialogControlled) setDialogOpen(false);
        return;
      }

      onError?.();
    });
  }

  function handleRedirect() {
    if (!redirectTo) return;

    if (isLeaguePrefix && leagueId) {
      router.push(
        `/league/${leagueId}${redirectTo}` as Href
      );
      return;
    }

    router.push(redirectTo);
  }

  const dialogProps = isDialogControlled
    ? { open: dialogOpen, onOpenChange: setDialogOpen }
    : undefined;

  return { isPending, onSubmit, dialogProps };
}
