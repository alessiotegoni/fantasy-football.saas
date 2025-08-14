"use client";

import { useState, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
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
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { AuctionWithCreator } from "../queries/auction";

type Props = {
  leagueId: string;
  groupedAuctions: Partial<Record<"classic" | "repair", AuctionWithCreator[]>>;
  isLeagueAdmin?: boolean;
  selectedSplit: { status: string };
};

export default function AuctionsList({
  leagueId,
  groupedAuctions,
  isLeagueAdmin = false,
  selectedSplit,
}: Props) {
  const [optimisticAuctions, updateOptimisticAuctions] = useOptimistic(
    groupedAuctions,
    (
      state,
      { auctionId, newStatus }: { auctionId: string; newStatus: string }
    ) => {
      const newState = { ...state };
      Object.keys(newState).forEach((type) => {
        if (newState[type as keyof typeof newState]) {
          newState[type as keyof typeof newState] = newState[
            type as keyof typeof newState
          ]?.map((auction) =>
            auction.id === auctionId
              ? { ...auction, status: newStatus as any }
              : auction
          );
        }
      });
      return newState;
    }
  );

  const handleStatusChange = async (auctionId: string, newStatus: string) => {
    updateOptimisticAuctions({ auctionId, newStatus });
    // Here you would make the API call to update the status
    // await updateAuctionStatus(auctionId, newStatus);
  };

  const handleDeleteAuction = async (auctionId: string) => {
    // Handle auction deletion
    // await deleteAuction(auctionId);
  };

  return (
    <div className="space-y-8">
      {Object.entries(optimisticAuctions).map(([type, auctions]) => {
        if (!auctions?.length) return null;

        return (
          <section key={type} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {sectionTitles[type as keyof typeof sectionTitles]}
            </h2>

            <div className="space-y-3">
              {auctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  leagueId={leagueId}
                  isLeagueAdmin={isLeagueAdmin}
                  canChangeStatus={selectedSplit.status !== "ended"}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteAuction}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AuctionCard({
  auction,
  leagueId,
  isLeagueAdmin,
  canChangeStatus,
  onStatusChange,
  onDelete,
}: {
  auction: AuctionWithCreator;
  leagueId: string;
  isLeagueAdmin: boolean;
  canChangeStatus: boolean;
  onStatusChange: (auctionId: string, newStatus: string) => void;
  onDelete: (auctionId: string) => void;
}) {
  const [showStatusSelect, setShowStatusSelect] = useState(false);
  const statusInfo = statusConfig[auction.status];

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      {/* Header with name and status */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium text-card-foreground flex-1 min-w-0">
          {auction.name}
        </h3>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-muted">
              <div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {statusInfo.label}
              </span>
            </div>

            {/* Status change chevron */}
            {canChangeStatus && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowStatusSelect(!showStatusSelect)}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Admin dropdown */}
          {isLeagueAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/leagues/${leagueId}/premium/auctions/${auction.id}/edit`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica asta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(auction.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Elimina asta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Status select dropdown */}
      {showStatusSelect && canChangeStatus && (
        <div className="pt-2 border-t border-border">
          <Select
            value={auction.status}
            onValueChange={(value) => {
              onStatusChange(auction.id, value);
              setShowStatusSelect(false);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig)
                .filter(([status]) => status !== "waiting")
                .map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Creator info */}
      <div className="text-sm text-muted-foreground">
        Creata da{" "}
        <span className="font-medium">{auction.creator.managerName}</span>
      </div>

      {/* Description */}
      {auction.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {auction.description}
        </p>
      )}

      {/* Participate button */}
      <div className="pt-2">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/leagues/${leagueId}/auctions/${auction.id}`}>
            Partecipa
          </Link>
        </Button>
      </div>
    </div>
  );
}

const statusConfig = {
  active: { label: "Attiva", color: "bg-green-500" },
  paused: { label: "In pausa", color: "bg-yellow-500" },
  waiting: { label: "In attesa", color: "bg-gray-500" },
  ended: { label: "Terminata", color: "bg-red-500" },
};

const sectionTitles = {
  classic: "Classica",
  repair: "Di riparazione",
};
