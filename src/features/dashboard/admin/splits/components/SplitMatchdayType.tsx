"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { MatchdayType, matchdayTypes } from "@/drizzle/schema";
import useHandleSubmit from "@/hooks/useHandleSubmit";
import { cn } from "@/lib/utils";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { useOptimistic } from "react";

type Props = {
  type: MatchdayType;
  canUpdate?: boolean;
};

export default function SplitMatchdayType({ type, canUpdate = false }: Props) {
  const [optimisticType, updateOptimisticType] = useOptimistic(
    type,
    (_, newType: MatchdayType) => newType
  );

  async function handleUpdateStatus(newType: MatchdayType) {
    updateOptimisticType(newType);
    return; // TODO: server action
  }

  const { isPending, onSubmit: updateStatus } = useHandleSubmit(
    handleUpdateStatus,
    {
      onError: () => updateOptimisticType(type),
    }
  );

  const currentStatusInfo = statusConfig[optimisticType];

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="p-2 px-2.5 gap-2 rounded-full">
        <div
          className={cn("size-2 rounded-full", currentStatusInfo.className)}
        />
        {currentStatusInfo.label}
      </Badge>

      {canUpdate && (
        <Select value={optimisticType} onValueChange={updateStatus}>
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
            {matchdayTypes.map((type) => {
              const config = statusConfig[type];
              return (
                <SelectItem key={type} value={type}>
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

const statusConfig: Record<MatchdayType, { label: string; className: string }> =
  {
    regular: {
      label: "Regular",
      className: "bg-blue-500",
    },
    play_in: {
      label: "Play-in",
      className: "bg-yellow-500",
    },
    quarter_final: {
      label: "Quarter Final",
      className: "bg-orange-500",
    },
    semi_final: {
      label: "Semi Final",
      className: "bg-purple-500",
    },
    final: {
      label: "Final",
      className: "bg-red-500",
    },
  };
