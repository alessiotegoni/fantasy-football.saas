"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ChangeOrderDialog() {
  return (
    <Dialog>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
        <DialogTrigger asChild>
          <ActionButton
            variant="ghost"
            loadingText="Cambio ordine"
            action={undefined}
            className="w-full justify-start text-sm py-1.5 rounded-lg"
          >
            Cambia ordine
          </ActionButton>
        </DialogTrigger>
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cambia ordine partecipanti</DialogTitle>
        </DialogHeader>
        <p>Qui andra la lista per cambiare l'ordine.</p>
      </DialogContent>
    </Dialog>
  );
}
