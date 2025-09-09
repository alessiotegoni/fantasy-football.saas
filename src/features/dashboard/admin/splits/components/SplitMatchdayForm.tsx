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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { matchdayTypes } from "@/drizzle/schema/splitMatchdays";
import SplitStatus from "./SplitStatus";
import SplitMatchdayType from "./SplitMatchdayType";

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
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex justify-between">
              <FormLabel>Stato</FormLabel>
              <FormControl>
                <SplitStatus
                  status={field.value}
                  onStatusChange={field.onChange}
                  canUpdate
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex justify-between">
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <SplitMatchdayType type={field.value} canUpdate />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero giornata</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Numero della giornata"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid sm:grid-cols-2 sm:gap-4">
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data di inizio</FormLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data di fine</FormLabel>
                <DatePicker date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton isLoading={isPending}>
          {matchday ? "Salva modifiche" : "Crea giornata"}
        </SubmitButton>
      </form>
    </Form>
  );
}
