import Link from "next/link";
import { Globe, Lock } from "iconoir-react";
import Logo from "@/components/ui/logo";
import { default as LeagueHeader } from "@/features/leagues/components/Header";
import BackButton from "@/components/BackButton";
import Disclaimer from "@/components/Disclaimer";

export default function JoinLeaguePage() {
  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1 className="text-3xl font-heading text-center text-primary-foreground leading-11 sm:hidden">
            Unisciti a una <br /> Lega esistente
          </h1>
          <h1 className="hidden sm:block text-3xl font-heading text-center text-primary-foreground my-2">
            Unisciti a una Lega esistente
          </h1>
        </div>
      </LeagueHeader>

      <main>
        <div className="flex-1 flex flex-col items-center">
          <div className="grid gap-6 md:grid-cols-2 mx-auto max-w-[900px] px-6">
            <Link
              href="/leagues/join/public"
              className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="size-10 sm:size-13 text-primary" />
              </div>
              <span className="text-xl font-heading mb-2">
                Unisciti a una Lega Pubblica
              </span>
              <p className="text-sm text-muted-foreground">
                Esplora le leghe pubbliche disponibili e trova quella perfetta
                per te. Unisciti a giocatori da tutto il mondo e inizia subito a
                competere.
              </p>
            </Link>

            <Link
              href="/leagues/join/private"
              className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="size-10 sm:size-13 text-primary" />
              </div>
              <span className="text-xl font-heading mb-2">
                Unisciti a una Lega Privata
              </span>
              <p className="text-sm text-muted-foreground">
                Hai ricevuto un codice di invito? Inseriscilo qui per unirti a
                una lega privata creata dai tuoi amici o conoscenti.
              </p>
            </Link>
          </div>
        </div>
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}
