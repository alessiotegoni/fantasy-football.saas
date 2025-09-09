"use client";

import Container from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SplitMatchdayFormFields from "@/features/dashboard/admin/splits/components/SplitMatchdayFormFields";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import {
  createSplitMatchdaySchema,
  CreateSplitMatchdaySchema,
} from "@/features/dashboard/admin/splits/schema/splitMatchday";
import { formatPlural } from "@/utils/formatters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { useFieldArray, useForm } from "react-hook-form";

export default function CreateMatchdayPage() {
  const form = useForm<CreateSplitMatchdaySchema>({
    resolver: zodResolver(createSplitMatchdaySchema),
    defaultValues: {
      matchdays: [getDefaultValue()],
    },
  });

  const {
    fields: matchdays,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: "matchdays" });

  function handleAppendMatchday() {
    append(getDefaultValue());
  }

  return (
    <Container
      headerLabel="Crea giornate"
      renderHeaderRight={() => (
        <Button className="w-fit" onClick={handleAppendMatchday}>
          <Plus className="size-5" />
          Aggiungi giornata
        </Button>
      )}
    >
      <Form {...form}>
        <form className="space-y-8">
          {matchdays.map((matchday, i) => (
            <SplitMatchdayFormFields
              key={matchday.id}
              namePrefix={i.toString()}
            />
          ))}
          <SubmitButton>
            Crea{" "}
            {formatPlural(matchdays.length, {
              singular: "giornata",
              plural: "giornate",
            })}
          </SubmitButton>
        </form>
      </Form>
    </Container>
  );
}

function getDefaultValue(): Omit<SplitMatchday, "id" | "splitId"> {
  return {
    number: 1,
    status: "upcoming",
    type: "regular",
    startAt: new Date(),
    endAt: new Date(),
  };
}
