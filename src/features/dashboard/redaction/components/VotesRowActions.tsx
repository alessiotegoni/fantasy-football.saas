import { TrashSolid } from "iconoir-react";
import ActionButton from "@/components/ActionButton";
import { SplitMatchday } from "../../admin/splits/queries/split";
import { deleteVote } from "../votes/actions/vote";
import TableRowActions from "@/components/TableRowActions";
import { MatchdayVote } from "../queries/vote";
import EditVoteDialog from "./EditVoteDialog";

type Props = {
  matchday: SplitMatchday;
  vote: MatchdayVote;
};

export default function VotesRowActions({ matchday, vote }: Props) {
  if (matchday.status === "upcoming") return null;

  return (
    <TableRowActions>
      <EditVoteDialog matchday={matchday} vote={vote} />
      <ActionButton
        action={deleteVote.bind(null, {
          voteId: vote.id,
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
