import BackButton from "@/components/BackButton";
import { MagicWand } from "iconoir-react";
import { default as LeagueHeader } from "@/features/leagues/components/Header";
import CreateLeagueForm from "@/features/leagues/components/forms/CreateLeagueForm";

export default function CreateLeaguePage() {
  return (
    <main className="flex flex-col">
      <LeagueHeader className="relative mb-5 mx-auto max-w-[800px]">
        <BackButton />

        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mb-6">
            <MagicWand className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading text-center text-primary-foreground mb-2">
            Benvenuto Presidente,
          </h1>
          <p className="text-center text-primary-foreground/90 mb-4">
            crea la tua lega e inizia a competere!
          </p>
        </div>
      </LeagueHeader>

      <div className="flex-1">
        <div className="mx-auto max-w-[800px] p-6">
          <CreateLeagueForm />
        </div>
      </div>
    </main>
  );
}
