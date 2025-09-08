"use client";

import Link from "next/link";
import { Globe, Lock } from "iconoir-react";
import { useRouter } from "next/navigation";

export default function JoinLeagueLinks({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const router = useRouter();

  function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/auth/login");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mx-auto max-w-[900px] px-6">
      <Link
        href="/join-league/public"
        onClick={handleLinkClick}
        className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Globe className="size-10 sm:size-13 text-primary" />
        </div>
        <span className="text-xl font-heading mb-2">
          Unisciti a una Lega Pubblica
        </span>
        <p className="text-sm text-muted-foreground">
          Esplora le leghe pubbliche disponibili e trova quella perfetta per te.
          Unisciti a giocatori da tutto il mondo e inizia subito a competere.
        </p>
      </Link>

      <Link
        href="/join-league/private"
        onClick={handleLinkClick}
        className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="size-20 sm:size-25 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="size-10 sm:size-13 text-primary" />
        </div>
        <span className="text-xl font-heading mb-2">
          Unisciti a una Lega Privata
        </span>
        <p className="text-sm text-muted-foreground">
          Hai ricevuto un codice di invito? Inseriscilo qui per unirti a una
          lega privata creata dai tuoi amici o conoscenti.
        </p>
      </Link>
    </div>
  );
}
