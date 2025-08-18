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
import { resetCredits } from "../actions/handle-credits";
import { useForm } from "react-hook-form";
import {
  resetCreditsSchema,
  ResetCreditsSchema,
} from "../schema/handle-credits";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import FormSliderField from "@/components/FormFieldSlider";
import useHandleSubmit from "@/hooks/useHandleSubmit";

export default function ResetCreditsDialog({
  leagueId,
  initialCredits,
}: {
  leagueId: string;
  initialCredits: number;
}) {
  const { isPending, onSubmit } = useHandleSubmit(resetCredits);

  const form = useForm<ResetCreditsSchema>({
    resolver: zodResolver(resetCreditsSchema),
    defaultValues: {
      leagueId,
      credits: initialCredits,
    },
  });

  console.log(isPending);


  return (
    <Dialog open={isPending ? true : undefined}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-fit h-fit py-3 sm:px-4 min-w-[100px] rounded-xl"
        >
          Resetta
        </Button>
      </DialogTrigger>
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
              <SubmitButton
                isLoading={isPending}
                variant="destructive"
                className="sm:w-fit"
                loadingText="Resetto crediti"
              >
                Resetta
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
