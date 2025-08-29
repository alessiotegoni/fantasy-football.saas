import { useAuction } from "@/contexts/AuctionProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Coins, Shield } from "iconoir-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ParticipantDropdown from "./ParticipantDropdown";
import { type AuctionParticipant } from "../queries/auctionParticipant";

export default function AuctionParticipant({
  participant,
}: {
  participant: AuctionParticipant;
}) {
  const {
    userParticipant,
    turnParticipant,
    isLeagueAdmin = false,
  } = useAuction();

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={cn(
            "bg-input/60 p-4 border rounded-3xl hover:bg-muted/50 cursor-pointer transition-colors min-w-70 relative mb-4",
            participant.id === turnParticipant?.id
              ? "border-primary"
              : "border-border"
          )}
        >
          {participant.id === userParticipant?.id && isLeagueAdmin && (
            <Badge className="absolute top-3 right-3 size-5 rounded-full bg-primary flex justify-center items-center p-0">
              <Shield className="size-3 fill-white" />
            </Badge>
          )}
          <div className="flex flex-col items-center justify-center gap-1">
            <h3 className="font-medium text-lg">
              {participant.team?.name || "Team eliminato"}
            </h3>
            <div className="flex items-center gap-2 text-primary">
              <Coins />
              <h2 className="font-semibold text-2xl">{participant.credits}</h2>
            </div>
          </div>
        </DropdownMenuTrigger>
        {isLeagueAdmin && <ParticipantDropdown participant={participant} />}
      </DropdownMenu>
    </div>
  );
}


//   <div className="space-y-1 text-xs text-muted-foreground">
//     <div className="flex justify-between">
//       <span>Giocatori:</span>
//       {/* <span className="font-medium">{participant.}</span> */}
//     </div>
//     <div className="flex justify-between">
//       <span>% Spesi:</span>
//       {/* <span className="font-medium">{participant.spent}%</span> */}
//     </div>
//   </div>
