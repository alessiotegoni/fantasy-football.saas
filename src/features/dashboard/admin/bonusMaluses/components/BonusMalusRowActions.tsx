import { TrashSolid } from "iconoir-react";
import { MatchdayBonusMalus } from "../queries/bonusMalus";
import ActionButton from "@/components/ActionButton";
import { SplitMatchday } from "../../splits/queries/split";
import { BonusMalusType } from "../queries/bonusMalusType";
import { deleteBonusMalus } from "../actions/bonusMalus";
import EditBonusMalusDialog from "./EditBonusMalusDialog";
import TableRowActions from "@/components/TableRowActions";

type Props = {
  matchday: SplitMatchday;
  bonusMalus: MatchdayBonusMalus;
  bonusMalusTypes: BonusMalusType[];
};

export default function BonusMalusRowActions({ matchday, ...props }: Props) {
  if (matchday.status === "upcoming") return null;

  return (
    <TableRowActions>
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
    </TableRowActions>
  );
}
