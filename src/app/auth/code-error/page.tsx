import Link from "next/link";
import { WarningCircle, Mail } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { Refresh } from "iconoir-react/regular";

export default function AuthErrorPage() {
  return (
    <>
      <div className="w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <WarningCircle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-heading mb-2">Autenticazione fallita</h1>

        <p className="text-muted-foreground mb-8">
          Non siamo riusciti a verificare la tua identità. Questo potrebbe
          essere dovuto a un codice errato o scaduto.
        </p>

        <div className="space-y-3 w-full">
          <Button variant="gradient" asChild>
            <Link href="/">
              <Refresh className="size-5" />
              Riprova
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support">
              <Mail className="size-5" />
              Contatta supporto
            </Link>
          </Button>
        </div>
      </div>
      {/* <div className="space-y-2 text-center mt-8">
        <p className="text-sm text-muted-foreground">Problemi con l'accesso?</p>
        <Link href="/auth/login" className="text-primary hover:underline">
          Accedi con un altro metodo
        </Link>
      </div> */}
    </>
  );
}
