"use client";

import PlayersActionsDialog from "./PlayersActionsDialog";
import {
  releaseTeamPlayerSchema,
  type ReleaseTeamPlayerSchema,
} from "@/features/(league)/teamsPlayers/schema/teamsPlayer";
import FormSliderField from "@/components/FormFieldSlider";
import SubmitButton from "@/components/SubmitButton";
import NumberInput from "@/components/ui/number-input";
import { useParams } from "next/navigation";
import { addTeamPlayer } from "../actions/teamsPlayer";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";

export default function ReleasePlayerDialog() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { selectedPlayer, selectedTeamId } = usePlayerSelection();

  return (
    <PlayersActionsDialog
      title="Svincola giocatore"
      description="Svincola il giocatore dal team"
      formSchema={releaseTeamPlayerSchema}
      formDefaultValues={{
        leagueId,
        memberTeamId: selectedTeamId ?? undefined,
        player: selectedPlayer
          ? {
              id: selectedPlayer.id,
              roleId: selectedPlayer.roleId,
            }
          : undefined,
      }}
      onFormSubmit={addTeamPlayer}
      renderFormFields={() => (
        <div className="my-5">
          <FormSliderField<ReleaseTeamPlayerSchema>
            name="releaseCost"
            label="Crediti di svincolo"
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
