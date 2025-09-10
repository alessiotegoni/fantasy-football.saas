"use client";

import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import MatchdayFields from "@/features/dashboard/admin/splits/components/MatchdayFields";
import {
  createSplitMatchdaySchema,
  CreateSplitMatchdaySchema,
} from "@/features/dashboard/admin/splits/schema/splitMatchday";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { useFieldArray, useForm } from "react-hook-form";

export default function CreateMatchdayPage() {
  const form = useForm<CreateSplitMatchdaySchema>({
    resolver: zodResolver(createSplitMatchdaySchema),
    defaultValues: {
      matchdays: [defaultValue],
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

  return (
    <Container
      headerLabel="Crea giornate"
      renderHeaderRight={() => (
        <Button className="w-fit" onClick={() => append(defaultValue)}>
          <Plus className="size-5" />
          Aggiungi giornata
        </Button>
      )}
    >
      <Form {...form}>
        <form className="space-y-8">
          {matchdays.map((matchday, i) => (
            <MatchdayFields
              key={matchday.id}
              index={i}
              remove={remove}
              isLast={i === matchdays.length - 1}
            />
          ))}
          <SubmitButton>Crea giornate</SubmitButton>
        </form>
      </Form>
    </Container>
  );
}

const defaultValue = {
  number: 1,
  status: "upcoming",
  type: "regular",
  startAt: new Date(),
  endAt: new Date(),
} as const;
