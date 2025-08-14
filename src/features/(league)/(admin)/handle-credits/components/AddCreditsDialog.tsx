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
import { addTeamsCredits, resetCredits } from "../actions/handle-credits";
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

export default function AddCreditsDialog({ leagueId }: { leagueId: string }) {
  const toast = useActionToast();

  const form = useForm<ResetCreditsSchema>({
    resolver: zodResolver(resetCreditsSchema),
    defaultValues: {
      leagueId,
      creditsToAdd: 50,
    },
  });

  async function onSubmit(data: ResetCreditsSchema) {
    const res = await addTeamsCredits(data);
    toast(res);
  }

  return (
    <Dialog open={form.formState.isSubmitting ? true : undefined}>
      <Button
        variant="outline"
        asChild
        className="w-fit h-fit py-3 sm:px-4 min-w-[100px] rounded-xl"
      >
        <DialogTrigger>Aggiungi</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vuoi davvero aggiungere i crediti ?</DialogTitle>
          <DialogDescription>
            I crediti che sceglierai verranno aggiunti a quelli gia in possesso
            delle squadre. Se la somma dei crediti di una squadra ed i crediti
            aggiunti e' maggiore dei crediti iniziali della lega (), verranno
            settati a quel numero
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSliderField<ResetCreditsSchema>
              label="Crediti da aggiungere"
              min={200}
              max={5000}
              name="creditsToAdd"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild className="sm:w-fit">
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <SubmitButton
                variant="outline"
                className="sm:w-fit"
                loadingText="Aggiungo crediti"
              >
                Aggiungi
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
