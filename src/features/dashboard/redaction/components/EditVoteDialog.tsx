"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SplitMatchday } from "../../admin/splits/queries/split";
import { MatchdayVote } from "../queries/vote";
import { Button } from "@/components/ui/button";
import { Edit } from "iconoir-react";
import { useForm } from "react-hook-form";
import { editVoteSchema, EditVoteSchema } from "../votes/schema/vote";
import { zodResolver } from "@hookform/resolvers/zod";
import VoteFormFields from "./VoteFormFields";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { updateVote } from "../votes/actions/vote";
import { UserRedaction } from "../../user/queries/user";

type Props = {
  matchday: SplitMatchday;
  vote: MatchdayVote;
  userRedaction: UserRedaction | undefined;
};

export default function EditVoteDialog({ matchday, vote, userRedaction }: Props) {
  const form = useForm<EditVoteSchema>({
    resolver: zodResolver(editVoteSchema),
    defaultValues: {
      id: vote.id,
      playerId: vote.player.id,
      matchdayId: matchday.id,
      redactionId: userRedaction?.id,
      vote: parseFloat(vote.vote),
    },
  });

  const { isPending, onSubmit, dialogProps } = useHandleSubmit(updateVote, {
    isLeaguePrefix: false,
    isDialogControlled: true,
  });

  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 py-1.5 text-sm rounded-lg justify-start"
        >
          <Edit />
          Modifica
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifca voto</DialogTitle>
        </DialogHeader>
        <h3 className="font-medium">Giornata: {matchday.number}</h3>
        <Form {...form}>
          <form
            className="space-y-4 flex flex-col items-end"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <VoteFormFields vote={vote} />
            <SubmitButton
              loadingText="Modifico"
              className="sm:w-fit"
              isLoading={isPending}
            >
              Modifica
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
