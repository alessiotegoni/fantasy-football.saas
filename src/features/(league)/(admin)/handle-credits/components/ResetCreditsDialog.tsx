"use client";

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
import FormSliderField from "@/components/FormFieldSlider";

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

  async function onSubmit(data: ResetCreditsSchema) {
    const res = await resetCredits(data);
    toast(res);
  }

  return (
    <Dialog open={form.formState.isSubmitting ? true : undefined}>
      <Button asChild className="w-fit py-2.5 px-3 sm:py-3.5 sm:px-4">
        <DialogTrigger>Resetta crediti</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vuoi davvero resettare i crediti ?</DialogTitle>
          <DialogDescription>
            I crediti di tutte le squadre verranno settati col numero che
            imposterai qui sotto
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSliderField<ResetCreditsSchema>
              label="Crediti di reset"
              min={200}
              max={5000}
              name="credits"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild className="sm:w-fit">
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <SubmitButton className="sm:w-fit" loadingText="Resetto crediti">
                Resetta
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
