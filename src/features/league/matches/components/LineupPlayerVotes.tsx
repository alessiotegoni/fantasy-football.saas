import { Badge } from "@/components/ui/badge";
import { LineupPlayer } from "../queries/match";
import { cn } from "@/lib/utils";
import { formatVoteValue } from "@/features/dashboard/redaction/votes/utils/vote";

export default function LineupPlayerVotes({
  vote,
  totalVote,
  lineupPlayerType,
}: Pick<LineupPlayer, "vote" | "totalVote" | "lineupPlayerType">) {
  const isBench = lineupPlayerType === "bench";

  return (
    <Badge
      className={cn(
        "bg-transparent w-16 rounded-full p-0 gap-0 mb-1 font-heading",
        isBench && "flex-col w-7 mb-0 h-12"
      )}
    >
      <div className="bg-muted flex justify-center items-center py-0.5 px-1 basis-1/2 w-full">
        {formatVoteValue(vote, "up")}
      </div>
      <div className="bg-primary flex justify-center items-center py-0.5 px-1 basis-1/2 w-full">
        {formatVoteValue(totalVote, "up")}
      </div>
    </Badge>
  );
}
