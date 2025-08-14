"use client";

import { useOptimistic, useState, useTransition } from "react";
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
import {
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import type { AuctionWithCreator } from "../queries/auction";
import ActionButton from "@/components/ActionButton";
import { AuctionStatus } from "@/drizzle/schema";
import { deleteAuction, updateAuctionStatus } from "../actions/auction";
import useActionToast from "@/hooks/useActionToast";

type Props = {
  auction: AuctionWithCreator;
  leagueId: string;
  isLeagueAdmin: boolean;
  canEdit: boolean;
};

export default function AuctionCard({
  auction,
  leagueId,
  isLeagueAdmin,
  canEdit,
}: Props) {
  const toast = useActionToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const [optimisticStatus, updateOptimisticStatus] = useOptimistic(
    auction.status,
    (_, newStatus: AuctionStatus) => newStatus
  );

  const [isStatusPending, startStatusTransition] = useTransition();

  function handleStatusChange(status: AuctionStatus) {
    startStatusTransition(async () => {
      updateOptimisticStatus(status);

      const res = await updateAuctionStatus({ id: auction.id, status });

      if (res.error) updateOptimisticStatus(auction.status);

      toast(res);
    });
  }

  async function handleDeleteAuction() {
    setIsDeleting(true);

    const res = await deleteAuction(auction.id);
    setIsDeleting(false);

    return res;
  }

  console.log(isDeleting);

  const statusInfo = statusConfig[optimisticStatus];
  const canUpdateAuction = canEdit && auction.status !== "ended";

  return (
    <div className="bg-input/30 border border-border rounded-4xl p-5 min-h-40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-card-foreground flex-1 min-w-0">
            {auction.name}
          </h3>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="p-2 px-2.5 gap-2 rounded-full"
              >
                <div
                  className={`size-2 rounded-full ${statusInfo.className}`}
                />
                {statusInfo.badgeLabel}
              </Badge>

              {isLeagueAdmin && canUpdateAuction && (
                <Select
                  value={optimisticStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger
                    className="h-8 w-8 p-0 cursor-pointer !bg-transparent border-0
                    hover:!bg-primary transition-colors justify-center"
                    showChevron={false}
                    disabled={isStatusPending}
                  >
                    {isStatusPending ? (
                      <LoaderCircle className="animate-spin !size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig)
                      .filter(([status]) => status !== "waiting")
                      .map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-2 rounded-full ${config.className}`}
                            />
                            {config.selectLabel}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {isLeagueAdmin && (
              <DropdownMenu open={isDeleting ? true : undefined}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0 rounded-full">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="space-y-1">
                  {canUpdateAuction && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/leagues/${leagueId}/premium/auctions/${auction.id}/edit`}
                      >
                        <Edit />
                        Modifica asta
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <ActionButton
                      variant="destructive"
                      loadingText="Elimino"
                      action={handleDeleteAuction}
                    >
                      <Trash2 className="text-white" />
                      Elimina asta
                    </ActionButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
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
  active: {
    badgeLabel: "In corso",
    selectLabel: "Inizia",
    className: "bg-green-500",
  },
  paused: {
    badgeLabel: "In pausa",
    selectLabel: "Stoppa",
    className: "bg-yellow-500",
  },
  waiting: {
    badgeLabel: "In attesa",
    selectLabel: "Attendi",
    className: "bg-gray-500",
  },
  ended: {
    badgeLabel: "Terminata",
    selectLabel: "Termina",
    className: "bg-red-500",
  },
};
