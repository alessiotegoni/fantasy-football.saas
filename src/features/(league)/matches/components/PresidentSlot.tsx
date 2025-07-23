import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { LineupPlayer } from "../queries/match";

type Props = {
  canEditLineup: boolean;
  president: LineupPlayer | LineupPlayerWithoutVotes | undefined;
};

export default function PresidentSlot({}: Props) {
  return <div className="size-full bg-input/30 rounded-4xl"></div>;
}
