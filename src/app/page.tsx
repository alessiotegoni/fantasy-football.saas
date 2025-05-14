"use client";
import Link from "next/link";
import { ArrowLeft, NavArrowRight, Group, Trophy } from "iconoir-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-b from-primary to-secondary px-6 relative">
        <Link
          href="/"
          className="flex items-center text-primary-foreground pt-12 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Indietro</span>
        </Link>

        <div className="flex flex-col items-center py-8">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="KickLeague mascot"
            width={80}
            height={80}
            className="drop-shadow-lg mb-6"
          />
          <h1 className="text-3xl font-heading text-center text-primary-foreground mb-12">
            Il tuo Fantacalcio inizia qui
          </h1>
        </div>
      </header>

      <div className="px-6 -mt-6 flex-1">
        <div className="bg-background rounded-2xl shadow-sm p-6 mb-6">
          <Link
            href="/create-league"
            className="flex items-center justify-between p-4 bg-muted rounded-xl mb-4"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-heading">Crea una nuova Lega</span>
            </div>
            <NavArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <p className="text-sm text-center text-muted-foreground px-4 mb-8">
            Organizza il tuo torneo e scegli le tue regole. Invita i tuoi amici
            o trovane nuovi on-line grazie a noi. Sarai tu a gestire la Lega
            come Presidente.
          </p>

          <Link
            href="/join-league"
            className="flex items-center justify-between p-4 bg-muted rounded-xl mb-4"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Group className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-heading">Unisciti a una Lega</span>
            </div>
            <NavArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <p className="text-sm text-center text-muted-foreground px-4">
            I tuoi amici ti hanno invitato in una Lega? Vuoi giocare con nuovi
            amici? Una Lega è già in attesa della tua squadra.
          </p>
        </div>
      </div>
    </main>
  );
}
