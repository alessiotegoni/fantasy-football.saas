import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SplitMatchday } from "../../splits/queries/split";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import { BonusMalusType } from "../queries/bonusMalusType";
import { Button } from "@/components/ui/button";
import { Edit } from "iconoir-react";
import BonusMalusForm from "./BonusMalusForm";

type Props = {
  matchday: SplitMatchday;
  bonusMalus: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function EditBonusMalusDialog({
  matchday,
  bonusMalus,
  ...props
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 py-1.5 text-sm rounded-lg justify-start"
        >
          <Edit />
          Modifica
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifca bonus/malus</DialogTitle>
        </DialogHeader>
        <div>
          <h3 className="font-medium">Giornata: {matchday.number}</h3>
          <h3 className="font-medium">
            Giocatore: {bonusMalus.player.displayName}
          </h3>
        </div>
        <BonusMalusForm
          matchday={matchday}
          bonusMalus={bonusMalus}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
}
