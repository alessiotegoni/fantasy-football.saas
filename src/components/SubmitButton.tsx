"use client";

import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";
import { useFormStatus } from "react-dom";

type Props = ComponentPropsWithoutRef<typeof Button> & {
  loadingText?: string;
};

export default function SubmitButton({
  loadingText = "Caricamento",
  className,
  disabled,
  children,
  ...props
}: Props) {
  const form = useFormContext();
  const { pending } = useFormStatus();

  const isPending =
    form?.formState?.isSubmitSuccessful ||
    form?.formState?.isSubmitting ||
    pending;

  return (
    <Button
      type="submit"
      disabled={isPending || disabled}
      className={cn("w-full", className)}
      {...props}
    >
      {isPending ? (
        <>
          <LoaderCircle className="animate-spin !size-5" />
          {loadingText && `${loadingText}...`}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
