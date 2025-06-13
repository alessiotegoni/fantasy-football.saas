"use client";

import { Form } from "@/components/ui/form";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import useActionToast from "@/hooks/useActionToast";
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
  const { toggleSelectDialog } = usePlayerSelection();

  const form = useForm<T>({ resolver: zodResolver(schema), defaultValues });

  async function handleSubmit(values: T) {
    const res = await submitFn(values);
    toast(res);

    toggleSelectDialog(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>{children}</form>
    </Form>
  );
}
