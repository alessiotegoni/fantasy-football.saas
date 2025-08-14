"use client";

import { useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ChevronDown, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AuctionWithCreator } from "../queries/auction";
import ActionButton from "@/components/ActionButton";
import { AuctionStatus } from "@/drizzle/schema";

type Props = {
  auction: AuctionWithCreator;
  leagueId: string;
  isLeagueAdmin: boolean;
  canChangeStatus: boolean;
};

export default function AuctionCard({
  auction,
  leagueId,
  isLeagueAdmin,
  canChangeStatus,
}: Props) {
  const [optimisticStatus, updateOptimisticStatus] = useOptimistic(
    auction.status
  );

  const statusInfo = statusConfig[optimisticStatus];

  return (
    <div className="bg-input/30 border border-border rounded-4xl p-5 min-h-40 flex flex-col justify-between">
      {/* Header with name and status */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-card-foreground flex-1 min-w-0">
            {auction.name}
          </h3>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Status badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <div className={`size-2 rounded-full ${statusInfo.color}`} />
                {statusInfo.label}
              </Badge>

              {isLeagueAdmin && canChangeStatus && (
                <Select
                  value={optimisticStatus}
                  onValueChange={(newStatus) =>
                    updateOptimisticStatus(newStatus as AuctionStatus)
                  }
                >
                  <SelectTrigger
                    className="h-8 w-8 p-0 cursor-pointer !bg-transparent border-0
                    hover:!bg-primary transition-colors justify-center"
                    showChevron={false}
                  >
                    <ChevronDown className="size-5" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig)
                      .filter(([status]) => status !== "waiting")
                      .map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-2 rounded-full ${config.color}`}
                            />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {isLeagueAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0 rounded-full">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="space-y-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/leagues/${leagueId}/premium/auctions/${auction.id}/edit`}
                    >
                      <Edit />
                      Modifica asta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ActionButton variant="destructive" action={() => ""}>
                      <Trash2 className="text-white" />
                      Elimina asta
                    </ActionButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1.5">
          Creata da{" "}
          <span className="font-medium">{auction.creator.managerName}</span>
        </div>
      </div>

      {auction.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {auction.description}
        </p>
      )}

      <Button asChild className="self-end sm:w-fit">
        <Link href={`/leagues/${leagueId}/auctions/${auction.id}`}>
          Partecipa
        </Link>
      </Button>
    </div>
  );
}

const statusConfig = {
  active: { label: "Attiva", color: "bg-green-500" },
  paused: { label: "In pausa", color: "bg-yellow-500" },
  waiting: { label: "In attesa", color: "bg-gray-500" },
  ended: { label: "Terminata", color: "bg-red-500" },
};
