
import { default as LeagueHeader } from "@/features/(league)/leagues/components/Header";
import Logo from "@/components/ui/logo";
import Disclaimer from "@/components/Disclaimer";
import JoinPrivateLeagueForm from "@/features/(league)/leagues/components/forms/JoinPrivateLeagueForm";
import BackButton from "@/components/BackButton";
import { JOIN_CODE_LENGTH } from "@/features/(league)/leagues/schema/leagueBase";
import { getUser } from "@/features/users/utils/user";
import { Suspense } from "react";

export const experimental_ppr = true;

export default function JoinPrivateLeaguePage() {
  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1 className="text-3xl font-heading text-center text-primary-foreground my-2">
            Lega Privata
          </h1>
          <p className="text-center text-primary-foreground/80 mt-2 text-sm">
            Inserisci il codice di invito per unirti
          </p>
        </div>
      </LeagueHeader>

      <main className="px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="text-lg font-heading mb-2">
              Unisciti a una Lega Privata
            </h2>
            <p className="text-sm text-muted-foreground">
              Hai ricevuto un codice di invito? Inseriscilo qui sotto per
              accedere alla lega.
            </p>
          </div>

          <Suspense fallback={<JoinPrivateLeagueForm />}>
            <SuspenseBoundary />
          </Suspense>

          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h3 className="text-sm font-medium mb-2">💡 Suggerimento</h3>
            <p className="text-xs text-muted-foreground">
              Il codice di invito è solitamente composto da {JOIN_CODE_LENGTH}{" "}
              caratteri e ti viene fornito dal creatore della lega. Se non
              funziona, controlla di averlo inserito correttamente.
            </p>
          </div>
        </div>
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}

async function SuspenseBoundary() {
  const user = await getUser();
  return <JoinPrivateLeagueForm isAuthenticated={!!user} />;
}
