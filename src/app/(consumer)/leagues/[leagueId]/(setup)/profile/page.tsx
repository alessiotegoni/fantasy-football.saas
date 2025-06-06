import { db } from "@/drizzle/db";
import { LeagueProfileForm } from "@/features/(league)/leagues/components/forms/LeagueProfileForm";
import { getLeagueProfileTag } from "@/features/(league)/leagues/db/cache/league";
import { ArrowLeft } from "iconoir-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export default async function LeagueProfilePage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const leagueProfile = await getLeagueProfile(leagueId);

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
      <LeagueProfileForm leagueId={leagueId} initialData={leagueProfile} />
    </div>
  );
}

async function getLeagueProfile(leagueId: string) {
  "use cache";
  cacheTag(getLeagueProfileTag(leagueId));

  const leagueProfile = await db.query.leagues.findFirst({
    columns: {
      name: true,
      imageUrl: true,
      description: true,
      visibility: true,
      password: true,
    },
    where: (league, { eq }) => eq(league.id, leagueId),
  });

  return leagueProfile ? { ...leagueProfile, image: null } : undefined;
}
