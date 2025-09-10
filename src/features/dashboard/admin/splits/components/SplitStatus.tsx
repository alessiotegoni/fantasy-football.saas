"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { type SplitStatusType, splitStatuses } from "@/drizzle/schema/splits";
import { cn } from "@/lib/utils";
import { ChevronDown, LoaderCircle } from "lucide-react";

interface StatusBadgeProps {
  status: SplitStatusType;
  canUpdate?: boolean;
  onStatusChange?: (status: SplitStatusType) => void;
  isPending?: boolean;
}

export default function SplitStatus({
  status,
  canUpdate = false,
  isPending = false,
  onStatusChange,
}: StatusBadgeProps) {
  const currentStatusInfo = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="p-2 px-2.5 gap-2 rounded-full">
        <div
          className={cn("size-2 rounded-full", currentStatusInfo.className)}
        />
        {currentStatusInfo.label}
      </Badge>

      {canUpdate && (
        <Select value={status} onValueChange={onStatusChange}>
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
            {splitStatuses.map((statusValue) => {
              const config = statusConfig[statusValue];
              return (
                <SelectItem key={statusValue} value={statusValue}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("size-2 rounded-full", config.className)}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

const statusConfig: Record<
  SplitStatusType,
  { label: string; className: string }
> = {
  live: {
    label: "Live",
    className: "bg-green-500",
  },
  upcoming: {
    label: "In arrivo",
    className: "bg-blue-500",
  },
  ended: {
    label: "Terminato",
    className: "bg-red-500",
  },
};
