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

type Props = {
  participant: AuctionParticipant;
  role: typeof playerRoles.$inferSelect;
};

export default function AcquisitionsRoleSlots({ participant, role }: Props) {
  const { acquisitions, auction } = useAuction();

  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";
  const roleSlots = auction.settings.playersPerRole[role.id] ?? 1;

  const roleAcquisitions = useMemo(
    () =>
      acquisitions.filter(
        (a) => a.participantId === participant.id && a.player.roleId === role.id
      ),
    [acquisitions]
  );

  return (
    <AccordionItem
      key={role.id}
      value={role.id.toString()}
      className="border-b-0"
    >
      <AccordionTrigger className={cn("p-1.5 px-3", roleStyles)}>
        {role.shortName}
      </AccordionTrigger>
      <AccordionContent className="space-y-1.5 p-0">
        {roleAcquisitions.map((a) => (
          <></>
        ))}
        {Array.from({ length: roleSlots - roleAcquisitions.length }, (_, i) => (
          <div
            key={`${role.id}-${i}`}
            className={cn(
              "h-14 opacity-60 rounded-lg first:mt-1.5",
              roleStyles
            )}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
