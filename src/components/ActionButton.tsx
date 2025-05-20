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
import { ComponentPropsWithoutRef, useTransition } from "react";

type Props = ComponentPropsWithoutRef<typeof Button> & {
  action: () => Promise<{ error: boolean; message: string }>;
  loadingText?: string;
  requireAreYouSure?: boolean;
  displayToast?: boolean;
};

export default function ActionButton({
  action,
  loadingText = "Caricamento",
  requireAreYouSure = false,
  displayToast = true,
  className,
  disabled,
  children,
  ...props
}: Props) {
  const [isPending, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const res = await action();
      if (displayToast) actionToast(res);
    });
  }

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
          <Button {...props} className={cn("w-full", className)} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata.
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
