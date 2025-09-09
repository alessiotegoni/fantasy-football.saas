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
import { EditSplitSchema, editSplitSchema } from "../schema/split";
import { Split } from "../queries/split";
import { DatePicker } from "@/components/ui/datepicker";
import SubmitButton from "@/components/SubmitButton";
import SplitStatus from "./SplitStatus";
import useHandleSubmit from "@/hooks/useHandleSubmit";

type Props = {
  split?: Split;
};

export default function SplitForm({ split }: Props) {
  const form = useForm<EditSplitSchema>({
    resolver: zodResolver(editSplitSchema),
    defaultValues: {
      name: split?.name ?? "",
      startDate: split?.startDate ? new Date(split.startDate) : new Date(),
      endDate: split?.endDate ? new Date(split.endDate) : new Date(),
      status: split?.status ?? "upcoming",
    },
  });

  const { isPending, onSubmit } = useHandleSubmit(
    () => new Promise((resolve) => resolve()),
    {
      isLeaguePrefix: false,
      redirectTo: "/dashboard/admin/splits",
    }
  );
  // const { isPending, onSubmit } = useHandleSubmit(split ? editSplit : createSplit, {
  //   isLeaguePrefix: false,
  //   redirectTo: "/dashboard/admin/splits",
  // });

  return (
    <>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome dello split" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-2 sm:gap-4">
            <FormField
              control={form.control}
              name="startDate"
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
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data di fine</FormLabel>
                  <DatePicker date={field.value} setDate={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SubmitButton>
            {split ? "Salva modifiche" : "Crea split"}
          </SubmitButton>
        </form>
      </Form>
    </>
  );
}
