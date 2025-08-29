import { useAuction } from "@/contexts/AuctionProvider";
import { AuctionParticipant } from "../queries/auctionParticipant";
import { roleClasses } from "@/components/PlayerRoleBadge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { playerRoles } from "@/drizzle/schema";
import { useMemo } from "react";
import AcquisitionCard from "./AcquisitionCard";
import { ParticipantAcquisition } from "../queries/auctionAcquisition";

type Props = {
  participant: AuctionParticipant;
  role: typeof playerRoles.$inferSelect;
};

export default function AcquisitionsRoleSlots({ participant, role }: Props) {
  const { acquisitions, auction } = useAuction();

  const roleSlots = auction.settings.playersPerRole[role.id] ?? 1;

  const roleAcquisitions = useMemo(
    () =>
      acquisitions.filter(
        (a) => a.participantId === participant.id && a.player.roleId === role.id
      ),
    [acquisitions]
  );

  return (
    <AccordionItem value={role.id.toString()} className="border-b-0">
      <RoleSlotTrigger role={role} acquisitions={roleAcquisitions} />
      <AccordionContent className="space-y-1.5 p-0">
        {roleAcquisitions.map((a) => (
          <AcquisitionCard key={a.id} acquisition={a} role={role} />
        ))}
        {Array.from({ length: roleSlots - roleAcquisitions.length }, (_, i) => (
          <PlaceholderCard key={`${role.id.toString()}-${i}`} role={role} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function RoleSlotTrigger({
  role,
  acquisitions,
}: Pick<Props, "role"> & { acquisitions: ParticipantAcquisition[] }) {
  const { auction } = useAuction();

  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";

  const acquisitionPercentage = useMemo(() => {
    const spentCredits = acquisitions.reduce((acc, a) => (acc += a.price), 0);

    return (spentCredits / auction.settings.initialCredits) * 100;
  }, [acquisitions]);

  return (
    <AccordionTrigger
      className={cn("p-1.5 px-3 opacity-90", roleStyles)}
      chevronClassName="hidden group-hover:block text-white"
    >
      <div className="flex justify-center items-center gap-1.5">
        <p>{role.shortName}</p>
        {!!acquisitionPercentage && (
          <p className="text-xs">{acquisitionPercentage}%</p>
        )}
      </div>
    </AccordionTrigger>
  );
}

function PlaceholderCard({ role }: Pick<Props, "role">) {
  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";

  return (
    <div
      className={cn("h-14 opacity-40 rounded-lg first:mt-1.5", roleStyles)}
    />
  );
}
