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
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { actionToast, cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useTransition } from "react";
import { ExternalToast } from "sonner";

type Props = ComponentPropsWithoutRef<typeof Button> & {
  action: () => Promise<{ error: boolean; message: string }>;
  onPendingChange?: (pending: boolean) => void;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
  displayToast?: boolean;
  toastData?: ExternalToast
};

export default function ActionButton({
  action,
  onPendingChange,
  loadingText = "Caricamento",
  requireAreYouSure = false,
  areYouSureDescription = "Questa azione non può essere annullata",
  displayToast = true,
  toastData,
  className,
  disabled,
  children,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const res = await action();
      if (displayToast) actionToast(res, toastData);
    });
  }

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
      <AlertDialog open={isPending ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} className={cn("w-full", className)}>
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
            <AlertDialogAction
              disabled={isPending}
              onClick={performAction}
              className="bg-destructive hover:bg-destructive/90"
            >
              {content}
            </AlertDialogAction>
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
