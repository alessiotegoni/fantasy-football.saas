import VerifyOtpForm from "@/features/auth/components/VerifyOtpForm";

export default function VerifyPage() {
  return (
    <>
      <h1 className="text-2xl font-heading mb-1">Verifica il tuo accesso</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Abbiamo inviato un codice a 6 cifre alla tua email. Inseriscilo qui
        sotto per continuare.
      </p>

      <VerifyOtpForm />
    </>
  );
}
