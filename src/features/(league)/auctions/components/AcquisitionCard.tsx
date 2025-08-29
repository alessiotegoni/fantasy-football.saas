import { ParticipantAcquisition } from "../queries/auctionAcquisition";
import { playerRoles } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { Coins } from "iconoir-react";

type Props = {
  acquisition: ParticipantAcquisition;
  role: typeof playerRoles.$inferSelect;
};

export default function AcquisitionCard({ acquisition, role }: Props) {
  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";

  return (
    <div
      className={cn(
        "h-14 rounded-lg first:mt-1.5 p-2 flex gap-3 justify-between items-center",
        roleStyles
      )}
    >
      <div>
        <p>{acquisition.player.displayName}</p>
        <p className="text-muted-foreground text-xs">{acquisition.player.team.displayName}</p>
      </div>
      <div className="flex items-center gap-1 text-primary p-1.5">
        <Coins />
        <p className="font-semibold">

         {acquisition.price}
        </p>
      </div>
    </div>
  );
}

const roleClasses: Record<string, string> = {
  Portiere: "bg-blue-500/70",
  Difensore: "bg-green-500/70",
  Centrocampista: "bg-yellow-500/70",
  Attaccante: "bg-red-500/70",
};
