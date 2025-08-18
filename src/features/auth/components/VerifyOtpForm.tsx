"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { useEmailLogin } from "@/hooks/useLoginEmail";
import { useEffect } from "react";
import ActionButton from "@/components/ActionButton";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { Edit } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { otpSchema, OtpSchema } from "../schema/login";
import { verifyOtp } from "../actions/login";
import useHandleSubmit from "@/hooks/useHandleSubmit";

export default function VerifyOtpForm() {
  const { email, clearEmail, resendCode } = useEmailLogin();

  const searchParams = useSearchParams();

  const { isPending, onSubmit: handleVerifyOtp } = useHandleSubmit(onSubmit, {
    isLeaguePrefix: false,
    redirectTo: searchParams.get("next") || "/",
  });

  async function onSubmit(data: OtpSchema) {
    const result = await verifyOtp(data);
    clearEmail();

    return result;
  }

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email,
      token: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyOtp)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                containerClassName="justify-between"
                className="w-full"
                {...field}
              >
                <InputOTPGroup className="w-full gap-2 justify-between">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="!rounded-2xl size-12 xs:size-15 sm:size-17 font-bold
                      text-base xs:text-lg sm:text-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />

          <div className="flex items-center justify-between mb-8 rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground">Codice inviato a: </span>
              <span className="font-medium">{email}</span>
            </div>
            <Button
              variant="link"
              size="sm"
              className="text-sm font-medium w-fit"
              asChild
            >
              <Link href="/auth/login">
                <Edit />
                Cambia
              </Link>
            </Button>
          </div>
          <SubmitButton
            isLoading={isPending}
            loadingText="Verifico codice"
            variant="gradient"
            disabled={form.watch("token").length !== 6 || !email}
          >
            Verifica
          </SubmitButton>
        </form>
      </Form>
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Non hai ricevuto il codice?
        </p>
        <ActionButton
          variant="link"
          loadingText="invio nuovo codice"
          className="w-fit"
          disabled={!email}
          displayToast={false}
          action={resendCode}
        >
          Invia di nuovo
        </ActionButton>
      </div>
    </>
  );
}
