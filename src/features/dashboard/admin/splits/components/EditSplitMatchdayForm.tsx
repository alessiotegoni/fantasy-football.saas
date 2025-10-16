"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { SplitMatchday } from "../queries/split";
import {
  UpdateSplitMatchdaySchema,
  updateSplitMatchdaySchema,
} from "../schema/splitMatchday";
import SplitMatchdayFormFields from "./SplitMatchdayFormFields";
import { updateSplitMatchday } from "../actions/splitMatchday";
import { Href } from "@/utils/helpers";

type Props = {
  matchday: SplitMatchday;
};

export default function EditSplitMatchdayForm({ matchday }: Props) {
  const form = useForm<UpdateSplitMatchdaySchema>({
    resolver: zodResolver(updateSplitMatchdaySchema),
    defaultValues: matchday,
  });

  const { isPending, onSubmit } = useHandleSubmit(updateSplitMatchday, {
    isLeaguePrefix: false,
    redirectTo: `/dashboard/admin/splits/${matchday.splitId}` as Href,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <SplitMatchdayFormFields />
        <SubmitButton isLoading={isPending}>
          {matchday ? "Salva modifiche" : "Crea giornata"}
        </SubmitButton>
      </form>
    </Form>
  );
}
