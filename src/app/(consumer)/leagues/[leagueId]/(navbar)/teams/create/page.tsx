import { LeagueTeamForm } from "@/features/(league)/teams/components/LeagueTeamForm";

export default async function CreateLeagueTeamPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <h2 className="text-2xl md:text-3xl font-heading mb-8">
        Crea la tua squadra
      </h2>
      <LeagueTeamForm leagueId={leagueId} />
    </div>
  );
}
