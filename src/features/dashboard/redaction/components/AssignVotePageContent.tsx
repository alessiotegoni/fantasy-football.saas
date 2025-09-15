"use client";

import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { useFieldArray, useForm } from "react-hook-form";
import { createVotesSchema, CreateVotesSchema } from "../votes/schema/vote";
import { SplitMatchday } from "../../admin/splits/queries/split";
import { Player } from "../../admin/players/queries/player";
import VoteFormFields from "./VoteFormFields";
import { Separator } from "@/components/ui/separator";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import { createVotes } from "../votes/actions/vote";

type Props = {
  matchday: SplitMatchday;
  players: Player[];
};

export default function AssignVotePageContent(props: Props) {
  const form = useForm<CreateVotesSchema>({
    resolver: zodResolver(createVotesSchema),
    defaultValues: {
      votes: [getDefaultValue(props)],
    },
  });

  const {
    fields: votes,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "votes",
  });

  const { isPending, onSubmit } = useHandleSubmit(createVotes, {
    isLeaguePrefix: false,
    redirectTo: `/dashboard/redaction/votes`,
  });

  return (
    <Container
      headerLabel="Assegna voti"
      renderHeaderRight={() => (
        <Button className="w-fit" onClick={() => append(getDefaultValue(props))}>
          <Plus className="size-5" />
          Aggiungi
        </Button>
      )}
    >
      <h3 className="text-xl font-semibold mb-4">
        Giornata: {props.matchday.number}
      </h3>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {votes.map((vote, index) => (
            <div key={vote.id} className="space-y-6">
              <VoteFormFields {...props} namePrefix={`votes.${index}`} />
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="sm:w-fit"
                  type="button"
                >
                  Rimuovi
                </Button>
              </div>
              {index !== votes.length - 1 && <Separator />}
            </div>
          ))}
          <MobileButtonsContainer className="sm:w-full bottom-5">
            <SubmitButton isLoading={isPending} loadingText="Assegno">
              Assegna
            </SubmitButton>
          </MobileButtonsContainer>
        </form>
      </Form>
    </Container>
  );
}

function getDefaultValue({
  matchday,
  players,
}: Props): CreateVotesSchema["votes"][number] {
  return {
    matchdayId: matchday.id,
    playerId: players[0].id,
    vote: 6,
  };
}
