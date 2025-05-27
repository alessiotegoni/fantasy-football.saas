"use client";

import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";
import { useFormStatus } from "react-dom";

type Props = ComponentPropsWithoutRef<typeof Button> & {
  loadingText?: string;
  isLoading?: boolean;
  loaderCircleClassName?: string;
};

export default function SubmitButton({
  isLoading,
  loadingText = "Caricamento",
  loaderCircleClassName,
  className,
  disabled,
  children,
  ...props
}: Props) {
  const form = useFormContext();
  const { pending } = useFormStatus();

  const isPending =
    isLoading ||
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
          <LoaderCircle
            className={cn("animate-spin !size-5", loaderCircleClassName)}
          />
          {loadingText && `${loadingText}...`}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
