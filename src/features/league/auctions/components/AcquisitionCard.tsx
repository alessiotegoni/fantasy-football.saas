import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ParticipantAcquisition } from "../queries/auctionAcquisition";
import { playerRoles } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { Coins } from "iconoir-react";
import { useAuction } from "@/contexts/AuctionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ActionButton from "@/components/ActionButton";
import { removeAcquiredPlayer } from "../actions/auctionAcquisition";

type Props = {
  acquisition: ParticipantAcquisition;
  role: typeof playerRoles.$inferSelect;
};

export default function AcquisitionCard({ acquisition, role }: Props) {
  const { isLeagueAdmin } = useAuction();

  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          "h-14 rounded-lg first:mt-1.5 p-2 flex gap-3 justify-between items-center w-full",
          roleStyles
        )}
      >
        <div className="text-left">
          <p className="font-semibold">{acquisition.player.displayName}</p>
          <p className="text-white/70 text-[11px]">
            {acquisition.player.team.displayName}
          </p>
        </div>
        <div className="flex items-center gap-1 text-primary p-1.5">
          <Coins />
          <p className="font-semibold">{acquisition.price}</p>
        </div>
      </DropdownMenuTrigger>
      {isLeagueAdmin && (
        <AcquisitionDropdownContent acquisition={acquisition} />
      )}
    </DropdownMenu>
  );
}

function AcquisitionDropdownContent({
  acquisition,
}: Pick<Props, "acquisition">) {
  return (
    <DropdownMenuContent className="space-y-1">
      <DropdownMenuItem asChild>
        <Button asChild variant="ghost">
          <Link href={`/players/${acquisition.playerId}`}>
            Vedi scheda giocatore
          </Link>
        </Button>
      </DropdownMenuItem>
      <ActionButton
        variant="destructive"
        loadingText="Rimuovo"
        action={removeAcquiredPlayer.bind(null, acquisition.id)}
        className="px-2 py-1.5 rounded-lg text-sm justify-start"
        requireAreYouSure
        areYouSureDescription="Il giocatore verra rimosso, al partecipante sarano restituiti i crediti spesi."
      >
        Rimuovi giocatore
      </ActionButton>
    </DropdownMenuContent>
  );
}

const roleClasses: Record<string, string> = {
  Portiere: "bg-blue-500/70",
  Difensore: "bg-green-500/70",
  Centrocampista: "bg-yellow-500/70",
  Attaccante: "bg-red-500/70",
};
