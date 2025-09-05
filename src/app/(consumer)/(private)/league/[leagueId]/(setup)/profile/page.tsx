import { LeagueProfileForm } from "@/features/(league)/leagues/components/forms/LeagueProfileForm";
import { getLeague } from "@/features/(league)/leagues/queries/league";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LeagueProfilePage({
  params,
}: PageProps<"/leagues/[leagueId]/profile">) {
  const { leagueId } = await params;

  const league = await getLeague(leagueId);
  if (!league) notFound();

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <div className="flex items-center mb-4 md:mb-8 md:hidden">
        <Link href={`/leagues/${leagueId}`} className="mr-3">
          <ArrowLeft className="size-5" />
        </Link>
        <h2 className="text-2xl font-heading">Profilo lega</h2>
      </div>
      <h2 className="hidden md:block text-3xl font-heading mb-8">
        Profilo lega
      </h2>
      <LeagueProfileForm
        leagueId={leagueId}
        initialData={{ ...league, image: null }}
      />
    </div>
  );
}
