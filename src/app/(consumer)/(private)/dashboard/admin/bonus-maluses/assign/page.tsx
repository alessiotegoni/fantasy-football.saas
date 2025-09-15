import AssignBonusMalusPageContent from "@/features/dashboard/admin/bonusMaluses/components/AssignBonusMalusPageContent";
import { getBonusMalusTypes } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalusType";
import { getPlayers } from "@/features/dashboard/admin/players/queries/player";
import { getSplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { validateSerialId } from "@/schema/helpers";
import { redirect } from "next/navigation";

export default async function AssignBonusMalusesPage({
  searchParams,
}: PageProps<"/dashboard/admin/bonus-maluses/assign">) {
  const q = await searchParams;
  const matchdayId = parseInt(q.matchdayId as string);

  if (!matchdayId || !validateSerialId(matchdayId).success) {
    redirect("/dashboard/admin/bonus-maluses");
  }

  const [matchday, players, bonusMalusTypes] = await Promise.all([
    getSplitMatchday(matchdayId),
    getPlayers(),
    getBonusMalusTypes(),
  ]);

  return (
    <AssignBonusMalusPageContent
      matchday={matchday}
      players={players}
      bonusMalusTypes={bonusMalusTypes}
    />
  );
}
