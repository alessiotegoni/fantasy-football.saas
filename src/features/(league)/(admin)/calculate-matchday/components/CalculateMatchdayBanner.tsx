import EmptyState from "@/components/EmptyState";
import { getLastEndedMatchday } from "@/features/splits/queries/split";
import { isAlreadyCalculated } from "../permissions/calculate-matchday";

export default async function CalculateMatchdayBanner({
  splitId,
  leagueId,
}: {
  splitId: number;
  leagueId: string;
}) {
  const matchday = await getLastEndedMatchday(splitId);
  if (!matchday) return <CalculateEmptyState />;

  if (await isAlreadyCalculated(leagueId, matchday.id)) return null;

  const calculableFromDate = new Date(matchday.endAt);
  calculableFromDate.setDate(calculableFromDate.getDate() + 1);
  calculableFromDate.setHours(0, 30, 0, 0);

  const isCalculable = new Date() > calculableFromDate;

  if (!isCalculable) return <CalculateEmptyState />;
}

function CalculateEmptyState() {
  return (
    <EmptyState
      title="Giornata non ancora calcolabile"
      description="Potrai calcolare la giornata dopo la mezzanotte e mezza"
    />
  );
}
