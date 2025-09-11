import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVert, TrashSolid } from "iconoir-react";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActionButton from "@/components/ActionButton";
import { SplitMatchday } from "../../splits/queries/split";
import { BonusMalusType } from "../queries/bonusMalusType";

type Props = {
  matchday: SplitMatchday;
  bonusMalus: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function BonusMalusRowActions({
  matchday,
  bonusMalus,
  bonusMalusTypes,
}: Props) {
  if (matchday.status === "upcoming") return null;

  return (
    <Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVert className="size-4" />
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
