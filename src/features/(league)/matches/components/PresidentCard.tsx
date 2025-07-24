
import Avatar from "@/components/Avatar";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { Crown } from "iconoir-react";
import { cn } from "@/lib/utils";

type Props = {
  player: LineupPlayer | LineupPlayerWithoutVotes;
};

export default function PresidentCard({ player }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Avatar
        imageUrl={player.avatarUrl}
        name={player.displayName}
        className="size-16"
        renderFallback={() => null}
      />
      <p className="font-semibold mt-2">{player.displayName}</p>
    </div>
  );
}
