"use client";

import { Form } from "@/components/ui/form";
import useActionToast from "@/hooks/useActionToast";
import usePlayerSelection from "@/hooks/usePlayerSelection";
import usePlayersList from "@/hooks/usePlayersList";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { ZodSchema } from "zod";

type Props<T> = {
  schema: ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  children: React.ReactNode;
  submitFn: (values: T) => Promise<{ error: boolean; message: string }>;
};

export default function PlayersActionsForm<T extends FieldValues>({
  schema,
  defaultValues,
  submitFn,
  children,
}: Props<T>) {
  const toast = useActionToast();

  const { handleResetFilters } = usePlayersList();
  const { stopSelectionMode } = usePlayerSelection();

  const form = useForm<T>({ resolver: zodResolver(schema), defaultValues });

  async function onSubmit(values: T) {
    const res = await submitFn(values);
    toast(res);

    stopSelectionMode();
    handleResetFilters();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </Form>
  );
}
