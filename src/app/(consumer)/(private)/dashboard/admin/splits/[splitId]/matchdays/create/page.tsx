"use client";

import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createSplitMatchdays } from "@/features/dashboard/admin/splits/actions/splitMatchday";
import MatchdayFields from "@/features/dashboard/admin/splits/components/MatchdayFields";
import {
  createSplitMatchdaysSchema,
  CreateSplitMatchdaysSchema,
} from "@/features/dashboard/admin/splits/schema/splitMatchday";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { use } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function CreateMatchdayPage({
  params,
}: PageProps<"/dashboard/admin/splits/[splitId]/matchdays/create">) {
  const p = use(params);
  const splitId = parseInt(p.splitId);

  const form = useForm<CreateSplitMatchdaysSchema>({
    resolver: zodResolver(createSplitMatchdaysSchema),
    defaultValues: {
      matchdays: [getDefaultValue(splitId)],
    },
  });

  const {
    fields: matchdays,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "matchdays",
  });

  const { isPending, onSubmit } = useHandleSubmit(createSplitMatchdays, {
    isLeaguePrefix: false,
    redirectTo: `/dashboard/admin/splits/${splitId}`,
  });

  return (
    <Container
      headerLabel="Crea giornate"
      renderHeaderRight={() => (
        <Button
          className="w-fit"
          onClick={() => append(getDefaultValue(splitId))}
        >
          <Plus className="size-5" />
          Aggiungi giornata
        </Button>
      )}
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {matchdays.map((matchday, i) => (
            <MatchdayFields
              key={matchday.id}
              index={i}
              remove={remove}
              isLast={i === matchdays.length - 1}
            />
          ))}
          <SubmitButton isLoading={isPending}>Crea giornate</SubmitButton>
        </form>
      </Form>
    </Container>
  );
}

function getDefaultValue(splitId: number) {
  return {
    splitId,
    number: 1,
    status: "upcoming",
    type: "regular",
    startAt: new Date(),
    endAt: new Date(),
  } as const;
}
