"use client";

import PlayersActionsDialog from "./PlayersActionsDialog";
import {
  insertTeamPlayerSchema,
  InsertTeamPlayerSchema,
} from "@/features/(league)/teamsPlayers/schema/teamsPlayer";
import TeamsSelectField from "@/features/dashboard/admin/teams/components/TeamsSelectField";
import FormSliderField from "@/components/FormFieldSlider";
import SubmitButton from "@/components/SubmitButton";
import { use } from "react";
import NumberInput from "@/components/ui/number-input";
import { useParams } from "next/navigation";
import { addTeamPlayer } from "../actions/teamsPlayer";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import { Team } from "@/features/dashboard/admin/teams/queries/team";
import { LeagueTeam } from "../../teams/queries/leagueTeam";

export default function InsertPlayerDialog({
  teams = [],
}: {
  teams?: LeagueTeam[];
}) {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { selectedPlayer, selectedTeamId } = usePlayerSelection();

  return (
    <PlayersActionsDialog<InsertTeamPlayerSchema>
      title="Aggiungi giocatore"
      description="Aggiungi il giocatore alla rosa di un membro della lega a tua scelta"
      formSchema={insertTeamPlayerSchema}
      formDefaultValues={{
        leagueId,
        memberTeamId: selectedTeamId ?? undefined,
        player: selectedPlayer
          ? {
              id: selectedPlayer.id,
              roleId: selectedPlayer.role.id,
            }
          : undefined,
        purchaseCost: 200,
      }}
      onFormSubmit={addTeamPlayer}
      renderFormFields={({ toggleSelectTeam }) => (
        <div className="my-5 space-y-7">
          <div className="flex justify-center">
            <TeamsSelectField<InsertTeamPlayerSchema>
              name="memberTeamId"
              teams={teams}
              onSelect={toggleSelectTeam}
            />
          </div>
          <FormSliderField<InsertTeamPlayerSchema>
            name="purchaseCost"
            label="Crediti spesi"
            tip="I crediti spesi dalla squadra verranno automaticamente sottratti dai suoi crediti totali"
            min={0}
            max={5000}
            step={1}
            unit="crediti"
            renderNumberInput={(props) => <NumberInput {...props} />}
          />
        </div>
      )}
      renderSubmitButton={({ selectedTeamId }) => (
        <SubmitButton
          loadingText="Aggiungo giocatore"
          className="w-full sm:w-fit"
          disabled={!selectedTeamId}
        >
          Aggiungi giocatore
        </SubmitButton>
      )}
    />
  );
}
