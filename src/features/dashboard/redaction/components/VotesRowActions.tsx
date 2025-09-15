import TableRowActions from "@/components/TableRowActions";
import ActionButton from "@/components/ActionButton";
import { TrashSolid } from "iconoir-react";

type Props = {};

export default function VotesRowActions({}: Props) {
  return (
    <TableRowActions>
      <ActionButton
        action={() => ""}
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
