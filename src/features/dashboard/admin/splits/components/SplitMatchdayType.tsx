"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { MatchdayType, matchdayTypes } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Props = {
  type: MatchdayType;
  onTypeChange: (type: MatchdayType) => void;
  canUpdate?: boolean;
};

export default function SplitMatchdayType({
  type,
  onTypeChange,
  canUpdate = false,
}: Props) {
  const currentTypeInfo = typeConfig[type];

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="p-2 px-2.5 gap-2 rounded-full">
        <div className={cn("size-2 rounded-full", currentTypeInfo.className)} />
        {currentTypeInfo.label}
      </Badge>

      {canUpdate && (
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger
            className="h-8 w-8 p-0 cursor-pointer !bg-transparent border-0
            hover:!bg-primary transition-colors justify-center"
            showChevron={false}
          >
            <ChevronDown className="size-5" />
          </SelectTrigger>
          <SelectContent>
            {matchdayTypes.map((type) => {
              const config = typeConfig[type];
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

const typeConfig = {
  regular: {
    label: "Regolare",
    className: "bg-blue-500",
  },
  play_in: {
    label: "Play-in",
    className: "bg-yellow-500",
  },
  quarter_final: {
    label: "Quarti di finale",
    className: "bg-orange-500",
  },
  semi_final: {
    label: "Semi finale",
    className: "bg-purple-500",
  },
  final: {
    label: "Finale",
    className: "bg-blue-500",
  },
};
