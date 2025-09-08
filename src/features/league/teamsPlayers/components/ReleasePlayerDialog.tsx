"use client";

import PlayersActionsDialog from "./PlayersActionsDialog";
import {
  releaseTeamPlayerSchema,
  type ReleaseTeamPlayerSchema,
} from "@/features/league/teamsPlayers/schema/teamsPlayer";
import FormSliderField from "@/components/FormFieldSlider";
import SubmitButton from "@/components/SubmitButton";
import NumberInput from "@/components/ui/number-input";
import { useParams } from "next/navigation";
import { releaseTeamPlayer } from "../actions/teamsPlayer";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import { use } from "react";

export default function ReleasePlayerDialog({
  releasePercentagePromise,
}: {
  releasePercentagePromise: Promise<number>;
}) {
  const { leagueId, teamId: memberTeamId } = useParams<{
    leagueId: string;
    teamId: string;
  }>();
  const { selectedPlayer } = usePlayerSelection();

  const releasePercentage = use(releasePercentagePromise);
  const releaseCost = Math.floor(
    ((selectedPlayer?.purchaseCost ?? 0) * releasePercentage) / 100
  );

  return (
    <PlayersActionsDialog<ReleaseTeamPlayerSchema>
      title="Svincola giocatore"
      description="Svincola il giocatore dal team"
      formSchema={releaseTeamPlayerSchema}
      formDefaultValues={{
        leagueId,
        memberTeamId,
        playerId: selectedPlayer?.id ?? undefined,
        releaseCost,
      }}
      onFormSubmit={releaseTeamPlayer}
      renderFormFields={() => (
        <div className="my-5">
          <FormSliderField<ReleaseTeamPlayerSchema>
            name="releaseCost"
            label={`Crediti di svincolo (${releasePercentage}%)`}
            tip="I crediti di svincolo verranno automaticamente aggiunti ai crediti totali della squadra"
            min={0}
            max={5000}
            step={1}
            unit="crediti"
            renderNumberInput={(props) => <NumberInput {...props} />}
          />
        </div>
      )}
      renderSubmitButton={() => (
        <SubmitButton
          loadingText="Svincola giocatore"
          className="w-full sm:w-fit"
        >
          Svincola giocatore
        </SubmitButton>
      )}
    />
  );
}
