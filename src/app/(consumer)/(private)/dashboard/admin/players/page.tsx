import ActionButton from "@/components/ActionButton";
import Container from "@/components/Container";
import { revalidatePlayers } from "@/features/dashboard/admin/players/db/cache/player";
import { createSuccess, SuccessResult } from "@/utils/helpers";

export default function PlayersPage() {

    return (
        <Container
        headerLabel="Giocatori"
        renderHeaderRight={() => (
            <ActionButton
            loadingText="Rivalido"
            action={handleRevalidatePlayers}
            className="w-fit"
            >
          Rivalida cache
        </ActionButton>
      )}
      ></Container>
    );
}

async function handleRevalidatePlayers(): Promise<SuccessResult<null>> {
  "use server";
  revalidatePlayers();

  return new Promise((resolve) =>
    resolve(createSuccess("Cache rivalidate con successo", null))
  );
}
