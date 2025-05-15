"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { otpSchema, OtpSchema } from "../schema/otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { verifyOtp } from "../actions/verify-otp";

export default function VerifyOtpForm() {
  const router = useRouter();
  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: "sp.aletheking05@gmail.com",
      token: "",
    },
  });

  async function onSubmit(data: OtpSchema) {
    const res = await verifyOtp(data);
    if (res?.error) {
      form.setError("root", { message: res.message });
      return;
    }

    router.push("/");
  }

  return (
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
                    className="!rounded-2xl size-12 xs:size-15 sm:size-17 font-bold"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          disabled={form.watch("token").length !== 6}
        >
          Verifica
        </Button>
      </form>
    </Form>
  );
}
