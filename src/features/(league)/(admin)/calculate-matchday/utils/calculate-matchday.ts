import { SplitMatchday } from "@/features/splits/queries/split";

export function isMatchdayCalculable(matchday: SplitMatchday) {
  const calculableFromDate = new Date(matchday.endAt);
  calculableFromDate.setDate(calculableFromDate.getDate() + 1);
  calculableFromDate.setHours(0, 30, 0, 0);

  const isCalculable =
    matchday.status === "ended" && new Date() > calculableFromDate;

  return isCalculable;
}
