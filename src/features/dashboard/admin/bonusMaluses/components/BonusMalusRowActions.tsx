import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVert, TrashSolid } from "iconoir-react";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import ActionButton from "@/components/ActionButton";
import { SplitMatchday } from "../../splits/queries/split";
import { BonusMalusType } from "../queries/bonusMalusType";
import { deleteBonusMalus } from "../actions/bonusMalus";
import EditBonusMalusDialog from "./EditBonusMalusDialog";

type Props = {
  matchday: SplitMatchday;
  bonusMalus: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function BonusMalusRowActions({ matchday, ...props }: Props) {
  if (matchday.status === "upcoming") return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVert className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-1 max-w-40">
        <EditBonusMalusDialog matchday={matchday} {...props} />
        <ActionButton
          action={deleteBonusMalus.bind(null, {
            bonusMalusId: props.bonusMalus.id,
            matchdayId: matchday.id,
          })}
          loadingText="Elimino..."
          requireAreYouSure
          className="px-2 py-1.5 text-sm rounded-lg justify-start"
        >
          <TrashSolid />
          Elimina
        </ActionButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
