import { getSplitMatchdays } from "@/features/splits/queries/split";

export async function getCalculableMatchday(splitId: number) {
  const matchdays = await getSplitMatchdays(splitId);

  const lastEndedMatchday = matchdays.findLast(
    (matchday) => matchday.status === "ended"
  );

  if (!lastEndedMatchday) {
    return {
      isCalculable: false,
      matchday: null,
    };
  }

  const calculableFromDate = new Date(lastEndedMatchday.endAt);
  calculableFromDate.setDate(calculableFromDate.getDate() + 1);
  calculableFromDate.setHours(0, 30, 0, 0);

  const isCalculable = new Date() > calculableFromDate;

  return {
    isCalculable,
    matchday: lastEndedMatchday,
  };
}
