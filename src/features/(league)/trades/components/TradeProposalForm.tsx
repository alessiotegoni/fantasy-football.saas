"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { TradeProposalSchema, tradeProposalSchema } from "../schema/trade";
import { Form } from "@/components/ui/form";
import { LeagueTeam } from "../../teams/queries/leagueTeam";
import { useMemo } from "react";
import { SendEuros, UserPlus, WarningTriangle } from "iconoir-react";
import FormSliderField from "@/components/FormFieldSlider";
import TradeProposalCard from "./TradeProposalCard";
import TradePlayersMultiSelect from "./TradePlayersMultiSelect";
import BackButton from "@/components/BackButton";
import SubmitButton from "@/components/SubmitButton";
import { useTradePlayers } from "@/contexts/TradePlayersProvider";
import TradeReceiverTeamSelect from "./TradeReceiverTeamSelect";

type Props = {
  leagueId: string;
  leagueTeams: LeagueTeam[];
  proposerTeam: LeagueTeam | undefined;
  receiverTeam: LeagueTeam | undefined;
};

export default function TradeProposalForm({
  leagueId,
  leagueTeams,
  proposerTeam,
  receiverTeam,
}: Props) {
  const { proposerTeamPlayers, receiverTeamPlayers } = useTradePlayers();

  const form = useForm<TradeProposalSchema>({
    resolver: zodResolver(tradeProposalSchema),
    defaultValues: {
      leagueId,
      creditOfferedByProposer: null,
      creditRequestedByProposer: null,
      proposerTeamId: proposerTeam?.id,
      receiverTeamId: receiverTeam?.id,
      players: [],
    },
  });

  const {
    fields: tradePlayers,
    append: appendPlayer,
    remove: removePlayer,
  } = useFieldArray({
    control: form.control,
    name: "players",
    keyName: "fieldKey",
  });

  const groupedTradePlayers = useMemo(() => {
    const playersWithIndexes = tradePlayers.map((player, index) => ({
      ...player,
      index,
    }));
    return Object.groupBy(playersWithIndexes, (player) =>
      player.offeredByProposer ? "proposed" : "requested"
    );
  }, [tradePlayers]);

  async function onSubmit(values: TradeProposalSchema) {}

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      {form.formState.errors.root && (
        <div className="flex justify-center items-center gap-2 bg-destructive/80 border border-destructive">
          <WarningTriangle />
          {form.formState.errors.root.message}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-6">
          {proposerTeam ? (
            <TradeProposalCard
              leagueId={leagueId}
              team={proposerTeam}
              players={groupedTradePlayers["proposed"]}
              removePlayer={removePlayer}
              renderCreditsSlider={() => (
                <FormSliderField<TradeProposalSchema>
                  name="creditOfferedByProposer"
                  min={0}
                  max={proposerTeam.credits}
                  label="Offri crediti"
                  unit="Crediti offerti"
                />
              )}
              renderSelects={() =>
                proposerTeamPlayers && (
                  <TradePlayersMultiSelect
                    triggerText="Offri giocatori"
                    players={proposerTeamPlayers}
                    onPlayerSelect={appendPlayer}
                  />
                )
              }
            />
          ) : (
            <div className="bg-sidebar/80 p-4 rounded-3xl">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <WarningTriangle className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Il team che fa la proposta di scambio deve essere il tuo
                </p>
                <BackButton />
              </div>
            </div>
          )}

          {receiverTeam ? (
            <TradeProposalCard
              isProposer={false}
              leagueId={leagueId}
              team={receiverTeam}
              players={groupedTradePlayers["requested"]}
              removePlayer={removePlayer}
              renderCreditsSlider={() => (
                <FormSliderField<TradeProposalSchema>
                  name="creditRequestedByProposer"
                  min={0}
                  max={receiverTeam.credits}
                  label="Richiedi crediti"
                  unit="Crediti richiesti"
                />
              )}
              renderSelects={() => (
                <div className="grid xl:grid-cols-2 gap-2 mt-8">
                  <TradeReceiverTeamSelect
                    leagueTeams={leagueTeams}
                    className="!h-fit w-full py-3.5 justify-center"
                    placeholder="Cambia squadra"
                  />
                  {receiverTeamPlayers && (
                    <TradePlayersMultiSelect
                      className="w-full mt-0"
                      triggerText="Richiedi giocatori"
                      players={receiverTeamPlayers}
                      onPlayerSelect={appendPlayer}
                      offeredByProposer={false}
                    />
                  )}
                </div>
              )}
            />
          ) : (
            <div className="bg-sidebar/80 p-4 rounded-3xl">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Seleziona una squadra dalla tua lega per iniziare una proposta
                  di scambio.
                </p>
                <div className="flex justify-center">
                  <TradeReceiverTeamSelect leagueTeams={leagueTeams} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <SubmitButton
            type="submit"
            className="mt-6 min-w-56 md:max-w-60"
            disabled={proposerTeam?.id === receiverTeam?.id}
          >
            Invia proposta
            <SendEuros className="size-6" />
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
