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
import { use, useEffect, useState } from "react";
import { resetCredits } from "../actions/handle-credits";

export default function ResetCreditsDialog({
  leagueId,
  defaultCreditsPromise,
}: {
  leagueId: string;
  defaultCreditsPromise: Promise<number>;
}) {
  const [credits, setCredits] = useState<number>(use(defaultCreditsPromise));

  //   const defaultCredits = use(defaultCreditsPromise);

  //   useEffect(() => {
  //     setCredits(defaultCredits);
  //   }, [defaultCredits]);

  return (
    <Dialog>
      <Button asChild>
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
      </DialogContent>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Chiudi</Button>
        </DialogClose>
        <ActionButton
          action={resetCredits.bind(null, {
            leagueId,
            credits,
          })}
        >
          Resetta
        </ActionButton>
      </DialogFooter>
    </Dialog>
  );
}
