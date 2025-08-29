"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";
import { ListOrdered } from "lucide-react";

export default function ChangeOrderDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ActionButton
          variant="ghost"
          loadingText="Cambio ordine"
          action={undefined}
          className="justify-start text-sm !px-2 py-1.5 rounded-lg"
        >
          <ListOrdered  />
          Cambia ordine
        </ActionButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambia ordine partecipanti</DialogTitle>
        </DialogHeader>
        <p>Qui andra la lista per cambiare l'ordine.</p>
      </DialogContent>
    </Dialog>
  );
}
