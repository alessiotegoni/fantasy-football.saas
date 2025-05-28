import Link from "next/link";
import { ArrowLeft, Group, Trophy } from "iconoir-react";
import Logo from "@/components/ui/logo";
import { default as LeagueHeader } from "@/features/leagues/components/Header";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Disclaimer from "@/components/Disclaimer";
import { getUser, getUserMetadata } from "@/features/users/utils/user";

export default function HomePage() {
  return (
    <>
      <LeagueHeader className="relative">
        <Suspense fallback={null}>
          <BackToLeagueButton />
        </Suspense>
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1
            className="text-3xl font-heading text-center text-primary-foreground
             leading-11 sm:hidden"
          >
            Il tuo Fantacalcio <br /> inizia qui
          </h1>
          <h1
            className="hidden sm:block text-3xl font-heading text-center text-primary-foreground
            my-2"
          >
            Il tuo Fantacalcio inizia qui
          </h1>
        </div>
      </LeagueHeader>
      <main>
        <div className="flex-1 flex flex-col items-center">
          <div className="grid gap-6 md:grid-cols-2 mx-auto max-w-[900px] px-6">
            <Link
              href="/leagues/create"
              className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="size-10 sm:size-13 text-primary" />
              </div>
              <span className="text-xl font-heading mb-2">
                Crea una nuova Lega
              </span>
              <p className="text-sm text-muted-foreground">
                Organizza il tuo torneo e scegli le tue regole. Invita i tuoi
                amici o trovane nuovi online. Sarai tu a gestire la Lega come
                Presidente.
              </p>
            </Link>

            <Link
              href="/leagues/join"
              className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Group className="size-10 sm:size-13 text-primary" />
              </div>
              <span className="text-xl font-heading mb-2">
                Unisciti a una Lega
              </span>
              <p className="text-sm text-muted-foreground">
                I tuoi amici ti hanno invitato in una Lega? Vuoi giocare con
                nuovi amici? Una Lega è già in attesa della tua squadra.
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

async function BackToLeagueButton() {
  const user = await getUser();
  if (!user) return null;

  const lastUserLeagueId = getUserMetadata(user, "last_league_id");
  if (!lastUserLeagueId) return null;

  return (
    <Button
      variant="link"
      className="w-fit absolute left-2 top-2 text-white"
      asChild
    >
      <Link href={`/leagues/${lastUserLeagueId}`}>
        <ArrowLeft className="size-4" />
        <p>Torna alla lega</p>
      </Link>
    </Button>
  );
}
