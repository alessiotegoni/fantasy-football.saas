"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/datepicker";
import SubmitButton from "@/components/SubmitButton";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { SplitMatchday } from "../queries/split";
import {
  EditSplitMatchdaySchema,
  editSplitMatchdaySchema,
} from "../schema/splitMatchday";
import SplitStatus from "./SplitStatus";
import SplitMatchdayType from "./SplitMatchdayType";
import SplitMatchdayFormFields from "./SplitMatchdayFormFields";

type Props = {
  matchday?: SplitMatchday;
};

export default function SplitMatchdayForm({ matchday }: Props) {
  const form = useForm<EditSplitMatchdaySchema>({
    resolver: zodResolver(editSplitMatchdaySchema),
    defaultValues: {
      number: matchday?.number ?? 1,
      startAt: matchday?.startAt ? matchday.startAt : new Date(),
      endAt: matchday?.endAt ? matchday.endAt : new Date(),
      status: matchday?.status ?? "upcoming",
      type: matchday?.type ?? "regular",
    },
  });

  const { isPending, onSubmit } = useHandleSubmit(
    () => new Promise((resolve) => resolve()), // Placeholder for action
    {
      isLeaguePrefix: false,
      redirectTo: `/dashboard/admin/splits`,
    }
  );

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
