import { Badge } from "@/components/ui/badge";
import { LineupPlayer } from "../queries/match";

export default function LineupPlayerVotes({
  vote,
  totalVote,
}: Pick<LineupPlayer, "vote" | "totalVote">) {
  return (
    <Badge className="bg-primary min-w-14 mb-1 rounded-full">
      <p className="">{vote}</p>
    </Badge>
  );
}
