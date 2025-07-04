"use client";

import ActionButton from "@/components/ActionButton";
import { useTeamsCredits } from "@/contexts/TeamsCreditsProvider";
import { setTeamsCredits } from "../actions/handle-credits";

export default function UpdateCreditsButton({
  leagueId,
}: {
  leagueId: string;
}) {
  const { changes, resetChanges } = useTeamsCredits();
  if (!changes.length) return null;

  async function saveCredits() {
    const res = await setTeamsCredits({
      leagueId,
      updatedTeamsCredits: changes,
    });
    if (!res.error) resetChanges();

    return res;
  }

  return (
    <div className="w-full fixed left-1/2 -translate-x-1/2 bottom-[99px] sm:static sm:translate-0 z-50 px-4 sm:px-0">
      <ActionButton
        action={saveCredits}
        loadingText="Salvo crediti"
        className="h-fit py-3 sm:w-fit sm:min-w-[100px] rounded-xl"
      >
        Salva
      </ActionButton>
    </div>
  );
}
