"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { TradeProposalSchema, tradeProposalSchema } from "../schema/trade";
import { Form } from "@/components/ui/form";
import TeamsSelectField from "@/features/teams/components/TeamsSelectField";
import { getLeagueTeams } from "../../teams/queries/leagueTeam";
import { Suspense, use, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "iconoir-react";
import FormSliderField from "@/components/FormFieldSlider";
import TradeProposalCard from "./TradeProposalCard";
import TradePlayersMultiSelect from "./TradePlayersMultiSelect";
import { getTeamPlayers } from "../../teamsPlayers/queries/teamsPlayer";

type Props = {
  leagueId: string;
  leagueTeams: Awaited<ReturnType<typeof getLeagueTeams>>;
  proposerTeamPlayersPromise: ReturnType<typeof getTeamPlayers> | undefined;
  receiverTeamPlayersPromise: ReturnType<typeof getTeamPlayers> | undefined;
};

export default function TradeProposalForm({
  leagueId,
  leagueTeams,
  proposerTeamPlayersPromise,
  receiverTeamPlayersPromise,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const proposerTeamId = searchParams.get("proposerTeamId") as string;

  const form = useForm<TradeProposalSchema>({
    resolver: zodResolver(tradeProposalSchema),
    defaultValues: {
      leagueId,
      creditOfferedByProposer: null,
      creditRequestedByProposer: null,
      proposerTeamId,
      receiverTeamId: searchParams.get("receiverTeamId") ?? "",
      players: []
    },
  });

  const {
    fields: tradePlayers,
    append: appendPlayer,
    remove: removePlayer,
  } = useFieldArray({
    control: form.control,
    name: "players",
    keyName: undefined,
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

  const proposerTeam = useMemo(
    () => leagueTeams.find((team) => team.id === proposerTeamId),
    [proposerTeamId]
  );

  const receiverTeamId = form.watch("receiverTeamId");
  const receiverTeam = useMemo(
    () => leagueTeams.find((team) => team.id === receiverTeamId),
    [receiverTeamId]
  );

  useEffect(() => {
    console.log(searchParams.toString());
    if (!receiverTeam) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("receiverTeamId", receiverTeam.id);

    router.replace(`?${newSearchParams.toString()}`);
  }, [receiverTeam]);

  async function onSubmit(values: TradeProposalSchema) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              renderSelectPlayers={() =>
                proposerTeamPlayersPromise && (
                  <Suspense>
                    <TradePlayersMultiSelect
                      triggerText="Offri giocatori"
                      players={use(proposerTeamPlayersPromise)}
                    />
                  </Suspense>
                )
              }
            />
          ) : null}

          {receiverTeam ? (
            <TradeProposalCard
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
              renderSelectPlayers={() =>
                receiverTeamPlayersPromise && (
                  <Suspense>
                    <TradePlayersMultiSelect
                      triggerText="Richiedi giocatori"
                      players={use(receiverTeamPlayersPromise)}
                    />
                  </Suspense>
                )
              }
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
                  <TeamsSelectField<TradeProposalSchema>
                    name="receiverTeamId"
                    teams={leagueTeams
                      .filter((team) => team.id !== proposerTeamId)
                      .map((team) => ({ id: team.id, name: team.name }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* {canSubmit && (
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full"
            >
              Invia proposta
            </Button>
          </div>
        )} */}
      </form>
    </Form>
  );
}
