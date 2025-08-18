"use client";

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { ExternalToast } from "sonner";
import useHandleSubmit from "@/hooks/useHandleSubmit";

type Props = ComponentPropsWithoutRef<typeof Button> & {
  action: () => Promise<{ error: boolean; message: string }>;
  onPendingChange?: (pending: boolean) => void;
  onSuccess?: () => void;
  onError?: () => void;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
  displayToast?: boolean;
  toastData?: ExternalToast;
  redirectTo?: string;
};

export default function ActionButton({
  action,
  onPendingChange,
  onSuccess,
  onError,
  loadingText = "Caricamento",
  requireAreYouSure = false,
  areYouSureDescription = "Questa azione non può essere annullata",
  displayToast = true,
  redirectTo,
  toastData,
  className,
  disabled,
  children,
  ...props
}: Props) {
  const {
    isPending,
    onSubmit: performAction,
    dialogProps,
  } = useHandleSubmit(action, {
    redirectTo,
    displayToast,
    isDialogControlled: requireAreYouSure,
    isLeaguePrefix: redirectTo?.includes("/leagues"),
    onSuccess,
    onError,
  });

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending]);

  const content = isPending ? (
    <>
      <LoaderCircle className="animate-spin !size-5" />
      {loadingText && `${loadingText}...`}
    </>
  ) : (
    children
  );

  if (requireAreYouSure) {
    return (
      <AlertDialog {...dialogProps}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isPending || disabled}
            className={cn("w-full", className)}
            {...props}
          >
            {content}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending || disabled}
              onClick={performAction}
              {...props}
            >
              {content}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      disabled={isPending || disabled}
      className={cn("w-full", className)}
      onClick={performAction}
      {...props}
    >
      {content}
    </Button>
  );
}
