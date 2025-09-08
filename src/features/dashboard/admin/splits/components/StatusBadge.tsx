import { Badge } from "@/components/ui/badge";
import { SplitStatusType } from "@/drizzle/schema/splits";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: SplitStatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClasses = {
    upcoming: "bg-blue-500 text-white",
    live: "bg-green-500 text-white",
    ended: "bg-red-500 text-white",
  };

  return (
    <Badge className={cn(statusClasses[status], "capitalize")}>
      {status}
    </Badge>
  );
}
