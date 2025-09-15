"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { Button } from "@/components/ui/button";
import { Edit } from "iconoir-react";
import { useForm } from "react-hook-form";
import {
  editBonusMalusSchema,
  EditBonusMalusSchema,
} from "../schema/bonusMalus";
import { zodResolver } from "@hookform/resolvers/zod";
import BonusMalusFormFields from "./BonusMalusFormFields";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { updateBonusMalus } from "../actions/bonusMalus";

type Props = {
  matchday: SplitMatchday;
  bonusMalus: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function EditBonusMalusDialog({
  matchday,
  bonusMalus,
  ...props
}: Props) {
  const form = useForm<EditBonusMalusSchema>({
    resolver: zodResolver(editBonusMalusSchema),
    defaultValues: {
      id: bonusMalus.id,
      playerId: bonusMalus.player.id,
      matchdayId: matchday.id,
      bonusMalusTypeId: bonusMalus.bonusMalusType.id,
      count: bonusMalus.count,
    },
  });

  const { isPending, onSubmit, dialogProps } = useHandleSubmit(
    updateBonusMalus,
    {
      isLeaguePrefix: false,
      isDialogControlled: true,
    }
  );

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
          <DialogTitle>Modifca bonus/malus</DialogTitle>
        </DialogHeader>
        <h3 className="font-medium">Giornata: {matchday.number}</h3>
        <Form {...form}>
          <form
            className="space-y-4 flex flex-col items-end"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <BonusMalusFormFields bonusMalus={bonusMalus} {...props} />
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
