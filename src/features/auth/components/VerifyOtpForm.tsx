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
import { toast } from "sonner";
import ActionButton from "@/components/ActionButton";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
import { Edit } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { otpSchema, OtpSchema } from "../schema/login";
import { verifyOtp } from "../actions/login";

export default function VerifyOtpForm() {
  const { getEmail, clearEmail, resendCode } = useEmailLogin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      token: "",
    },
  });

  useEffect(() => {
    const email = getEmail();
    if (!email) return router.push("/auth/login");
    form.setValue("email", email);
  }, []);

  async function onSubmit(data: OtpSchema) {
    const res = await verifyOtp(data);

    if (res?.error) {
      toast.error(res.message);
      return;
    }

    const redirectUrl = searchParams.get("next");
    router.push(redirectUrl || "/");

    clearEmail();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <span className="font-medium">{getEmail()}</span>
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
            loadingText="Verifico codice"
            variant="gradient"
            disabled={form.watch("token").length !== 6 || !getEmail()}
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
          disabled={!getEmail()}
          displayToast={false}
          action={resendCode}
        >
          Invia di nuovo
        </ActionButton>
      </div>
    </>
  );
}
