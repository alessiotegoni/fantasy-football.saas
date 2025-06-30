import { Badge } from "@/components/ui/badge";
import { formatPlural } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Coins } from "iconoir-react";

export default function TeamCreditsBadge({
  credits,
  className,
}: {
  credits: number;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary",
        className
      )}
    >
      <Coins className="!size-4" />
      {formatPlural(credits, { singular: "credito", plural: "crediti" })}
    </Badge>
  );
}
