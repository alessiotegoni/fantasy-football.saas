import Logo from "@/components/ui/logo";
import { default as LeagueHeader } from "@/features/(league)/leagues/components/Header";
import BackButton from "@/components/BackButton";
import Disclaimer from "@/components/Disclaimer";
import JoinLeagueLinks from "@/features/(league)/leagues/components/JoinLeagueLinks";
import { getUser } from "@/features/users/utils/user";
import { Suspense } from "react";

export const experimental_ppr = true;

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
          <Suspense fallback={<JoinLeagueLinks />}>
            <SuspenseBoundary />
          </Suspense>
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
  return <JoinLeagueLinks isAuthenticated={!!user} />;
}
