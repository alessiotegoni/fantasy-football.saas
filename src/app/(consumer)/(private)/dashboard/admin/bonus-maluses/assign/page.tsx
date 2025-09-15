import Container from "@/components/Container";
import BonusMalusForm from "@/features/dashboard/admin/bonusMaluses/components/BonusMalusForm";
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
    <Container headerLabel="Assegna bonus/malus">
      <h3 className="text-xl font-medium mb-4">Giornata: {matchday.number}</h3>
      <BonusMalusForm
        matchday={matchday}
        bonusMalusTypes={bonusMalusTypes}
        players={players}
      />
    </Container>
  );
}
