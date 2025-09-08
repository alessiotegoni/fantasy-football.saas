"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { addTeamsCredits } from "../actions/handle-credits";
import { useForm } from "react-hook-form";
import { addCreditsSchema, AddCreditsSchema } from "../schema/handle-credits";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import FormSliderField from "@/components/FormFieldSlider";
import useHandleSubmit from "@/hooks/useHandleSubmit";

export default function AddCreditsDialog({
  leagueId,
  initialCredits,
}: {
  leagueId: string;
  initialCredits: number;
}) {
  const form = useForm<AddCreditsSchema>({
    resolver: zodResolver(addCreditsSchema),
    defaultValues: {
      leagueId,
      creditsToAdd: 50,
    },
  });

  const { isPending, onSubmit, dialogProps } = useHandleSubmit(
    addTeamsCredits,
    {
      isDialogControlled: true,
    }
  );

  return (
    <Dialog {...dialogProps}>
      <Button
        variant="outline"
        asChild
        className="sm:w-fit h-fit py-3 sm:px-4 min-w-[100px] rounded-xl !bg-input/90 sm:!bg-input/30"
      >
        <DialogTrigger>Aggiungi</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vuoi aggiungere i crediti ?</DialogTitle>
          <DialogDescription>
            I crediti che sceglierai verranno aggiunti a quelli gia in possesso
            delle squadre. Se la somma dei crediti di una squadra ed i crediti
            aggiunti e' maggiore dei crediti iniziali della lega (
            {initialCredits}), verranno settati a quel numero
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSliderField<AddCreditsSchema>
              label="Crediti da aggiungere"
              min={1}
              max={initialCredits}
              name="creditsToAdd"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild className="sm:w-fit">
                <Button variant="outline">Chiudi</Button>
              </DialogClose>
              <SubmitButton
                isLoading={isPending}
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
