import { Badge } from "@/components/ui/badge";
import { SplitStatusType } from "@/drizzle/schema/splits";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: SplitStatusType;
}

const statusConfig: Record<SplitStatusType, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-500",
  },
  live: {
    label: "Live",
    className: "bg-green-500",
  },
  ended: {
    label: "Ended",
    className: "bg-red-500",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className="p-2 px-2.5 gap-2 rounded-full">
      <div className={cn("size-2 rounded-full", config.className)} />
      {config.label}
    </Badge>
  );
}
