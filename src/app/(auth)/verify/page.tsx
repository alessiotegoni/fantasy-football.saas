"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 5) {
      // Simula la verifica
      router.push("/");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-heading mb-1">Verifica il tuo accesso</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Abbiamo inviato un codice a 6 cifre alla tua email. Inseriscilo qui
        sotto per continuare.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => setOtp(val)}
          containerClassName="justify-between"
          className="w-full"
        >
          <InputOTPGroup className="w-full gap-3 justify-between">
            {[...Array(5)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="!rounded-2xl size-13 xs:size-15 sm:size-17 font-bold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          disabled={otp.length !== 5}
        >
          Verifica
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Non hai ricevuto il codice?
        </p>
        <Button variant="link" className="mt-1.5 p-0 h-auto">
          Invia di nuovo
        </Button>
      </div>
    </>
  );
}
