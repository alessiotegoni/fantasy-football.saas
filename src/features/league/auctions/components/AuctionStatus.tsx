"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { type AuctionStatus } from "@/drizzle/schema";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { useOptimistic } from "react";
import { updateAuctionStatus } from "../actions/auction";

type Props = {
  auction: {
    id: string;
    status: AuctionStatus;
  };
  canUpdate: boolean;
};

export default function AuctionStatus({ auction, canUpdate }: Props) {
  const [optimisticStatus, updateOptimisticStatus] = useOptimistic(
    auction.status,
    (_, newStatus: AuctionStatus) => newStatus
  );

  async function handleUpdateStatus(status: AuctionStatus) {
    updateOptimisticStatus(status);
    return updateAuctionStatus({ id: auction.id, status });
  }

  const { isPending, onSubmit: updateStatus } = useHandleSubmit(
    handleUpdateStatus,
    {
      onError: () => updateOptimisticStatus(auction.status),
    }
  );

  const statusInfo = statusConfig[optimisticStatus];

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="p-2 px-2.5 gap-2 rounded-full">
        <div className={`size-2 rounded-full ${statusInfo.className}`} />
        {statusInfo.badgeLabel}
      </Badge>

      {canUpdate && (
        <Select value={optimisticStatus} onValueChange={updateStatus}>
          <SelectTrigger
            className="h-8 w-8 p-0 cursor-pointer !bg-transparent border-0
                    hover:!bg-primary transition-colors justify-center"
            showChevron={false}
            disabled={isPending}
          >
            {isPending ? (
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
