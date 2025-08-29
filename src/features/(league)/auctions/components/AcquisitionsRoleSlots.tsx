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
import { AuctionWithSettings } from "../queries/auction";

type Props = {
  participant: AuctionParticipant;
  role: typeof playerRoles.$inferSelect;
};

export default function AcquisitionsRoleSlots({ participant, role }: Props) {
  const { acquisitions, auction } = useAuction();

  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";
  const roleSlots = auction.settings.playersPerRole[role.id] ?? 1;

  const roleAcquisitions = [
    {
      id: "dwdwdw",
      playerId: 2,
      auctionId: "dwdwdw",
      participantId: "dwdwdw",
      price: 150,
      acquiredAt: new Date(),
      player: {
        id: 150,
        displayName: "Perrotti",
        roleId: 1,
        team: {
          displayName: "z-milano",
        },
      },
    },
    {
      id: "dwdwdw",
      playerId: 2,
      auctionId: "dwdwdw",
      participantId: "dwdwdw",
      price: 43,
      acquiredAt: new Date(),
      player: {
        id: 323,
        displayName: "Perrotti",
        roleId: 2,
        team: {
          displayName: "z-milano",
        },
      },
    },
  ];
  //   const roleAcquisitions = useMemo(
  //     () =>
  //       acquisitions.filter(
  //         (a) => a.participantId === participant.id && a.player.roleId === role.id
  //       ),
  //     [acquisitions]
  //   );

  const acquisitionPercentage = useMemo(() => {
    const spentCredits = roleAcquisitions.reduce(
      (acc, a) => (acc += a.price),
      0
    );

    return (spentCredits / auction.settings.initialCredits) * 100;
  }, [roleAcquisitions]);

  return (
    <AccordionItem
      key={role.id}
      value={role.id.toString()}
      className="border-b-0"
    >
      <AccordionTrigger className={cn("p-1.5 px-3", roleStyles)}>
        <div className="flex justify-center items-center gap-1.5">
          <p>{role.shortName}</p>
          {!!acquisitionPercentage && (
            <p className="text-xs">{acquisitionPercentage}%</p>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-1.5 p-0">
        {roleAcquisitions.map((a) => (
          <AcquisitionCard acquisition={a} role={role} />
        ))}
        {Array.from({ length: roleSlots - roleAcquisitions.length }, () => (
          <PlaceholderCard role={role} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function PlaceholderCard({ role }: Pick<Props, "role">) {
  const roleStyles = roleClasses[role.name] ?? "bg-muted text-foreground";

  return (
    <div
      key={role.id.toString()}
      className={cn("h-14 opacity-40 rounded-lg first:mt-1.5", roleStyles)}
    />
  );
}
