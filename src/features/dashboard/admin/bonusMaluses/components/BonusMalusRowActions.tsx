"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVert } from "iconoir-react";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
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
        <DropdownMenuContent align="end">
          <DialogTrigger>Modifica</DialogTrigger>
          <ActionButton action={() => ""} requireAreYouSure>
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
