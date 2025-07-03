"use client";

import ActionButton from "@/components/ActionButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { use } from "react";
import { resetCredits } from "../actions/handle-credits";
import { useForm } from "react-hook-form";
import {
  resetCreditsSchema,
  ResetCreditsSchema,
} from "../schema/handle-credits";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import useActionToast from "@/hooks/useActionToast";

export default function ResetCreditsDialog({
  leagueId,
  defaultCreditsPromise,
}: {
  leagueId: string;
  defaultCreditsPromise: Promise<number>;
}) {
  const toast = useActionToast();

  const form = useForm<ResetCreditsSchema>({
    resolver: zodResolver(resetCreditsSchema),
    defaultValues: {
      leagueId,
      credits: use(defaultCreditsPromise) ?? 500,
    },
  });

  console.log(form.getValues());
  

  async function onSubmit(data: ResetCreditsSchema) {
    const res = await resetCredits(data);
    toast(res);
  }

  return (
    <Dialog open={form.formState.isSubmitting ? true : undefined}>
      <Button asChild className="w-fit">
        <DialogTrigger>Resetta crediti</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vuoi davvero resettare i crediti ?</DialogTitle>
          <DialogDescription>
            I crediti di tutte le squadre verranno settati col numero scelto da
            te nelle impostazioni generali della lega
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogFooter>
              <DialogClose asChild className="sm:w-fit">
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <SubmitButton className="sm:w-fit">Resetta</SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
