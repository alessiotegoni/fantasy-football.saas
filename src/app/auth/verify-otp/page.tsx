import { Button } from "@/components/ui/button";
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

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Non hai ricevuto il codice?
        </p>
        <Button variant="link" className="mt-1.5 p-0 h-auto w-fit">
          Invia di nuovo
        </Button>
      </div>
    </>
  );
}

