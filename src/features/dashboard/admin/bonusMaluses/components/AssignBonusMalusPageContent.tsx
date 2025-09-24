"use client";

import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  createBonusMalusSchema,
  CreateBonusMalusSchema,
} from "../schema/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { SplitMatchday } from "../../splits/queries/split";
import { Player } from "../../players/queries/player";
import BonusMalusFormFields from "./BonusMalusFormFields";
import { Separator } from "@/components/ui/separator";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import { createBonusMaluses } from "../actions/bonusMalus";

type Props = {
  matchday: SplitMatchday;
  players: Player[];
  bonusMalusTypes: BonusMalusType[];
};

export default function AssignBonusMalusPageContent(props: Props) {
  const form = useForm<CreateBonusMalusSchema>({
    resolver: zodResolver(createBonusMalusSchema),
    defaultValues: {
      bonusMaluses: [getDefaultValue(props)],
    },
  });

  const {
    fields: bonusMaluses,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "bonusMaluses",
  });

  const { isPending, onSubmit } = useHandleSubmit(createBonusMaluses, {
    isLeaguePrefix: false,
    redirectTo: `/dashboard/admin/bonus-maluses`,
  });

  return (
    <Container
      headerLabel="Assegna bonus/malus"
      headerRight={
        <Button
          className="w-fit"
          onClick={() => append(getDefaultValue(props))}
        >
          <Plus className="size-5" />
          Aggiungi
        </Button>
      }
    >
      <h3 className="text-xl font-semibold mb-4">
        Giornata: {props.matchday.number}
      </h3>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {bonusMaluses.map((bonusMalus, index) => (
            <div key={bonusMalus.id} className="space-y-6">
              <BonusMalusFormFields
                {...props}
                namePrefix={`bonusMaluses.${index}`}
              />
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
              {index !== bonusMaluses.length - 1 && <Separator />}
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
  bonusMalusTypes,
  players,
}: Props): CreateBonusMalusSchema["bonusMaluses"][number] {
  return {
    matchdayId: matchday.id,
    bonusMalusTypeId: bonusMalusTypes[0].id,
    playerId: players[0].id,
    count: 1,
  };
}
