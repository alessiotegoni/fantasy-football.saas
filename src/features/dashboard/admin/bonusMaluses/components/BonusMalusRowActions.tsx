"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVert, Trash, TrashSolid } from "iconoir-react";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";

type Props = {
  bonusMalus: MatchdayBonusMalus;
};

export default function BonusMalusRowActions({ bonusMalus }: Props) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVert className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="space-y-1 max-w-40">
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 py-1.5 text-sm rounded-lg justify-start"
            >
              <Edit />
              Modifica
            </Button>
          </DialogTrigger>
          <ActionButton
            action={() => ""}
            requireAreYouSure
            className="px-2 py-1.5 text-sm rounded-lg justify-start"
          >
            <TrashSolid />
            Elimina
          </ActionButton>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>Modifica</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
